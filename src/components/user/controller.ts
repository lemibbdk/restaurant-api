import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import UserModel from './model';
import { IAddUser, IAddUserValidator } from './dto/IAddUser';
import { IEditUser, IEditUserValidator } from './dto/IEditUser';

export default class UserController extends BaseController {
  public async getAll(req: Request, res: Response) {
    res.send(await this.services.userService.getAll())
  }

  public async getById(req: Request, res: Response) {
    const id = +(req.params.id);

    if (id <=0 ) return res.status(400).send({errorMessage: 'The id value cannot be smaller than 1.'});

    const data = await this.services.userService.getById(id, { loadAddresses: true });

    if (data === null) return res.sendStatus(404);

    if (data instanceof UserModel) {
      return res.send(data);
    }

    res.status(500).send(data);
  }

  public async add(req: Request, res: Response) {
    if (!IAddUserValidator(req.body)) {
      return res.status(400).send(IAddUserValidator.errors);
    }

    const result = await this.services.userService.add(req.body as IAddUser);

    res.send(result);
  }

  public async edit(req: Request, res: Response) {
    const id = +(req.params.id);

    if (id <= 0) {
      res.status(400).send({errorMessage: 'The id value cannot be smaller than 1.'})
    }

    if (!IEditUserValidator(req.body)) {
      return res.status(400).send(IEditUserValidator.errors);
    }

    const result = await this.services.userService.edit(id, req.body as IEditUser);

    if (result === null) return res.sendStatus(404);

    res.send(result);
  }
}
