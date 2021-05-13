import CategoryModel from './model';

class CategoryService {
  public async getAll(): Promise<CategoryModel[]> {
    const lista: CategoryModel[] = [];

    lista.push({
      categoryId: 1,
      name: 'Category A',
      parentCategoryId: null,
      parentCategory: null,
      subCategories: []
    })

    return lista;
  }

  public async getById(categoryId: number): Promise<CategoryModel|null> {
    if (categoryId === 1) {
      return {
        categoryId: 1,
        name: 'Category A',
        parentCategoryId: null,
        parentCategory: null,
        subCategories: []
      }
    } else {
      return null;
    }
  }
}

export default CategoryService;
