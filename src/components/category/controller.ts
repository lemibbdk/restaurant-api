import { NextFunction, Request, Response } from 'express';
import CategoryModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory, IAddCategoryValidator } from './dto/IAddCategory';
import { IEditCategory, IEditCategoryValidator } from './dto/IEditCategory';
import BaseController from '../../common/BaseController';

class CategoryController extends BaseController{


  async getAll(req: Request, res: Response) {
    const categories = await this.services.categoryService.getAll({
        loadSubcategories: true
      }
    );

    res.send(categories);
  }

  async getById(req: Request, res: Response) {
    const id: string = req.params.id;
    const categoryId: number = +id;

    if (categoryId <= 0) {
      res.sendStatus(400)
      return;
    }

    const data: CategoryModel|null|IErrorResponse = await this.services.categoryService.getById(
      categoryId,
      {
        loadSubcategories: true
      }
    );

    if (data === null) {
      res.sendStatus(404);
      return;
    }

    if (data instanceof CategoryModel) {
      if (data.subCategories.length === 0) {
        const dataItems = await this.services.itemService.getAllByCategory(
          data.categoryId,
          {loadAllInfoItem: true}
        );

        if (Array.isArray(dataItems)) {
          data.items = dataItems;
        }
      }

      res.send(data);
      return
    }

    res.status(500).send(data);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    if (!IAddCategoryValidator(req.body)) {
      res.status(400).send(IAddCategoryValidator.errors);
      return;
    }

    const data = req.body as IAddCategory;

    if (data.parentCategoryId) {
      console.log('usao')
      const parentCategoryData = await this.services.categoryService.getById(
        data.parentCategoryId,
        {loadItems: true}
      ) as CategoryModel;
      console.log(parentCategoryData)
      if (parentCategoryData.items.length !== 0) {
        console.log(parentCategoryData.items)
        res.status(400).send({errorMessage: "Parent category have items and it is low level category."})
        return;
      }
    }

    const result = await this.services.categoryService.add(data);

    res.send(result);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const categoryId: number = +id;

    if (categoryId <= 0) {
      res.sendStatus(400)
      return;
    }

    const data = req.body;

    if (!IEditCategoryValidator(data)) {
      res.status(400).send(IEditCategoryValidator.errors);
      return;
    }

    const result = await this.services.categoryService.edit(
      categoryId,
      data as IEditCategory,
      {
        loadSubcategories: true
      }
    );

    if (result === null) {
      res.sendStatus(404);
      return;
    }

    res.send(result);
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    const categoryId: number = +id;

    if (categoryId <= 0) {
      res.status(400).send('Invalid ID number.');
      return;
    }

    res.send(await this.services.categoryService.delete(categoryId));
  }
}

export default CategoryController;
