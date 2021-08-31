import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import EvaluationModel from './model';
import { IAddEvaluation, IAddEvaluationValidator } from './dto/IAddEvaluation';

export default class EvaluationController extends BaseController {
  public async getAll(req: Request, res: Response) {
    res.send(await this.services.evaluationService.getAll())
  }

  public async getById(req: Request, res: Response) {
    const id = +(req.params.id);

    if (id <=0 ) return res.status(400).send({errorMessage: 'The id value cannot be smaller than 1.'});

    const data = await this.services.evaluationService.getById(id);

    if (data === null) return res.sendStatus(404);

    if (data instanceof EvaluationModel) {
      return res.send(data);
    }

    res.status(500).send(data);
  }

  public async add(req: Request, res: Response) {
    if (!IAddEvaluationValidator(req.body)) {
      return res.status(400).send(IAddEvaluationValidator.errors);
    }

    const result = await this.services.evaluationService.add(req.body as IAddEvaluation);

    res.send(result);
  }

}
