import IModel from '../../common/IModel.interface';
import PostalAddressModel from '../postal-address/model';

class UserModel implements IModel {
  userId: number;
  createdAt: Date;
  email: string;
  passwordHash: string;
  passwordResetCode?: string = null;
  forename: string;
  surname: string;
  isActive: boolean;
  postalAddresses: PostalAddressModel[] = [];
}

export default UserModel;
