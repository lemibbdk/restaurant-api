import CategoryService from './service';
import {Request, Response} from 'express';

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

    const category = await this.categoryService.getById(categoryId);

    if (category === null) {
      res.sendStatus(404);
    }

    res.send(category);
  }
}

export default CategoryController;
