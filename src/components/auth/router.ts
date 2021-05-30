import ItemRouter from '../item/router';
import IApplicationResources from '../../common/IApplicationResources.interface';
import { Application } from 'express';
import AuthController from './controller';

export default class AuthRouter implements ItemRouter {
  setupRoutes(application: Application, resources: IApplicationResources) {
    const authController: AuthController = new AuthController(resources);

    application.post('/auth/user/login', authController.userLogin.bind(authController));
    application.post('/auth/administrator/login', authController.administratorLogin.bind(authController));
  }
}
