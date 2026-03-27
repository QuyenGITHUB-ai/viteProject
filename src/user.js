import { Modal } from "bootstrap";

//******************** Ý tưởng xử lý
//1. Hàm lấy user từ local

// Khóa lưu trữ danh sách người dùng trong localStorage
const USER_LIST = "my_user_list";

// Khóa lưu trữ thông tin người dùng hiện đang đăng nhập trong localStorage
const CURRENT_USER = "current_user";

// Khóa lưu trữ số lần đăng nhập thất bại cho từng email trong localStorage
// Dạng: { email: { count: số lần thất bại, timestamp: thời gian lần thất bại cuối } }
const FAILED_ATTEMPTS = "failed_attempts";

// Số lần đăng nhập thất bại tối đa trước khi khóa tài khoản
const MAX_FAILED_ATTEMPTS = 5;

// Thời gian khóa tài khoản sau khi vượt quá số lần thất bại (15 phút tính bằng milliseconds)
const LOCKOUT_TIME = 15 * 60 * 1000;

// Hàm lấy danh sách người dùng từ localStorage
// Trả về mảng các đối tượng user, nếu không có thì trả về mảng rỗng
export function getUserList() {
  const data = localStorage.getItem(USER_LIST);
  return data ? JSON.parse(data) : [];
}

// Hàm lấy thông tin người dùng hiện đang đăng nhập từ localStorage
// Trả về đối tượng user nếu có, ngược lại trả về null
export function getLoggedInUser() {
  const user = localStorage.getItem(CURRENT_USER);
  const parsed = user ? JSON.parse(user) : null;
  console.log("[DEBUG getLoggedInUser] raw:", user, "parsed:", parsed);
  return parsed;
}

// Hàm lưu thông tin người dùng hiện đang đăng nhập vào localStorage
// Nếu user không null, lưu dưới dạng JSON string
export function setLoggedInUser(user) {
  if (user) {
    console.log("[DEBUG] Saving user to localStorage:", user);
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
    console.log("[DEBUG] Saved. localStorage.getItem(CURRENT_USER):", localStorage.getItem(CURRENT_USER));
  }
}

// Hàm đăng xuất: xóa thông tin người dùng khỏi localStorage và reload trang
export function logout() {
  localStorage.removeItem(CURRENT_USER);
  window.location.reload();
}

// Hàm kiểm tra xem email đã tồn tại trong danh sách người dùng chưa
// Trả về true nếu email đã được đăng ký, false nếu chưa
export function emailExists(email) {
  const users = getUserList();
  return users.some((u) => u.userName === email.trim());
}

// Hàm lấy dữ liệu số lần đăng nhập thất bại từ localStorage
// Trả về object dạng { email: { count: số lần, timestamp: thời gian } }
function getFailedAttempts() {
  const data = localStorage.getItem(FAILED_ATTEMPTS);
  return data ? JSON.parse(data) : {};
}

// Hàm lưu dữ liệu số lần đăng nhập thất bại vào localStorage
function setFailedAttempts(attempts) {
  localStorage.setItem(FAILED_ATTEMPTS, JSON.stringify(attempts));
}

// Hàm ghi nhận một lần đăng nhập thất bại cho email
// Nếu chưa có record, tạo mới với count = 1
// Nếu thời gian khóa đã hết, reset count về 1
// Ngược lại, tăng count lên 1
function recordFailedAttempt(email) {
  const attempts = getFailedAttempts();
  const now = Date.now();
  
  if (!attempts[email]) {
    // Nếu email chưa có record thất bại, tạo mới
    attempts[email] = { count: 1, timestamp: now };
  } else {
    const timeDiff = now - attempts[email].timestamp;
    
    if (timeDiff > LOCKOUT_TIME) {
      // Nếu thời gian khóa đã hết (hơn 15 phút), reset về 1
      attempts[email] = { count: 1, timestamp: now };
    } else {
      // Nếu vẫn trong thời gian khóa, tăng count
      attempts[email].count++;
    }
  }
  
  setFailedAttempts(attempts);
}

