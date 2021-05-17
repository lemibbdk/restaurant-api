import ItemService from './service';
import { NextFunction, Request, Response } from 'express';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddItem, IAddItemValidator } from './dto/IAddItem';
import { IEditItem, IEditItemValidator } from './dto/IEditItem';

class ItemController {
  private itemService: ItemService;

  constructor(itemService: ItemService) {
    this.itemService = itemService
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const items = await this.itemService.getAll();

    res.send(items);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const itemId: number = +id;

    if (itemId <= 0) {
      res.sendStatus(400);
      return;
    }

    const data: ItemModel|null|IErrorResponse = await this.itemService.getById(itemId);

    if (data === null) {
      res.sendStatus(404);
      return;
    }

    if (data instanceof ItemModel) {
      res.send(data);
      return;
    }

    res.status(500).send(data);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    if (!IAddItemValidator(data)) {
      res.status(400).send(IAddItemValidator.errors);
      return;
    }

    const result = await this.itemService.add(data as IAddItem);

    res.send(result);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const itemId: number = +id;

    if (itemId <= 0) {
      res.sendStatus(400)
      return;
    }

    const data = req.body;

    if (!IEditItemValidator(data)) {
      res.status(400).send(IEditItemValidator.errors);
      return;
    }

    const result = await this.itemService.edit(itemId, data as IEditItem);

    if (result === null) {
      res.sendStatus(404)
      return;
    }

    res.send(result);
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    const itemId: number = +id;

    if (itemId <= 0) {
      res.status(400).send('Invalid ID number.');
      return;
    }

    res.send(await this.itemService.delete(itemId));
  }
}

export default ItemController;
