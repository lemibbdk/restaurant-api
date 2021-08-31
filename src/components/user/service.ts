import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../common/BaseService';
import UserModel from './model';
import PostalAddressModel from '../postal-address/model';
import { IAddUser } from './dto/IAddUser';
import IErrorResponse from '../../common/IErrorResponse.interface';
import * as bcrypt from 'bcrypt';
import { IEditUser } from './dto/IEditUser';

class UserModelAdapterOptions implements IModelAdapterOptions {
  loadAddresses: boolean = false;
  loadOrders: boolean = false;
}

class UserService extends BaseService<UserModel> {
  protected async adaptModel(data: any, options: Partial<UserModelAdapterOptions>): Promise<UserModel> {
    const item:UserModel = new UserModel();

    item.userId = +(data?.user_id);
    item.email = data?.email;
    item.createdAt = new Date(data?.created_at)
    item.passwordHash = data?.password_hash;
    item.passwordResetCode = data?.password_reset_code;
    item.forename = data?.forename;
    item.surname = data?.surname;
    item.isActive = +(data?.is_active) === 1;

    if (options.loadAddresses) {
      const data = await this.services.postalAddressService.getAllByUser(item.userId);
      item.postalAddresses = await data as PostalAddressModel[];
    }

    if (options.loadOrders) {

    }

    return item;
  }

  public async getAll(): Promise<UserModel[]> {
    return await this.getAllActiveFromTable('user', {}) as UserModel[];
    // return await this.getAllFromTable('user', {}) as UserModel[];
  }

  public async getById(
    userId: number,
    options: Partial<UserModelAdapterOptions> = { }): Promise<UserModel|null> {
    return await this.getByIdFromTable('user', userId, options) as UserModel|null;
  }

  public async getByEmail(email: string): Promise<UserModel | null> {
    const users = await this.getAllByFieldNameFromTable('user', 'email', email, {});

    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    return users[0];
  }

  public async add(data: IAddUser): Promise<UserModel|IErrorResponse> {
    return new Promise<UserModel|IErrorResponse>(async resolve => {
      const passwordHash = bcrypt.hashSync(data.password, 8);

      this.db.beginTransaction()
        .then(() => {
          this.db.execute(
            'INSERT user SET email = ?, password_hash = ?, forename = ?, surname = ?, is_active = 1;',
            [ data.email, passwordHash, data.forename, data.surname ]
          )
            .then(async res => {
              const newUserId: number = +((res[0] as any)?.insertId);

              const promises = [];

              for (const addressInfo of data.postalAddresses) {
                promises.push(
                  this.db.execute(
                    'INSERT postal_address SET address = ?, phone_number = ?, user_id = ?, is_active = 1;',
                    [ addressInfo.address, addressInfo.phoneNumber, newUserId ]
                  )
                )
              }

              Promise.all(promises)
                .then(async () => {
                  await this.db.commit();

                  resolve(await this.getById(newUserId, { loadAddresses: true }))
                })
                .catch(async error => {
                  await this.db.rollback();

                  resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                  })
                })
            })
            .catch(error => {
              resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
              })
            })
        })
    })
  }

  public async edit(userId: number, data: IEditUser): Promise<UserModel|IErrorResponse|null> {
    return new Promise<UserModel|IErrorResponse>(async resolve => {
      const currentUser = await this.getById(userId, {loadAddresses: true});

      const currentAddressesIds = currentUser.postalAddresses.map(el => el.postalAddressId);
      const editAddressesIds = data.postalAddresses.map(el => el.postalAddressId);
      const toRemoveAddrIds = [];

      for (const currentAddrId of currentAddressesIds) {
        if (!editAddressesIds.includes(currentAddrId)) {
          toRemoveAddrIds.push(currentAddrId);
        }
      }

      if (currentUser === null) {
        return resolve(null);
      }

      const passwordHash = bcrypt.hashSync(data.password, 8);

      this.db.beginTransaction()
        .then(async () => {
          this.db.execute(
            'UPDATE user SET email = ?, password_hash = ?, is_active = ?, forename = ?, surname = ? WHERE user_id = ?;',
            [ data.email, passwordHash, data.isActive, data.forename, data.surname, userId ]
          )
            .then(async () => {
              const promises = [];

              for (const addressInfo of data.postalAddresses) {
                if (addressInfo.postalAddressId) {
                  if (toRemoveAddrIds.length > 0) {
                    promises.push(
                      this.db.execute(
                        'UPDATE postal_address SET is_active = 0 WHERE postal_address_id = ?;',
                        [ addressInfo.postalAddressId ]
                      )
                    );
                  } else {
                    promises.push(
                      this.db.execute(
                        'UPDATE postal_address SET address = ?, phone_number = ?, is_active = ? WHERE postal_address_id = ?;',
                        [ addressInfo.address, addressInfo.phoneNumber, addressInfo.isActive, addressInfo.postalAddressId ]
                      )
                    );
                  }
                } else {
                  promises.push(
                    this.db.execute(
                      'INSERT postal_address SET address = ?, phone_number = ?, user_id = ?, is_active = 1;',
                      [ addressInfo.address, addressInfo.phoneNumber, userId ]
                    )
                  )
                }
              }

              Promise.all(promises)
                .then(async () => {
                  await this.db.commit();

                  resolve(await this.getById(userId, { loadAddresses: true }))
                })
                .catch(async error => {
                  await this.db.rollback();

                  resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                  })
                })
            })
            .catch(error => {
              resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
              })
            })
        })
    })
  }

  public async delete(userId: number): Promise<IErrorResponse> {
    return new Promise<IErrorResponse>(resolve => {
      this.db.execute('UPDATE user SET is_active = 0 WHERE user_id = ?', [ userId ])
        .then(res => {
          resolve({
            errorCode: 0,
            errorMessage: `Deleted ${(res as any[])[0]?.affectedRows} records.`
          })
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          });
        })
    });
  }

}

export default UserService;
