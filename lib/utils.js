import { fetcher } from "lib/fetcher";

export const categorizeObj = (categoriesList, obj, key) => {
  return categoriesList.map((category) => {
    const tmp = { categoryId: category.categoryId, label: category.label };
    tmp[key] = obj.filter((item) => item.categoryId == category.categoryId);
    return tmp;
  });
};

export const createTopic = async (topic) => {
  let data = false;
  if (topic.length < 5) return data;
  fetcher("/api/tracker/category/create", { label: topic }).then((d) => {
    return d;
  });
};
