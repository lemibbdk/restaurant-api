import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import { Application } from 'express';
import AdministratorController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class AdministratorRouter implements IRouter {
  public setupRoutes(application: Application, resources: IApplicationResources) {
    const administratorController = new AdministratorController(resources);

    application.get(
      '/administrator',
      AuthMiddleware.getVerifier('administrator'),
      administratorController.getAll.bind(administratorController));
    application.get(
      '/administrator/:id',
      AuthMiddleware.getVerifier('administrator'),
      administratorController.getById.bind(administratorController));
    application.post(
      '/administrator',
      AuthMiddleware.getVerifier('administrator'),
      administratorController.add.bind(administratorController));
    application.put(
      '/administrator/:id',
      AuthMiddleware.getVerifier('administrator'),
      administratorController.edit.bind(administratorController));
    application.delete(
      '/administrator/:id',
      AuthMiddleware.getVerifier('administrator'),
      administratorController.delete.bind(administratorController))
  }
}