// Hàm kiểm tra xem email có đang bị khóa do quá nhiều lần đăng nhập thất bại không
// Trả về true nếu count >= MAX_FAILED_ATTEMPTS và thời gian khóa chưa hết
// Nếu thời gian khóa đã hết, xóa record và trả về false
function isLockedOut(email) {
  const attempts = getFailedAttempts();
  if (!attempts[email]) return false; // Không có record, không khóa
  
  const now = Date.now();
  const timeDiff = now - attempts[email].timestamp;
  
  if (timeDiff > LOCKOUT_TIME) {
    // Thời gian khóa đã hết, xóa record
    delete attempts[email];
    setFailedAttempts(attempts);
    return false;
  }
  
  // Kiểm tra số lần thất bại
  return attempts[email].count >= MAX_FAILED_ATTEMPTS;
}

// Hàm tính thời gian còn lại của khóa tài khoản (tính bằng giây)
// Trả về 0 nếu không bị khóa hoặc thời gian đã hết
function getRemainingLockoutTime(email) {
  const attempts = getFailedAttempts();
  if (!attempts[email]) return 0; // Không có record
  
  const now = Date.now();
  const timeDiff = now - attempts[email].timestamp;
  const remaining = LOCKOUT_TIME - timeDiff;
  
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0; // Trả về giây, làm tròn lên
}

// Hàm xóa record thất bại cho email (khi đăng nhập thành công)
function clearFailedAttempts(email) {
  const attempts = getFailedAttempts();
  delete attempts[email]; // Xóa record của email
  setFailedAttempts(attempts); // Lưu lại
}

// Hàm đánh giá độ mạnh của mật khẩu dựa trên các tiêu chí
// Trả về object { level: "weak|medium|strong", text: "Yếu|Trung bình|Mạnh", color: "danger|warning|success" }
export function getPasswordStrength(password) {
  let strength = 0; // Điểm mạnh, từ 0-6
  
  if (password.length >= 8) strength++; // +1 nếu >=8 ký tự
  if (password.length >= 12) strength++; // +1 nếu >=12 ký tự
  if (/[a-z]/.test(password)) strength++; // +1 nếu có chữ thường
  if (/[A-Z]/.test(password)) strength++; // +1 nếu có chữ hoa
  if (/[0-9]/.test(password)) strength++; // +1 nếu có số
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; // +1 nếu có ký tự đặc biệt
  
  // Phân loại dựa trên điểm
  if (strength <= 2) return { level: "weak", text: "Yếu", color: "danger" };
  if (strength <= 4) return { level: "medium", text: "Trung bình", color: "warning" };
  return { level: "strong", text: "Mạnh", color: "success" };
}


// Hàm kiểm tra định dạng email hợp lệ bằng regex
// Trả về true nếu email đúng định dạng, false nếu sai
export function validateEmail(email) {
  const re = /^\S+@\S+\.\S+$/; // Regex cơ bản cho email
  return re.test(email);
}

// Hàm kiểm tra tính hợp lệ của mật khẩu
// Yêu cầu tối thiểu 6 ký tự
// Trả về { valid: boolean, message: string }
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    };
  }
  return { valid: true };
}

// Hàm hiển thị thông báo feedback cho element có id elementId
// isError = true: hiển thị màu đỏ (lỗi), false: màu xanh (thành công)
function setFeedback(elementId, message, isError = true) {
  const el = document.getElementById(elementId);
  if (!el) return; // Nếu không tìm thấy element, thoát
  el.textContent = message; // Đặt nội dung thông báo
  el.className = isError ? "text-danger" : "text-success"; // Đặt class CSS tương ứng
}

// Hàm xử lý sự kiện click cho nút toggle hiển thị/ẩn mật khẩu
// Sử dụng event delegation để lắng nghe trên toàn bộ document
function togglePasswordVisibility() {
  document.addEventListener("click", function (event) {
    // Kiểm tra nếu click vào element có class .togglePassword
    if (event.target.closest(".togglePassword")) {
      event.preventDefault(); // Ngăn hành vi mặc định
      const btn = event.target.closest(".togglePassword"); // Lấy button
      const targetId = btn.getAttribute("data-target"); // Lấy id của input từ data-target
      const input = document.getElementById(targetId); // Tìm input
      
      if (!input) return; // Nếu không tìm thấy input, thoát
      
      const isPassword = input.type === "password"; // Kiểm tra loại hiện tại
      input.type = isPassword ? "text" : "password"; // Chuyển đổi loại
      
      // Cập nhật icon mắt
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.toggle("bi-eye", isPassword); // Nếu đang password, hiện mắt mở
        icon.classList.toggle("bi-eye-slash", !isPassword); // Nếu đang text, hiện mắt đóng
      }
    }
  });
}

