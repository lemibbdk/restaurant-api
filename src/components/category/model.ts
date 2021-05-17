import IModel from '../../common/IModel.interface';
import ItemModel from '../item/model';

class CategoryModel implements IModel {
  categoryId: number;
  name: string;
  parentCategoryId: number | null = null;
  parentCategory: CategoryModel | null = null;
  subCategories: CategoryModel[] = [];
  items: ItemModel[] = [];
}

export default CategoryModel;
