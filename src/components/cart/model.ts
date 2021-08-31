import IModel from '../../common/IModel.interface';
import UserModel from '../user/model';
import ItemInfoModel from '../item-info/model';
import PostalAddressModel from '../postal-address/model';
import EvaluationModel from '../evaluation/model';

type OrderStatus = 'pending' | 'rejected' | 'accepted' | 'completed';

class OrderModel implements IModel {
  orderId: number;
  addressId: number;
  address: PostalAddressModel;
  createdAt: Date;
  status: OrderStatus;
  desiredDeliveryTime: Date;
  footnote: string;
  evaluation?: EvaluationModel = null;
}

class CartItemModel implements IModel {
  cartItemId: number;
  quantity: number;
  itemInfoId: number;
  itemInfo: ItemInfoModel;
}

export default class CartModel implements IModel {
  cartId: number;
  userId: number;
  createdAt: Date;
  user: UserModel;
  itemInfos: CartItemModel[] = [];
  order?: OrderModel = null;
}

export { CartItemModel, OrderModel, OrderStatus }
