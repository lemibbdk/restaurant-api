class CategoryModel {
  categoryId: number;
  name: string;
  parentCategoryId: number | null = null;
  parentCategory: CategoryModel | null = null;
  subCategories: CategoryModel[] = [];
}

export default CategoryModel;