// Hàm đặt trạng thái loading cho button (hiển thị spinner và disable)
// isLoading = true: hiển thị loading, false: khôi phục trạng thái bình thường
function setButtonLoading(buttonId, isLoading = true) {
  const btn = document.getElementById(buttonId);
  if (!btn) return; // Nếu không tìm thấy button, thoát
  
  if (isLoading) {
    btn.disabled = true; // Disable button
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý...`; // Hiển thị spinner
    btn.classList.add("opacity-50"); // Làm mờ
  } else {
    btn.disabled = false; // Enable button
    btn.innerHTML = btn.id === "regSubmit" ? "Đăng ký" : "Đăng nhập"; // Khôi phục text gốc dựa trên id
    btn.classList.remove("opacity-50"); // Bỏ mờ
  }
}

// Hàm cập nhật giao diện header dựa trên trạng thái đăng nhập
// Nếu có user đăng nhập: hiển thị tên và nút đăng xuất
// Nếu chưa đăng nhập: hiển thị nút đăng ký và đăng nhập
export function updateHeaderUI() {
  const currentUser = getLoggedInUser(); // Lấy user hiện tại từ localStorage
  const textEndDiv = document.querySelector(".text-end"); // Tìm div chứa UI auth
  
  console.log("[DEBUG updateHeaderUI] currentUser:", currentUser);
  console.log("[DEBUG updateHeaderUI] textEndDiv found:", !!textEndDiv);
  
  if (!textEndDiv) {
    console.error("[ERROR] .text-end div not found!");
    return;
  }
  
  if (currentUser) {
    // Người dùng đã đăng nhập
    console.log("[DEBUG] Rendering logout UI for:", currentUser.userName);
    textEndDiv.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <span class="text-light">Xin chào, <strong>${currentUser.userName}</strong></span>
        <button id="logoutBtn" class="btn btn-outline-light">Đăng xuất</button>
      </div>
    `;
    
    // Gắn event handler cho nút logout mới tạo
    const logoutBtn = document.getElementById("logoutBtn");
    console.log("[DEBUG] logoutBtn found:", !!logoutBtn);
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("[DEBUG] Logout clicked");
        logout(); // Gọi hàm logout
      });
    }
  } else {
    // Người dùng chưa đăng nhập
    console.log("[DEBUG] Rendering login UI");
    textEndDiv.innerHTML = `
      <div>
        <a data-bs-toggle="modal" data-bs-target="#dangky" class="btn btn-outline-light me-2">Đăng ký</a>
        <a data-bs-toggle="modal" data-bs-target="#dangnhap" class="btn btn-warning">Đăng nhập</a>
      </div>
    `;
  }
}

// Hàm cập nhật hiển thị độ mạnh mật khẩu khi người dùng nhập vào input
// Lắng nghe sự kiện input trên password field của form đăng ký
function updatePasswordStrength() {
  const passwordInput = document.getElementById("regPassword"); // Input mật khẩu đăng ký
  const strengthDiv = document.getElementById("passwordStrength"); // Div chứa thanh progress
  const strengthBar = document.getElementById("strengthBar"); // Thanh progress
  const strengthText = document.getElementById("strengthText"); // Text hiển thị độ mạnh

  if (!passwordInput) return; // Nếu không tìm thấy input, thoát

  passwordInput.addEventListener("input", function () {
    const password = this.value; // Lấy giá trị mật khẩu hiện tại

    if (!password) {
      strengthDiv.style.display = "none"; // Ẩn div nếu không có mật khẩu
      return;
    }

    const strength = getPasswordStrength(password); // Tính độ mạnh
    strengthDiv.style.display = "block"; // Hiển thị div
    // Đặt width cho thanh progress dựa trên level
    strengthBar.style.width = strength.level === "weak" ? "33%" : strength.level === "medium" ? "66%" : "100%";
    strengthBar.className = `progress-bar bg-${strength.color}`; // Đặt màu cho thanh
    strengthText.textContent = `Độ mạnh: ${strength.text}`; // Đặt text
    strengthText.className = `d-block mt-1 text-${strength.color}`; // Đặt màu cho text
  });
}

