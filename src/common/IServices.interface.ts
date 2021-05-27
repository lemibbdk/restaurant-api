import ItemService from '../components/item/service';
import ItemInfoService from '../components/item-info/service';
import CategoryService from '../components/category/service';
import AdministratorService from '../components/administrator/service';

export default interface IServices {
  itemService: ItemService;
  itemInfoService: ItemInfoService;
  categoryService: CategoryService;
  administratorService: AdministratorService;
}
