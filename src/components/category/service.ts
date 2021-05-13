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
}

export default CategoryService;
