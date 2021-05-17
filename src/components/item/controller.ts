import { NextFunction, Request, Response } from 'express';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddItem, IAddItemValidator } from './dto/IAddItem';
import { IEditItem, IEditItemValidator } from './dto/IEditItem';
import BaseController from '../../common/BaseController';
import CategoryModel from '../category/model';

class ItemController extends BaseController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const items = await this.services.itemService.getAll();

    res.send(items);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const itemId = +(req.params.id);

    if (itemId <= 0) {
      res.sendStatus(400);
      return;
    }

    const data: ItemModel|null|IErrorResponse = await this.services.itemService.getById(itemId, {
      loadAllInfoItem: true,
      loadItemCategory: true
    });

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
    if (!IAddItemValidator(req.body)) {
      res.status(400).send(IAddItemValidator.errors);
      return;
    }

    const item = req.body as IAddItem

    if (item.categoryId <= 0) {
      res.sendStatus(400);
      return;
    }

    const categoryData = await this.categoryValidation(item);

    if (categoryData.status) {
      res.status(categoryData.status).send(categoryData.data);
      return;
    }

    const result = await this.services.itemService.add(item);

    res.send(result);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const itemId = +(req.params.id);

    if (itemId <= 0) {
      res.sendStatus(400)
      return;
    }

    if (!IEditItemValidator(req.body)) {
      res.status(400).send(IEditItemValidator.errors);
      return;
    }

    const data = req.body as IEditItem;

    const categoryData = await this.categoryValidation(data);
    res.status(categoryData.status).send(categoryData.data);

    const result = await this.services.itemService.edit(itemId, data as IEditItem);

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

    res.send(await this.services.itemService.delete(itemId));
  }

  async categoryValidation(item: IAddItem|IEditItem) {
    const categoryResult: CategoryModel|null|IErrorResponse = await this.services.categoryService.getById(
      item.categoryId,
      {
        loadSubcategories: true
      });

    if (categoryResult === null) {
      return {
        status: 404,
        data: {message: "Category doesn't exist."}
      }
    }

    if (categoryResult instanceof CategoryModel) {
      if (categoryResult.subCategories.length !== 0) {
        return {
          status: 400,
          data: { message: 'Item category can be only low level category.' }
        }
      }
    } else {
      return {
        status: 500,
        data: categoryResult
      }
    }
  }
}

export default ItemController;
