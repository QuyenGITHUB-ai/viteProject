const productData = [
  {
    id: 1,
    ten_san_pham: "iPhone 17 Pro Max",
    mo_ta:
      "Điện thoại thông minh cao cấp với khung titan, chip A17 Pro và hệ thống camera chuyên nghiệp.",
    gia_tien: 29990000,
    anh_san_pham:
      "https://iphonethanhnhan.vn/upload/filemanager/iphone%2017/iphone-17-pro-6.jpg",
  },
  {
    id: 2,
    ten_san_pham: "MacBook Air M3",
    mo_ta:
      "Laptop siêu mỏng nhẹ với hiệu năng mạnh mẽ từ chip M3, màn hình Liquid Retina 13.6 inch.",
    gia_tien: 27490000,
    anh_san_pham:
      "https://ttcenter.com.vn/uploads/product/vju546ld-1294-macbook-air-m3-15inch-16gb-512gb-new.jpg",
  },
  {
    id: 3,
    ten_san_pham: "Sony WH-1000XM5",
    mo_ta:
      "Tai nghe chống ồn hàng đầu thế giới với chất âm Hi-Res và thời lượng pin lên đến 30 giờ.",
    gia_tien: 6490000,
    anh_san_pham:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Apro/Apro_product_33121/samsung-galaxy-_main_771_1020.png.webp",
  },
  {
    id: 4,
    ten_san_pham: "Samsung Galaxy Watch 6",
    mo_ta:
      "Đồng hồ thông minh theo dõi sức khỏe chuyên sâu, màn hình Sapphire bền bỉ.",
    gia_tien: 5990000,
    anh_san_pham:
      "https://cdn.tgdd.vn/Products/Images/54/313692/tai-nghe-bluetooth-chup-tai-sony-wh1000xm5-den-1-750x500.jpg",
  },
  {
    id: 5,
    ten_san_pham: "iPad Pro M4",
    mo_ta:
      "Máy tính bảng mạnh nhất thế giới với màn hình Tandem OLED và thiết kế siêu mỏng.",
    gia_tien: 28990000,
    anh_san_pham:
      "https://cdn.tgdd.vn/Products/Images/522/325517/ipad-pro-13-inch-m4-wifi-sliver-1-750x500.jpg",
  },
  {
    id: 6,
    ten_san_pham: "Loa Bluetooth Marshall Emberton II",
    mo_ta:
      "Loa di động kháng nước chuẩn IP67, thiết kế cổ điển và âm thanh 360 độ.",
    gia_tien: 3990000,
    anh_san_pham:
      "https://thienhaaudio.vn/wp-content/uploads/2022/06/EMBERTON-II.jpg.webp",
  },
  {
    id: 7,
    ten_san_pham: "Nintendo Switch OLED",
    mo_ta:
      "Máy chơi game cầm tay với màn hình OLED 7 inch rực rỡ và chân đứng rộng hơn.",
    gia_tien: 7800000,
    anh_san_pham:
      "https://www.droidshop.vn/wp-content/uploads/2022/01/May-choi-game-Nintendo-Switch-OLED-model-with-White-Joy%E2%80%91Con.jpg",
  },
  {
    id: 8,
    ten_san_pham: "GoPro Hero 12 Black",
    mo_ta:
      "Camera hành trình chống rung Hypersmooth 6.0, quay video 5.3K chất lượng cao.",
    gia_tien: 9490000,
    anh_san_pham:
      "https://htcamera.htskys.com/wp-content/uploads/2023/08/gopro-hero-12-black-camera-hanh-dong-htcamera-28-600x600.png",
  },
  {
    id: 9,
    ten_san_pham: "Chuột Logitech MX Master 3S",
    mo_ta:
      "Chuột không dây công thái học tối ưu cho công việc sáng tạo và văn phòng.",
    gia_tien: 2290000,
    anh_san_pham:
      "https://product.hstatic.net/200000637319/product/ezgif-4-a3b797d08b_fbab0a465ae94587bd4e4c8a26e74a38_master.jpg",
  },
  {
    id: 10,
    ten_san_pham: "Màn hình Dell UltraSharp U2723QE",
    mo_ta:
      "Màn hình 27 inch 4K với công nghệ IPS Black cho độ tương phản vượt trội.",
    gia_tien: 13500000,
    anh_san_pham:
      "https://cdn.tgdd.vn/Products/Images/5697/308042/dell-u2723qe-27-inch-uhd-1-700x467.jpg",
  },
  {
    id: 11,
    ten_san_pham: "Bàn phím Keychron K2V2",
    mo_ta:
      "Bàn phím cơ không dây layout 75% gọn gàng, hỗ trợ cả Windows và macOS.",
    gia_tien: 1850000,
    anh_san_pham:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/329/122/products/ban-phim-co-khong-day-keychron-k2v2-auluminum-led-rgb-gateron-switch-red-blue-brown.png?v=1692600786413",
  },
  {
    id: 12,
    ten_san_pham: "Máy đọc sách Kindle Paperwhite 5",
    mo_ta: "Màn hình 6.8 inch chống lóa, đèn nền ấm và khả năng kháng nước.",
    gia_tien: 3600000,
    anh_san_pham:
      "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/177862/Originals/may-doc-sach-kindle-paperwhite-5-5.jpg",
  },
];

export function productList() {
  //2. Khởi tạo biến chứa html
  let html = "";
  //3. Duyệt danh sách sản phẩm
  productData.forEach(function (value, index) {
    //3.1 Tạo html cho từng sản phẩm
    html +=
      `
<div class="col">
  <div class="card shadow-sm">
    <img
      style="height: 200px;"
      src="` +
      value.anh_san_pham +
      `"
      alt="sp1"
    />
    <div class="card-body">
      <h5>` +
      value.ten_san_pham +
      `</h5>
      <p class="card-text">` +
      value.mo_ta +
      `</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            onclick="addToCart(` +
      value.id +
      `)"
          >
            Add to Cart
          </button>
        </div>
        <small class="text-muted"
          >` +
      value.gia_tien.toLocaleString("vi-VN") +
      ` đ</small
        >
      </div>
    </div>
  </div>
</div>
`;
  });
  return `<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">${html}</div>`;
}
