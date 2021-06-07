import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import { Application } from 'express';
import UserController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class UserRouter implements IRouter {
  public setupRoutes(application: Application, resources: IApplicationResources) {
    const userController = new UserController(resources);

    application.get(
      '/user',
      AuthMiddleware.getVerifier('administrator'),
      userController.getAll.bind(userController));
    application.get(
      '/user/:id',
      AuthMiddleware.getVerifier('administrator', 'user'),
      userController.getById.bind(userController));
    application.post(
      '/user',
      userController.add.bind(userController));
    application.put(
      '/user/:id',
      AuthMiddleware.getVerifier('administrator', 'user'),
      userController.edit.bind(userController));
    application.post(
      '/auth/user/register',
      userController.register.bind(userController));
  }
}