// Hàm lưu danh sách người dùng vào localStorage
export function saveUserList(userList) {
  localStorage.setItem(USER_LIST, JSON.stringify(userList));
}

// Hàm thêm hoặc cập nhật người dùng trong danh sách
// Nếu user đã tồn tại (dựa trên userName), cập nhật email
// Nếu chưa tồn tại, thêm mới vào danh sách
export function addUser(user) {
  const data = getUserList(); // Lấy danh sách hiện tại
  const isExisted = data.some((u) => u.userName === user.userName); // Kiểm tra tồn tại

  if (isExisted) {
    // Nếu đã tồn tại, tìm vị trí và cập nhật email
    const index = data.findIndex((u) => u.userName === user.userName);
    if (user.email) {
      data[index].email = user.email;
    }
  } else {
    // Nếu chưa tồn tại, thêm mới
    data.push(user);
  }
  saveUserList(data); // Lưu lại danh sách
}

// Hàm đóng modal một cách an toàn, xử lý focus và sử dụng Bootstrap API
// modalId: id của modal cần đóng (vd: "dangnhap", "dangky")
export function closeModal(modalId) {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return; // Nếu không tìm thấy modal, thoát

  // Xử lý focus: chuyển focus ra khỏi modal trước khi đóng để tránh vấn đề accessibility
  const activeEl = document.activeElement;
  if (modalEl.contains(activeEl)) {
    // Tìm element có thể focus được
    const candidate = document.querySelector("button[data-bs-toggle='modal'], [tabindex='0'], body");
    if (candidate && typeof candidate.focus === "function") {
      candidate.focus();
    } else {
      document.body.focus();
    }
  }

  // Sử dụng Bootstrap Modal API (ESM) hoặc fallback
  let instance = null;
  if (typeof Modal !== "undefined") {
    // Nếu Modal được import (ESM)
    instance = Modal.getInstance(modalEl) || new Modal(modalEl);
  } else if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Modal) {
    // Fallback cho global bootstrap
    instance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
  }

  if (instance) {
    instance.hide(); // Đóng modal bằng API
  } else {
    // Last resort: thay đổi class và attributes thủ công
    modalEl.classList.remove("show");
    modalEl.style.display = "none";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.setAttribute("aria-modal", "false");
    modalEl.removeAttribute("aria-modal");
  }

  // Ensure backdrop cleanup
  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((bg) => bg.parentNode?.removeChild(bg));

  // Clear body class if left behind
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.removeAttribute("style");
}

// Hàm đăng ký người dùng mới
// Kiểm tra email, mật khẩu, và thêm vào danh sách nếu hợp lệ
// Trả về Promise: resolve() nếu thành công, reject(error) nếu thất bại
export function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    const email = username.trim(); // Loại bỏ khoảng trắng đầu cuối
    const passwordTrim = password;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !passwordTrim) {
      reject(new Error("Email và mật khẩu không được để trống"));
      return;
    }

    if (!validateEmail(email)) {
      reject(new Error("Email không hợp lệ"));
      return;
    }

    if (emailExists(email)) {
      reject(new Error("Email này đã được đăng ký"));
      return;
    }

    const passwordCheck = validatePassword(passwordTrim);
    if (!passwordCheck.valid) {
      reject(new Error(passwordCheck.message));
      return;
    }

    // Tạo object user
    const user = {
      userName: email,
      passWord: passwordTrim,
    };

    try {
      addUser(user); // Thêm user vào danh sách
      resolve(); // Thành công
    } catch (err) {
      reject(err); // Thất bại
    }
  });
}

