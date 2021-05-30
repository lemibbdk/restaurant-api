import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../common/BaseService';
import AdministratorModel from './model';
import { IAddAdministrator } from './dto/IAddAdministrator';
import IErrorResponse from '../../common/IErrorResponse.interface';
import * as bcrypt from 'bcrypt';
import { IEditAdministrator } from './dto/IEditAdministrator';
import UserModel from '../user/model';

class AdministratorModelAdapterOptions implements IModelAdapterOptions {

}

class AdministratorService extends BaseService<AdministratorModel> {
  protected async adaptModel(data: any, options: Partial<AdministratorModelAdapterOptions>): Promise<AdministratorModel> {
    const item = new AdministratorModel();

    item.administratorId = +(data?.administrator_id);
    item.username = data?.username;
    item.passwordHash = data?.password_hash;
    item.isActive = +(data?.is_active) === 1;

    return item;
  }

  public async getAll(): Promise<AdministratorModel[]> {
    return await this.getAllFromTable('administrator', {}) as AdministratorModel[];
  }

  public async getById(administratorId: number): Promise<AdministratorModel|null> {
    return await this.getByIdFromTable('administrator', administratorId, {}) as AdministratorModel|null;
  }

  public async add(data: IAddAdministrator): Promise<AdministratorModel|IErrorResponse> {
    return new Promise<AdministratorModel|IErrorResponse>(async resolve => {
      const passwordHash = bcrypt.hashSync(data.password, 8);

      this.db.execute(
        'INSERT administrator SET username = ?, password_hash = ?, is_active = 1;',
        [ data.username, passwordHash ]
      )
        .then(async res => {
          const newAdministratorId: number = +((res[0] as any)?.insertId);
          resolve(await this.getById(newAdministratorId))
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }

  public async getByUsername(username: string): Promise<AdministratorModel | null> {
    const administrators = await this.getAllByFieldNameFromTable('administrator', 'username', username, {});

    if (!Array.isArray(administrators) || administrators.length === 0) {
      return null;
    }

    return administrators[0];
  }

  public async edit(administratorId: number, data: IEditAdministrator): Promise<AdministratorModel|IErrorResponse|null> {
    return new Promise<AdministratorModel|IErrorResponse>(async resolve => {
      const currentAdministrator = await this.getById(administratorId);

      if (currentAdministrator === null) {
        return resolve(null);
      }

      const passwordHash = bcrypt.hashSync(data.password, 8);

      this.db.execute(
        'UPDATE administrator SET password_hash = ?, is_active = ? WHERE administrator_id = ?;',
        [ passwordHash, data.isActive, administratorId ]
      )
        .then(async () => {
          resolve(await this.getById(administratorId))
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }

}

export default AdministratorService;
