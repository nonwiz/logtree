export const categorizeObj = (categoriesList, obj, key) => {
  return categoriesList.map((category) => {
    const tmp = { categoryId: category.categoryId, label: category.label };
    tmp[key] = obj.filter((item) => item.categoryId == category.categoryId);
    return tmp;
  });
};
