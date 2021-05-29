import BaseService from '../../common/BaseService';
import PostalAddressModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import UserModel from '../user/model';
import IErrorResponse from '../../common/IErrorResponse.interface';

class PostalAddressAdapterOptions implements IModelAdapterOptions {
  loadUser: boolean = false;
}

class PostalAddressService extends BaseService<PostalAddressModel> {
  protected async adaptModel(data: any, options: Partial<PostalAddressAdapterOptions>): Promise<PostalAddressModel> {
    const item:PostalAddressModel = new PostalAddressModel();

    item.postalAddressId = +(data?.postal_address_id);
    item.userId = +(data?.user_id);
    item.address = data?.address;
    item.phoneNumber = data?.phone_number;
    item.isActive = +(data?.is_active) === 1;

    if (options.loadUser) {
      item.user = await this.services.userService.getById(item.userId);
    }

    return item;
  }

  public async getById(
    itemInfoId: number,
    options: Partial<PostalAddressAdapterOptions> = { }
  ): Promise<PostalAddressModel|null|IErrorResponse> {
    return await this.getByIdFromTable('item_info', itemInfoId, options);
  }

  public async getAllByUser(
    userId: number,
    options: Partial<PostalAddressAdapterOptions> = { })
    : Promise<PostalAddressModel[]|UserModel[]|IErrorResponse> {
    return await this.getAllByFieldNameFromTable('postal_address', 'user_id', userId, options)
  }
}

export default PostalAddressService;
