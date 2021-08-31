import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import { Application } from 'express';
import AuthMiddleware from '../../middleware/auth.middleware';
import EvaluationController from './controller';

export default class EvaluationRouter implements IRouter {
  public setupRoutes(application: Application, resources: IApplicationResources) {
    const evaluationController = new EvaluationController(resources);

    application.get(
      '/evaluation',
      AuthMiddleware.getVerifier('administrator', 'user'),
      evaluationController.getAll.bind(evaluationController));
    application.get(
      '/evaluation/:id',
      AuthMiddleware.getVerifier('administrator', 'user'),
      evaluationController.getById.bind(evaluationController));
    application.post(
      '/evaluation',
      AuthMiddleware.getVerifier('user'),
      evaluationController.add.bind(evaluationController));
  }
}
