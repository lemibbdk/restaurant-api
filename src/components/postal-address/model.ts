import IModel from '../../common/IModel.interface';
import UserModel from '../user/model';

class PostalAddressModel implements IModel {
  postalAddressId: number;
  userId: number;
  address: string;
  phoneNumber: string;
  user: UserModel;
  isActive: boolean;
}

export default PostalAddressModel;
