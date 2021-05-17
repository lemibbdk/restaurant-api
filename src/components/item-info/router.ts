import * as express from 'express';
import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import ItemInfoService from './service';
import ItemInfoController from './controller';

export default class ItemInfoRouter implements IRouter {
  public setupRoutes(application: express.Application, resources: IApplicationResources) {
    const itemInfoService: ItemInfoService = new ItemInfoService(resources.databaseConnection);
    const itemInfoController: ItemInfoController = new ItemInfoController(itemInfoService);

    application.get('/info/:id', itemInfoController.getById.bind(itemInfoController));
    application.get('/item/:iid/info', itemInfoController.getAllOfItem.bind(itemInfoController));
    application.post('/info', itemInfoController.add.bind(itemInfoController));
    application.put('/info/:id', itemInfoController.edit.bind(itemInfoController));
  }
}
