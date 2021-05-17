import IModel from '../../common/IModel.interface';
import ItemModel from '../item/model';

class ItemInfoModel implements IModel {
  itemInfoId: number;
  size: string;
  energyValue: number;
  mass: number;
  price: number;
  itemId: number | null = null;
  item: ItemModel | null = null;
}

export default ItemInfoModel;
