import { getList, removeProduct } from "../../backend/services/product";
import { populateForm } from "./form.js";
import { placeholderImage } from "../../assets/placeholder-image.js";
import * as bootstrap from "bootstrap";

export function productList() {
  const fetchData = async () => {
    try {
      const products = await getList();
      renderProductList(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      document.getElementById('productListContainer').innerHTML = '<div class="alert alert-danger">Lỗi khi tải danh sách sản phẩm</div>';
    }
  };

  // Initial load
  fetchData();

  // Listen for product changes to refresh the list
  window.addEventListener('productChanged', fetchData);

  return `<div id="productListContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">${generateLoadingHTML()}</div>`;
}

function generateLoadingHTML() {
  return `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

async function renderProductList(products) {
  if (!products || products.length === 0) {
    document.getElementById('productListContainer').innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          Không có sản phẩm nào. Hãy thêm sản phẩm mới!
        </div>
      </div>
    `;
    return;
  }

  let html = "";

  products.forEach(function (product) {
    html += `
      <div class="col" data-product-id="${product.id}">
        <div class="card shadow-sm h-100">
          <img
            style="height: 200px; object-fit: cover;"
            src="${product.anh_san_pham || placeholderImage}"
            onerror="this.onerror=null; this.src='${placeholderImage}';"
            alt="${product.ten_san_pham}"
            class="card-img-top"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.ten_san_pham}</h5>
            <p class="card-text flex-grow-1">${product.mo_ta}</p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group w-100" role="group">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    onclick="editProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    onclick="confirmDelete(${product.id}, '${product.ten_san_pham}')"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <small class="text-muted d-block mt-2 text-end">
                ${product.gia_tien ? product.gia_tien.toLocaleString("vi-VN") + ' đ' : ''}
              </small>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById('productListContainer').innerHTML = html;
}

// Make functions globally available
window.editProduct = function(product) {
  populateForm(product);
  const modalEl = document.getElementById('productModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

window.confirmDelete = async function(productId, productName) {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?`);
  if (confirmed) {
    try {
      await removeProduct(productId);
      alert("✅ Xóa sản phẩm thành công!");
      window.dispatchEvent(new CustomEvent('productChanged'));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert("❌ Lỗi khi xóa sản phẩm: " + error.message);
    }
  }
};
