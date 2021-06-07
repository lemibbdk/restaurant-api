import * as express from 'express';
import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import ItemController from './controller';

export default class ItemRouter implements IRouter {
  public setupRoutes(application: express.Application, resources: IApplicationResources) {
    const itemController: ItemController = new ItemController(resources);

    application.get('/item', itemController.getAll.bind(itemController));
    application.get('/item/:id', itemController.getById.bind(itemController));
    application.post('/item', itemController.add.bind(itemController));
    application.put('/item/:id', itemController.edit.bind(itemController));
    application.delete('/item/:id', itemController.deleteById.bind(itemController));
    application.delete('/item/:iid/photo/:pid', itemController.deleteItemPhoto.bind(itemController));
    application.post('/item/:id/photo', itemController.addItemPhotos.bind(itemController));
    application.get('/category/all/:id/item', itemController.getAllByCategory.bind(itemController));
  }
}
