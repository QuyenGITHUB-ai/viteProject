import { postProductData, updateProductData } from "../../backend/services/product";
import * as bootstrap from "bootstrap";

let currentProductId = null;

export function productForm() {
  return `
    <div class="container mt-4">

      <!-- BUTTON -->
      <button type="button" class="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#productModal"
        onclick="resetForm()">
        Thêm sản phẩm mới
      </button>

      <!-- MODAL -->
      <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">

            <!-- HEADER -->
            <div class="modal-header">
              <h5 class="modal-title" id="productModalLabel">Thêm sản phẩm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- BODY -->
            <div class="modal-body">
              <form id="productForm">

                <!-- Hidden ID Field -->
                <input type="hidden" id="product_id" name="id">

                <!-- Ảnh -->
                <div class="mb-3">
                  <label class="form-label">Ảnh sản phẩm</label>
                  <input type="file" class="form-control" id="anh_san_pham" name="anh_san_pham" accept="image/*">
                  <div id="currentImagePreview" class="mt-2" style="display: none;">
                    <p>Hình ảnh hiện tại:</p>
                    <img id="currentImage" src="" alt="Current Image" style="max-width: 200px; max-height: 200px;" class="img-thumbnail">
                  </div>
                </div>

                <!-- Tiêu đề -->
                <div class="mb-3">
                  <label class="form-label">Tên sản phẩm *</label>
                  <input type="text" class="form-control" id="ten_san_pham" name="ten_san_pham" required>
                </div>

                <!-- Mô tả -->
                <div class="mb-3">
                  <label class="form-label">Mô tả *</label>
                  <textarea class="form-control" id="mo_ta_ngan" name="mo_ta_ngan" rows="3" required></textarea>
                </div>

                <!-- Giá -->
                <div class="mb-3">
                  <label class="form-label">Giá tiền *</label>
                  <input type="number" class="form-control" id="gia_tien" name="gia_tien" required min="0">
                </div>

                <div class="d-flex gap-2 justify-content-end">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                  <button type="submit" class="btn btn-primary" id="submitBtn">Lưu sản phẩm</button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>

    </div>
  `;
}

// Reset form to default state (for adding new product)
function resetForm() {
  document.getElementById('productForm').reset();
  document.getElementById('productModalLabel').textContent = 'Thêm sản phẩm';
  document.getElementById('submitBtn').textContent = 'Lưu sản phẩm';
  document.getElementById('currentImagePreview').style.display = 'none';
  currentProductId = null;
}

// Populate form for editing a product
export function populateForm(product) {
  document.getElementById('product_id').value = product.id;
  document.getElementById('ten_san_pham').value = product.ten_san_pham || '';
  document.getElementById('mo_ta_ngan').value = product.mo_ta || '';
  document.getElementById('gia_tien').value = product.gia_tien || '';

  // Show current image if exists
  if (product.anh_san_pham) {
    document.getElementById('currentImage').src = product.anh_san_pham;
    document.getElementById('currentImagePreview').style.display = 'block';
  } else {
    document.getElementById('currentImagePreview').style.display = 'none';
  }

  document.getElementById('productModalLabel').textContent = 'Chỉnh sửa sản phẩm';
  document.getElementById('submitBtn').textContent = 'Cập nhật sản phẩm';
  currentProductId = product.id;
}

// Use event delegation since form is dynamically rendered
let isSubmitting = false;

document.addEventListener("submit", async (event) => {
  if (event.target.id === "productForm") {
    event.preventDefault();
    event.stopPropagation();

    if (isSubmitting) return;
    isSubmitting = true;

    const formData = new FormData(event.target);

    // Extract form data
    let data = {};
    for (const [name, value] of formData.entries()) {
      data[name] = value;
    }

    // Handle file input separately
    const fileInput = document.getElementById('anh_san_pham');
    if (fileInput.files.length > 0) {
      data['anh_san_pham'] = fileInput.files[0]; // Get the file object
    } else {
      // If no new file selected, use current image URL (if editing)
      if (currentProductId) {
        const currentImageUrl = document.getElementById('currentImage')?.src;
        if (currentImageUrl && !currentImageUrl.includes('data:image')) {
          data['anh_san_pham'] = currentImageUrl;
        }
      }
    }

    try {
      if (currentProductId) {
        // Update existing product
        await updateProductData(currentProductId, data);
        alert("✅ Cập nhật sản phẩm thành công!");
      } else {
        // Create new product
        await postProductData(data);
        alert("✅ Thêm sản phẩm thành công!");
      }

      // Close modal
      const modalEl = document.getElementById('productModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }

      // Refresh product list by triggering an event
      window.dispatchEvent(new CustomEvent('productChanged'));

      // Reset form
      event.target.reset();
      document.getElementById('currentImagePreview').style.display = 'none';
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi: " + (err.message || "Có lỗi xảy ra"));
    } finally {
      isSubmitting = false;
    }
  }
});

// Initialize Bootstrap modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make resetForm function globally available
  window.resetForm = resetForm;
});
