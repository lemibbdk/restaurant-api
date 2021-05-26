import { NextFunction, Request, Response } from 'express';
import IErrorResponse from '../../common/IErrorResponse.interface';
import ItemInfoModel from './model';
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
}

export default ItemInfoController;
