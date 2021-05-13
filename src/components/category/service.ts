import CategoryModel from './model';
import * as mysql2 from 'mysql2/promise'
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';

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

    if (options.loadParent && item.parentCategoryId) {
      item.parentCategory = await this.getById(item.parentCategoryId)
    }

    if (options.loadChildren) {
      item.subCategories = await this.getByParentCategoryId(item.categoryId)
    }

    return item;
  }

  public async getAll(): Promise<CategoryModel[]> {
    const categories: CategoryModel[] = [];

    const sql: string = "SELECT * FROM category WHERE parent_category_id IS NULL ORDER BY name;";
    const [rows, columns] = await this.db.execute(sql);

    if (Array.isArray(rows)) {
      for (const row of rows) {
        categories.push(await this.adaptToModel(row, {loadChildren: true}))
      }
    }

    return categories;
  }

  public async getByParentCategoryId(parentCategoryId: number): Promise<CategoryModel[]> {
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
  }

  public async getById(categoryId: number): Promise<CategoryModel|null> {
    const sql: string = "SELECT * FROM category WHERE category_id = ?;"
    const [rows, columns] = await this.db.execute(sql, [categoryId])

    if (!Array.isArray(rows)) {
      return null
    }

    if (rows.length == 0) {
      return null
    }

    return await this.adaptToModel(rows[0], {loadChildren: true, loadParent: true})
  }
}

export default CategoryService;
