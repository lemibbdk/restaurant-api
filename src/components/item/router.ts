import * as express from 'express';
import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import ItemService from './service';
import ItemController from './controller';

export default class ItemRouter implements IRouter {
  public setupRoutes(application: express.Application, resources: IApplicationResources) {
    const itemService: ItemService = new ItemService(resources.databaseConnection);
    const itemController: ItemController = new ItemController(itemService);

    application.get('/item', itemController.getAll.bind(itemController));
    application.get('/item/:id', itemController.getById.bind(itemController));
    application.post('/item', itemController.add.bind(itemController));
    application.put('/item/:id', itemController.edit.bind(itemController));
  }
}
