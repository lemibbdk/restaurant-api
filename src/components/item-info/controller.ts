import { NextFunction, Request, Response } from 'express';
import IErrorResponse from '../../common/IErrorResponse.interface';
import ItemInfoModel from './model';
import { IAddItemInfo, IAddItemInfoValidator } from './dto/IAddItemInfo';
import { IEditItemInfo, IEditItemInfoValidator } from './dto/IEditItemInfo';
import BaseController from '../../common/BaseController';

class ItemInfoController extends BaseController {
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const itemInfoId: number = +id;

    if (itemInfoId <= 0) {
      res.sendStatus(400);
      return;
    }

    const data: ItemInfoModel|null|IErrorResponse = await this.services.itemInfoService.getById(itemInfoId, {
      loadItem: true
    });

    if (data === null) {
      res.sendStatus(404);
      return;
    }

    if (data instanceof ItemInfoModel) {
      res.send(data);
      return;
    }

    res.status(500).send(data);
  }

  public async getAllOfItem(req: Request, res: Response, next: NextFunction) {
    const itemId: number = +(req.params.iid);

    if (itemId <= 0) {
      res.sendStatus(400);
      return;
    }

    res.send(await this.services.itemInfoService.getAllByItemId(itemId));

  }

  public async add(req: Request, res: Response, next: NextFunction) {
    if (!IAddItemInfoValidator(req.body)) {
      res.status(400).send(IAddItemInfoValidator.errors);
      return;
    }

    const itemInfo = req.body as IAddItemInfo;

    const sizeInfo = await this.checkSizes(itemInfo.itemId, itemInfo.size);
    if (sizeInfo.status) {
      res.status(sizeInfo.status).send(sizeInfo.data);
      return;
    }

    const result = await this.services.itemInfoService.add(itemInfo);

    res.send(result);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const itemInfoId = +(req.params.id);

    if (itemInfoId <= 0) {
      res.sendStatus(400)
      return;
    }

    if (!IEditItemInfoValidator(req.body)) {
      res.status(400).send(IEditItemInfoValidator.errors);
      return;
    }

    const result = await this.services.itemInfoService.getById(itemInfoId);

    if (result === null) {
      res.sendStatus(404);
      return;
    }

    if (!(result instanceof ItemInfoModel)) {
      res.status(500).send(result);
      return;
    }

    res.send(await this.services.itemInfoService.edit(itemInfoId, req.body as IEditItemInfo, {loadItem: true}));
  }

  async checkSizes(itemId, size: string) {
    const data: ItemInfoModel[]|IErrorResponse = await this.services.itemInfoService.getAllByItemId(itemId);

    if (Array.isArray(data)) {
      if (data.length !== 0) {
        const sizes = data.map(el => el.size);

        if (sizes.includes(size)) {
          return {
            status: 500,
            data: {errorMessage: 'Size ' + size + ' already exists for this item.'}
          }
        }
      }
    }
  }
}

export default ItemInfoController;
