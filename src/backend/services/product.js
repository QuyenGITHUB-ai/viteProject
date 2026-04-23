import { createProduct, fetchProducts, getProductById, updateProduct, deleteProduct } from "../models/product.js";

export function postProductData(data) {
  return createProduct(data);
}

export async function getList() {
  return await fetchProducts();
}

export async function getProduct(id) {
  return await getProductById(id);
}

export async function updateProductData(id, data) {
  return await updateProduct(id, data);
}

export async function removeProduct(id) {
  return await deleteProduct(id);
}