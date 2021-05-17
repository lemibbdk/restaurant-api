import BaseService from '../../services/BaseService';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IAddItem } from './dto/IAddItem';
import { IEditItem } from './dto/IEditItem';

class ItemModelAdapterOptions implements IModelAdapterOptions {
  loadItemInfo: boolean = false;
}

class ItemService extends BaseService<ItemModel> {
  protected async adaptModel(row: any): Promise<ItemModel> {
    const item: ItemModel = new ItemModel();

    item.itemId = +(row?.item_id);
    item.name = row?.name;
    item.ingredients = row?.ingredients;

    return item;
  }

  public async getAll(options: Partial<ItemModelAdapterOptions> = { }): Promise<ItemModel[]|IErrorResponse> {
    return await this.getAllFromTable<ItemModelAdapterOptions>(
      'item',
      options
    )
  }

  public async getById(
    itemId: number,
    options: Partial<ItemModelAdapterOptions> = { }
  ): Promise<ItemModel|null|IErrorResponse> {
    return await this.getByIdFromTable<ItemModelAdapterOptions>(
      'item',
      itemId,
      options
    )
  }

  public async add(data: IAddItem): Promise<ItemModel|IErrorResponse> {
    return new Promise<ItemModel|IErrorResponse>(async resolve => {
      const sql = 'INSERT item SET name = ?, ingredients = ?;';

      this.db.execute(sql, [data.name, data.ingredients])
        .then(async result => {
          const insertInfo: any = result[0];

          const newItemId: number = +(insertInfo?.insertId);
          resolve(await this.getById(newItemId));
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }

  public async edit(itemId: number, data: IEditItem, options: Partial<ItemModelAdapterOptions> = { })
    : Promise<ItemModel|IErrorResponse|null> {
    const result = await this.getById(itemId);

    if (result === null) {
      return null;
    }

    if (!(result instanceof ItemModel)) {
      return result;
    }

    return new Promise<ItemModel|IErrorResponse>(async resolve => {
      const sql = 'UPDATE item SET name = ?, ingredients = ? WHERE item_id = ?;';

      this.db.execute(sql, [data.name, data.ingredients, itemId])
        .then(async () => {
          resolve(await this.getById(itemId, options));
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }

  public async delete(itemId: number): Promise<IErrorResponse> {
    return new Promise<IErrorResponse>(resolve => {
      const sql = 'DELETE FROM item WHERE item_id = ?;';
      this.db.execute(sql, [itemId])
        .then(async result => {
          const deleteInfo: any = result[0];
          const deletedRowCount: number = +(deleteInfo?.affectedRows);

          if (deletedRowCount === 1) {
            resolve({
              errorCode: 0,
              errorMessage: 'One record deleted.'
            })
          } else {
            resolve({
              errorCode: -1,
              errorMessage: 'This record could not be deleted, because it not exist.'
            })
          }
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          });
        })
    })
  }
}

export default ItemService;
