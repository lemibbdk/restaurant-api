import CategoryService from './service';
import {Request, Response} from 'express';
import CategoryModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';

class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async getAll(req: Request, res: Response) {
    const categories = await this.categoryService.getAll();

    res.send(categories);
  }

  async getById(req: Request, res: Response) {
    const id: string = req.params.id;
    const categoryId: number = +id;

    if (categoryId <= 0) {
      res.sendStatus(400)
      return;
    }

    const category: CategoryModel|null|IErrorResponse = await this.categoryService.getById(categoryId);

    if (category === null) {
      res.sendStatus(404);
      return;
    }

    if (category instanceof CategoryModel) {
      res.send(category);
      return
    }

    res.status(500).send(category);
  }
}

export default CategoryController;
