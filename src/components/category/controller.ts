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
}

export default CategoryController;
