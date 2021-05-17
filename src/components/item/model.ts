import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';
import ItemInfoModel from '../item-info/model';

class ItemModel implements IModel {
  itemId: number;
  name: string;
  ingredients: string;
  categoryId: number;
  category: CategoryModel | null = null;
  itemInfoAll: ItemInfoModel[] = [];
}

export default ItemModel;
