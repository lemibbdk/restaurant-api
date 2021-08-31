import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import EvaluationModel from './model';
import { IAddEvaluation, IAddEvaluationValidator } from './dto/IAddEvaluation';
import CartModel from '../cart/model';

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

    const cartId = +((req.body as IAddEvaluation).cartId)

    const cartResult = await this.services.cartService.getById(cartId)

    if (!(cartResult instanceof CartModel)) {
      return res.status(400).send(cartResult);
    }

    if (cartId !== cartResult.cartId) {
      return res.status(400).send({errorMessage: 'Invalid cart or order for cart.'})
    }

    if (cartResult.order.status !== 'completed') {
      return res.status(400).send({errorMessage: "Can't evaluate order which is not completed."})
    }

    if (cartResult.userId !== req.authorized.id) {
      return res.status(400).send({errorMessage: 'Wrong user for this order.'})
    }

    const result = await this.services.evaluationService.add(req.body as IAddEvaluation);

    res.send(result);
  }

}
