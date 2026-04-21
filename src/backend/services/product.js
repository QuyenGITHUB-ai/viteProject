import { createProduct, list } from "../models/product.js";

export function postProductData(data) {
  createProduct(data);
}

export function getList() {
  console.log(list());
  const getData = async () => {
    const data = await list();
  };

  return getData();
}
