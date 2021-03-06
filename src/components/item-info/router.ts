import * as express from 'express';
import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import ItemInfoController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class ItemInfoRouter implements IRouter {
  public setupRoutes(application: express.Application, resources: IApplicationResources) {
    const itemInfoController: ItemInfoController = new ItemInfoController(resources);

    application.get(
      '/info/:id',
      AuthMiddleware.getVerifier('administrator', 'user'),
      itemInfoController.getById.bind(itemInfoController));
    application.get(
      '/item/:iid/info',
      AuthMiddleware.getVerifier('administrator', 'user'),
      itemInfoController.getAllOfItem.bind(itemInfoController));
  }
}
