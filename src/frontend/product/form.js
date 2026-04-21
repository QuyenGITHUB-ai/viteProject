import { postProductData } from "../../backend/services/product";

export function productForm() {
  return `
    <div class="container">

      <!-- BUTTON -->
      <button type="button" class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#insertDatabaseForm">
        Thêm dữ liệu
      </button>

      <!-- MODAL -->
      <div class="modal fade" id="insertDatabaseForm" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">

            <!-- HEADER -->
            <div class="modal-header">
              <h5 class="modal-title">Thêm sản phẩm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <!-- BODY -->
            <div class="modal-body">
              <form id="insertDatabaseForm">

                <!-- Ảnh -->
                <div class="mb-3">
                  <label class="form-label">Ảnh sản phẩm</label>
                  <input type="file" class="form-control" id="anh_san_pham" name="anh_san_pham" accept="image/*">
                </div>

                <!-- Tiêu đề -->
                <div class="mb-3">
                  <label class="form-label">Tiêu đề</label>
                  <input type="text" class="form-control" id="ten_san_pham" name="ten_san_pham" value="">
                </div>

                <!-- Mô tả -->
                <div class="mb-3">
                  <label class="form-label">Mô tả ngắn</label>
                  <textarea class="form-control" id="mo_ta_ngan" name="mo_ta_ngan"></textarea>
                </div>

                <!-- Giá -->
                <div class="mb-3">
                  <label class="form-label">Giá tiền</label>
                  <input type="number" class="form-control" id="gia_tien" name="gia_tien">
                </div>

                <button type="submit" class="btn btn-primary w-100">
                  Thêm dữ liệu
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>

    </div>
  `;
}

// Use event delegation since form is dynamically rendered
document.addEventListener("submit", async (event) => {
  //event.target là form vừa submit
  if (event.target.id === "insertDatabaseForm") {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.target);

    let data = {};
    for (const [name, value] of formData.entries()) {
      data[name] = value;
    }

    try {
      await postProductData(data); // Call exported function
      alert("✅ Thêm dữ liệu thành công!");

      // reset form
      event.target.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi: " + err.message);
    }
  }
});
