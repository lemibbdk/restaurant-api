import IModel from '../../common/IModel.interface';

class ItemModel implements IModel {
  itemId: number;
  name: string;
  ingredients: string;
}

export default ItemModel;
