import IModel from '../../common/IModel.interface';
import UserModel from '../user/model';
import ItemInfoModel from '../item-info/model';

type OrderStatus = 'pending' | 'rejected' | 'accepted' | 'completed';

class OrderModel implements IModel {
  orderId: number;
  createdAt: Date;
  status: OrderStatus;
  desiredDeliveryTime: Date;
  footnote: string;
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
