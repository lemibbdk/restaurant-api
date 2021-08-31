import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';
import ItemInfoModel from '../item-info/model';

class Photo implements IModel {
  photoId: number;
  imagePath: string;
}

class ItemModel implements IModel {
  itemId: number;
  name: string;
  ingredients: string;
  categoryId: number;
  category: CategoryModel | null = null;
  itemInfoAll: ItemInfoModel[] = [];
  photos: Photo[] = [];
  isActive: boolean;
}

export default ItemModel;
export { Photo as ItemPhoto }
