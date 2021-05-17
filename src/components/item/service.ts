import BaseService from '../../services/BaseService';
import ItemModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';

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
}

export default ItemService;
