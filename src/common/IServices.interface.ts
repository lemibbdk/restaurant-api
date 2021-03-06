import ItemService from '../components/item/service';
import ItemInfoService from '../components/item-info/service';
import CategoryService from '../components/category/service';
import AdministratorService from '../components/administrator/service';
import UserService from '../components/user/service';
import PostalAddressService from '../components/postal-address/service';
import CartService from '../components/cart/service';
import EvaluationService from '../components/evaluation/service';

export default interface IServices {
  itemService: ItemService;
  itemInfoService: ItemInfoService;
  categoryService: CategoryService;
  administratorService: AdministratorService;
  userService: UserService;
  postalAddressService: PostalAddressService;
  cartService: CartService;
  evaluationService: EvaluationService;
}
