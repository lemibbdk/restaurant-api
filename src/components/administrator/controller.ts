import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import AdministratorModel from './model';
import { IAddAdministrator, IAddAdministratorValidator } from './dto/IAddAdministrator';
import { IEditAdministrator, IEditAdministratorValidator } from './dto/IEditAdministrator';

export default class AdministratorController extends BaseController {
  public async getAll(req: Request, res: Response) {
    res.send(await this.services.administratorService.getAll())
  }

  public async getById(req: Request, res: Response) {
    const id = +(req.params.id);

    if (id <=0 ) return res.status(400).send({errorMessage: 'The id value cannot be smaller than 1.'});

    const data = await this.services.administratorService.getById(id);

    if (data === null) return res.sendStatus(404);

    if (data instanceof AdministratorModel) {
      return res.send(data);
    }

    res.status(500).send(data);
  }

  public async add(req: Request, res: Response) {
    if (!IAddAdministratorValidator(req.body)) {
      return res.status(400).send(IAddAdministratorValidator.errors);
    }

    const result = await this.services.administratorService.add(req.body as IAddAdministrator);

    res.send(result);
  }

  public async edit(req: Request, res: Response) {
    const id = +(req.params.id);

    if (id <= 0) {
      res.status(400).send({errorMessage: 'The id value cannot be smaller than 1.'})
    }

    if (!IEditAdministratorValidator(req.body)) {
      return res.status(400).send(IEditAdministratorValidator.errors);
    }

    const result = await this.services.administratorService.edit(id, req.body as IEditAdministrator);

    if (result === null) return res.sendStatus(404);

    res.send(result);
  }
}
