import ItemService from './service';
import { NextFunction, Request, Response } from 'express';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';

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
}

export default ItemController;