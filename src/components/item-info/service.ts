import BaseService from '../../common/BaseService';
import ItemInfoModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import ItemModel from '../item/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddItemInfo } from './dto/IAddItemInfo';
import { IEditItemInfo } from './dto/IEditItemInfo';

class ItemInfoModelAdapterOptions implements IModelAdapterOptions {
  loadItem: boolean = false;
}

class ItemInfoService extends BaseService<ItemInfoModel> {
  protected async adaptModel(data: any, options: Partial<ItemInfoModelAdapterOptions>): Promise<ItemInfoModel> {
    const item: ItemInfoModel = new ItemInfoModel();

    item.itemInfoId = +(data?.item_info_id);
    item.size = data?.size;
    item.energyValue = +(data?.energy_value);
    item.mass = +(data?.mass);
    item.price = +(data?.price);
    item.itemId = +(data?.item_id)

    if (options.loadItem && item.itemId) {
      const result = await this.services.itemService.getById(item.itemId, {loadItemCategory: true});

      if (result instanceof ItemModel) {
        item.item = result;
      }
    }

    return item;
  }

  public async getById(
    itemInfoId: number,
    options: Partial<ItemInfoModelAdapterOptions> = { }
  ): Promise<ItemInfoModel|null|IErrorResponse> {
    return await this.getByIdFromTable('item_info', itemInfoId, options);
  }

  public async getAllByItemId(
    itemId: number,
    options: Partial<ItemInfoModelAdapterOptions> = {}
  ): Promise<ItemInfoModel[]|IErrorResponse> {
    return await this.getAllByFieldNameFromTable('item_info', 'item_id', itemId, options);
  }

  public async edit(itemInfoId: number, data: IEditItemInfo, options: Partial<ItemInfoModelAdapterOptions> = { })
    : Promise<ItemInfoModel|IErrorResponse|null> {
    const result = await this.getById(itemInfoId);

    if (result === null) {
      return null;
    }

    if (!(result instanceof ItemInfoModel)) {
      return result;
    }

    return new Promise<ItemInfoModel|IErrorResponse>(async resolve => {
      const sql = 'UPDATE item_info SET energy_value = ?, mass = ?, price = ? WHERE item_info_id = ?;';

      this.db.execute(sql, [ data.energyValue, data.mass, data.price, itemInfoId ])
        .then(async () => {
          resolve(await this.getById(itemInfoId, options));
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

export default ItemInfoService;
