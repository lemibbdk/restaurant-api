import * as express from 'express';
import CategoryController from './controller';
import CategoryService from './service';
import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';


export default class CategoryRouter implements IRouter {
  public setupRoutes(application: express.Application, resources: IApplicationResources) {
    const categoryService: CategoryService = new CategoryService(resources.databaseConnection);
    const categoryController: CategoryController = new CategoryController(categoryService);

    application.get('/category', categoryController.getAll.bind(categoryController));
    application.get('/category/:id', categoryController.getById.bind(categoryController));
    application.post('/category', categoryController.add.bind(categoryController));
  }

}
