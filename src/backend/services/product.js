import { createProduct } from "../models/product.js";

export function postProductData(data) {
  createProduct(data);
}
