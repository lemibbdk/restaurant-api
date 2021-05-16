import CategoryModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory } from './dto/IAddCategory';
import BaseService from '../../services/BaseService';

class CategoryService extends BaseService<CategoryModel>{

  protected async adaptModel(row: any, options: Partial<IModelAdapterOptions> = {loadParent: false, loadChildren: false})
    : Promise<CategoryModel> {
    const item: CategoryModel = new CategoryModel();

    item.categoryId = +(row?.category_id);
    item.name = row?.name;
    item.parentCategoryId = row?.parent_category_id;

    if (options.loadParent && item.parentCategoryId !== null) {
      const data = await this.getById(item.parentCategoryId);

      if (data instanceof CategoryModel) {
        item.parentCategory = data;
      }
    }

    if (options.loadChildren) {
      const data = await this.getAllByParentCategoryId(item.categoryId);

      if (Array.isArray(data)) {
        item.subCategories = data;
      }
    }

    return item;
  }

  public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
    return await this.getAllByFieldNameFromTable(
      'category',
      'parent_category_id',
      null,
      {
        loadChildren: true
      })
  }

  public async getAllByParentCategoryId(parentCategoryId: number): Promise<CategoryModel[]|IErrorResponse> {
    return await this.getAllByFieldNameFromTable(
      'category',
      'parent_category_id',
      parentCategoryId,
      {
        loadChildren: true
      })
  }

  public async getById(categoryId: number): Promise<CategoryModel|null|IErrorResponse> {
    return await this.getByIdFromTable('category', categoryId);
  }

  public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
    return new Promise<CategoryModel|IErrorResponse>(async resolve => {
      const sql = 'INSERT category SET name = ?, parent_category_id = ?;';

      this.db.execute(sql, [data.name, data.parentCategoryId ?? null])
        .then(async result => {
          const insertInfo: any = result[0];

          const newCategoryId: number = +(insertInfo?.insertId);
          resolve(await this.getById(newCategoryId));
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })
    })
  }
}

export default CategoryService;