// Hàm đăng nhập người dùng
// Kiểm tra thông tin, rate limiting, và lưu user nếu thành công
// Trả về Promise: resolve(user) nếu thành công, reject(error) nếu thất bại
export function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    const email = username.trim(); // Loại bỏ khoảng trắng
    const passwordTrim = password;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !passwordTrim) {
      reject(new Error("Email và mật khẩu không được để trống"));
      return;
    }

    if (!validateEmail(email)) {
      reject(new Error("Email không hợp lệ"));
      return;
    }

    // Kiểm tra xem tài khoản có bị khóa không
    if (isLockedOut(email)) {
      const remaining = getRemainingLockoutTime(email);
      reject(new Error(`Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau ${remaining} giây`));
      return;
    }

    const data = getUserList(); // Lấy danh sách user
    const user = data.find((u) => u.userName === email && u.passWord === passwordTrim); // Tìm user khớp

    if (user) {
      // Đăng nhập thành công
      console.log("[DEBUG loginUser] User found:", user);
      clearFailedAttempts(email); // Xóa record thất bại
      setLoggedInUser(user); // Lưu user hiện tại
      console.log("[DEBUG loginUser] setLoggedInUser called");
      resolve(user); // Trả về user
    } else {
      // Đăng nhập thất bại
      recordFailedAttempt(email); // Ghi nhận thất bại
      const attempts = getFailedAttempts();
      const remaining = MAX_FAILED_ATTEMPTS - attempts[email].count; // Số lần còn lại
      
      if (remaining === 0) {
        // Đã đạt giới hạn, khóa tài khoản
        reject(new Error(`Tài khoản bị khóa. Vui lòng thử lại sau ${Math.ceil(LOCKOUT_TIME / 60000)} phút`));
      } else {
        // Còn lần thử
        reject(new Error(`Thông tin đăng nhập không đúng (${remaining} lần còn lại)`));
      }
    }
  });
}

// ******************* Code phần Register (Đăng ký)
// Khởi tạo các hàm xử lý UI cho form đăng ký
togglePasswordVisibility(); // Bật chức năng toggle mật khẩu
updatePasswordStrength(); // Bật chức năng hiển thị độ mạnh mật khẩu

// Sử dụng event delegation để lắng nghe submit form đăng ký
// Vì form được tạo động sau khi DOM load
document.addEventListener("submit", async function (event) {
  if (event.target.id === "regFormUser") { // Kiểm tra đúng form đăng ký
    event.preventDefault(); // Ngăn submit mặc định
    setFeedback("regMessage", "", true); // Xóa thông báo cũ
    setButtonLoading("regSubmit", true); // Hiển thị loading

    const username = document.getElementById("regUsername").value.trim(); // Lấy email
    const password = document.getElementById("regPassword").value; // Lấy mật khẩu

    try {
      await registerUser(username, password); // Gọi hàm đăng ký
      setFeedback("regMessage", "Đăng ký thành công!", false); // Thông báo thành công
      closeModal("dangky"); // Đóng modal
      event.target.reset(); // Reset form
    } catch (error) {
      setFeedback("regMessage", error.message || "Đăng ký thất bại", true); // Thông báo lỗi
      setButtonLoading("regSubmit", false); // Tắt loading
    }
  }
});

// ******************* Code phần Login (Đăng nhập)
// Sử dụng event delegation để lắng nghe submit form đăng nhập
document.addEventListener("submit", async function (event) {
  if (event.target.id === "loginForm") { // Kiểm tra đúng form đăng nhập
    event.preventDefault(); // Ngăn submit mặc định
    setFeedback("loginMessage", "", true); // Xóa thông báo cũ
    setButtonLoading("loginSubmit", true); // Hiển thị loading

    const username = document.getElementById("username").value.trim(); // Lấy email
    const password = document.getElementById("password").value; // Lấy mật khẩu

    try {
      const result = await loginUser(username, password); // Gọi hàm đăng nhập
      console.log("[DEBUG] loginUser resolved with:", result);
      console.log("[DEBUG] Login successful, calling updateHeaderUI");
      setFeedback("loginMessage", "Đăng nhập thành công!", false); // Thông báo thành công
      event.target.reset(); // Reset form
      closeModal("dangnhap"); // Đóng modal
      
      // Cập nhật header UI với trạng thái đã đăng nhập
      updateHeaderUI();
    } catch (error) {
      console.log("[DEBUG] Login error:", error.message);
      setFeedback("loginMessage", error.message || "Thông tin đăng nhập không đúng", true); // Thông báo lỗi
      setButtonLoading("loginSubmit", false); // Tắt loading
    }
  }
});

// Event delegation fallback cho nút logout (mặc dù đã có trong updateHeaderUI)
document.addEventListener("click", function (event) {
  if (event.target.id === "logoutBtn") { // Kiểm tra click vào nút logout
    event.preventDefault(); // Ngăn hành vi mặc định
    logout(); // Gọi hàm logout
  }
});
