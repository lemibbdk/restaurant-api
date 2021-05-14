import CategoryModel from './model';
import * as mysql2 from 'mysql2/promise'
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';

class CategoryService {
  private db: mysql2.Connection

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

  async adaptToModel(row: any, options: Partial<IModelAdapterOptions> = {loadParent: false, loadChildren: false}): Promise<CategoryModel>{
    const item: CategoryModel = new CategoryModel();

    item.categoryId = Number(row?.categoryId);
    item.name = row?.name;
    item.parentCategoryId = Number(row?.parent_category_id);

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
    return new Promise<CategoryModel[]|IErrorResponse>(async (resolve) => {

      const sql: string = "SELECT * FROM category WHERE parent_category_id IS NULL ORDER BY name;";
      this.db.execute(sql)
        .then(async result => {
          const rows = result[0]
          console.log(rows)
          const categories: CategoryModel[] = [];
          if (Array.isArray(rows)) {
            for (const row of rows) {
              categories.push(await this.adaptToModel(row, {loadChildren: true}))
            }
          }

          resolve(categories);
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        });


    })
  }

  public async getAllByParentCategoryId(parentCategoryId: number): Promise<CategoryModel[]|IErrorResponse> {
    try {
      const categories: CategoryModel[] = [];

      const sql: string = "SELECT * FROM category WHERE parent_category_id = ? ORDER BY name;";
      const [rows, columns] = await this.db.execute(sql, [parentCategoryId]);

      if (Array.isArray(rows)) {
        for (const row of rows) {
          categories.push(
            await this.adaptToModel(
              row, {
                loadChildren: true
              }
            )
          )
        }
      }

      return categories;
    } catch (e) {
      return {
        errorCode: e?.errno,
        errorMessage: e?.sqlMessage
      }
    }
  }

  public async getById(categoryId: number): Promise<CategoryModel|null|IErrorResponse> {
    return new Promise<CategoryModel|null|IErrorResponse>(async resolve => {
      const sql: string = "SELECT FROM category WHERE category_id = ?;"
      this.db.execute(sql, [categoryId])
        .then(async result => {
          const [rows, columns] = result

          if (!Array.isArray(rows)) {
            resolve(null)
            return;
          }

          if (rows.length == 0) {
            resolve( null);
            return;
          }

          resolve(await this.adaptToModel(rows[0], {loadChildren: true, loadParent: true}))
        })
        .catch(error => {
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage
          })
        })


    });
  }
}

export default CategoryService;
