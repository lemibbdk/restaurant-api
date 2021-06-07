import * as express from 'express';
import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import ItemController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class ItemRouter implements IRouter {
  public setupRoutes(application: express.Application, resources: IApplicationResources) {
    const itemController: ItemController = new ItemController(resources);

    application.get(
      '/item',
      AuthMiddleware.getVerifier('administrator', 'user'),
      itemController.getAll.bind(itemController));
    application.get(
      '/item/:id',
      AuthMiddleware.getVerifier('administrator', 'user'),
      itemController.getById.bind(itemController));
    application.post(
      '/item',
      AuthMiddleware.getVerifier('administrator'),
      itemController.add.bind(itemController));
    application.put(
      '/item/:id',
      AuthMiddleware.getVerifier('administrator'),
      itemController.edit.bind(itemController));
    application.delete(
      '/item/:id',
      AuthMiddleware.getVerifier('administrator'),
      itemController.deleteById.bind(itemController));
    application.delete(
      '/item/:iid/photo/:pid',
      AuthMiddleware.getVerifier('administrator'),
      itemController.deleteItemPhoto.bind(itemController));
    application.post(
      '/item/:id/photo',
      AuthMiddleware.getVerifier('administrator'),
      itemController.addItemPhotos.bind(itemController));
    application.get(
      '/category/all/:id/item',
      AuthMiddleware.getVerifier('administrator', 'user'),
      itemController.getAllByCategory.bind(itemController));
  }
}
