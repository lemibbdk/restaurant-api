import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import IAddCart, { IAddCartValidator } from './dto/IAddCart';
import CartModel from './model';
import { IOrderStatus, IOrderStatusValidator } from './dto/IOrderStatus';
import IAddOrder, { IAddOrderValidator } from './dto/IAddOrder';
import IEditCart, { IEditOrderValidator } from './dto/IEditCart';

export default class CartController extends BaseController {
  private isCallerUser(req: Request, res: Response): boolean {
    if (req.authorized?.role !== 'user') {
      res.status(403).send('This action is only available to the user role.');
      return false;
    }

    if (!req.authorized?.id) {
      res.status(403).send('Unknown user identifier.');
      return false;
    }

    return true;
  }

  public async getCurrentUserCart(req: Request, res: Response) {
    if (!this.isCallerUser(req, res)) return;

    res.send(await this.services.cartService.getLatestCartByUserId(req.authorized?.id))
  }

  public async addToCart(req: Request, res: Response) {
    if (!this.isCallerUser(req, res)) return;

    if (!IAddCartValidator(req.body)) {
      return res.status(400).send(IAddCartValidator.errors);
    }

    const data = req.body as IAddCart;

    const itemInfo = await this.services.itemInfoService.getById(data.itemInfoId);

    if (itemInfo === null) {
      return res.status(404).send('Item not found.')
    }

    const result = await this.services.cartService.addItemToLatestCartByUserId(req.authorized?.id, data.itemInfoId, data.quantity);

    if (result === null) {
      res.status(400).send(`Cannot update order which isn't on pending status.`);
    }

    res.send(result);
  }

  public async setInCart(req: Request, res: Response) {
    if (!this.isCallerUser(req, res)) return;

    if (!IAddCartValidator(req.body)) {
      return res.status(400).send(IAddCartValidator.errors);
    }

    const data = req.body as IAddCart;

    const itemInfo = await this.services.itemInfoService.getById(data.itemInfoId);

    if (itemInfo === null) {
      return res.status(404).send('Item not found.')
    }

    if (data.notLastCart) {
      if (!data.cartId) return res.status(400).send('Must provide cart id');
      res.send(await this.services.cartService.setItemToCart(req.authorized?.id, data.itemInfoId, data.quantity, data.notLastCart, data.cartId));
    } else {
      res.send(await this.services.cartService.setItemToCart(req.authorized?.id, data.itemInfoId, data.quantity));
    }

  }

  public async makeOrder(req: Request, res: Response) {
    if (!this.isCallerUser(req, res)) return;

    if (!IAddOrderValidator(req.body)) {
      return res.status(400).send(IAddOrderValidator.errors);
    }

    const data = req.body as IAddOrder;

    const now = new Date();
    const desired = new Date(data.desiredDeliveryTime);

    if (now.getFullYear() !== desired.getFullYear() ||
      now.getMonth() !== desired.getMonth() ||
      now.getDate() !== desired.getDate()) {
      return res.status(400).send('Desired delivery time must be on same date.')
    }

    const differenceInMinutes = Math.round((desired.getTime() - now.getTime()) / 60);

    if (differenceInMinutes < 45) {
      return res.status(400).send('Desired delivery time can be at least 45 minutes.');
    }

    const result = await this.services.cartService.makeOrder(req.authorized?.id, data);

    if (!(result instanceof CartModel)) {
      return res.status(400).send(result)
    }

    res.send(result);
  }

  public async editCart(req: Request, res: Response) {
    if (!this.isCallerUser(req, res)) return;

    const itemId = +(req.params.cid);

    if (itemId <= 0) {
      res.sendStatus(400)
      return;
    }

    if (!IEditOrderValidator(req.body)) {
      return res.status(400).send(IEditOrderValidator.errors);
    }

    const cartResult = await this.services.cartService.getById(itemId, {loadInfoItems: true, loadOrder: true});

    if (cartResult === null) {
      res.sendStatus(404);
      return;
    }

    if (!(cartResult instanceof CartModel)) {
      return cartResult;
    }

    if (cartResult.order.status !== 'pending') {
      return res.status(400).send({message: 'Cant edit cart which isn\'t on pending!'})
    }

    const data = req.body as IEditCart;

    const now = new Date();
    const desired = new Date(data.order.desiredDeliveryTime);

    if (now.getFullYear() !== desired.getFullYear() ||
      now.getMonth() !== desired.getMonth() ||
      now.getDate() !== desired.getDate()) {
      return res.status(400).send('Desired delivery time must be on same date.')
    }

    const differenceInMinutes = Math.round((desired.getTime() - now.getTime()) / 60);

    if (differenceInMinutes < 45) {
      return res.status(400).send('Desired delivery time can be at least 45 minutes.');
    }

    const result = await this.services.cartService.editOrder(data);

    if (!(result instanceof CartModel)) {
      return res.status(500).send(result)
    }

    res.send(result);
  }

  public async getAllOrdersForCurrentUser(req: Request, res: Response) {
    if (!this.isCallerUser(req, res)) return;

    res.send(await this.services.cartService.getAllOrdersByUserId(req.authorized?.id));
  }

  public async getAllOrders(req: Request, res: Response) {
    res.send(await this.services.cartService.getAllOrders());
  }

  public async getAllOrdersByUserId(req: Request, res: Response) {
    const userId: number = +(req.params.uid);

    if (userId < 0) {
      return res.status(400).send('Invalid user id.')
    }

    res.send(await this.services.cartService.getAllOrdersByUserId(userId));
  }

  public async setStatus(req: Request, res: Response) {
    const cartId: number = +(req.params.cid);

    if (cartId < 0) {
      return res.status(400).send('Invalid cart id.')
    }

    if (req.authorized.role === 'user' && req.body.status !== 'rejected') {
      return res.status(400).send('Invalid status.')
    }

    if (!IOrderStatusValidator(req.body)) {
      return res.status(400).send(IOrderStatusValidator.errors);
    }

    const data = req.body as IOrderStatus;

    const cart = await this.services.cartService.getById(cartId, {
      loadOrder: true
    });

    if (cart.order === null) {
      return res.status(400).send({
        errorCode: -3022,
        errorMessage: 'This cart has no order.'
      });
    }

    if (cart.order.status === 'accepted' && req.authorized?.role === 'user' && data.status === 'rejected') {
      return res.status(400).send({message: 'Can\'t cancel order which is already accepted.'});
    }

    res.send(await this.services.cartService.setOrderStatus(cartId, data, cart));
  }
}
