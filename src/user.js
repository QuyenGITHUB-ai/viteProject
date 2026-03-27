import { Modal } from "bootstrap";

//******************** Ý tưởng xử lý
//1. Hàm lấy user từ local
const USER_LIST = "my_user_list";

export function getUserList() {
  const data = localStorage.getItem(USER_LIST);
  return data ? JSON.parse(data) : [];
}

export function validateEmail(email) {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    };
  }
  return { valid: true };
}

function setFeedback(elementId, message, isError = true) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = isError ? "text-danger" : "text-success";
}

//2. Hàm lưu user vào danh sách user trong local
export function saveUserList(userList) {
  localStorage.setItem(USER_LIST, JSON.stringify(userList));
}

//3. Hàm thêm dữ liệu user vào danh sách trong local
export function addUser(user) {
  const data = getUserList();
  const isExisted = data.some((u) => u.userName === user.userName);

  if (isExisted) {
    //Tìm vị trí user trong data
    const index = data.findIndex((u) => u.userName === user.userName);
    if (user.email) {
      data[index].email = user.email;
    }
  } else {
    // Thêm mới sp vào giỏ hàng
    data.push(user);
  }
  saveUserList(data);
}

export function closeModal(modalId) {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  // Get focus out from current modal controls before hiding
  const activeEl = document.activeElement;
  if (modalEl.contains(activeEl)) {
    const candidate = document.querySelector("button[data-bs-toggle='modal'], [tabindex='0'], body");
    if (candidate && typeof candidate.focus === "function") {
      candidate.focus();
    } else {
      document.body.focus();
    }
  }

  // Bootstrap module API (ESM) or fallback
  let instance = null;
  if (typeof Modal !== "undefined") {
    instance = Modal.getInstance(modalEl) || new Modal(modalEl);
  } else if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Modal) {
    instance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
  }

  if (instance) {
    instance.hide();
  } else {
    // last resort: remove class attributes and backdrop
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

//********************* Code phần (Register) đăng ký
//1. Khi người dùng bấm Đăng ký:
//2. Chặn hành vi submit mặc định (preventDefault)
export function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    const email = username.trim();
    const passwordTrim = password;

    if (!email || !passwordTrim) {
      reject(new Error("Email và mật khẩu không được để trống"));
      return;
    }

    if (!validateEmail(email)) {
      reject(new Error("Email không hợp lệ"));
      return;
    }

    const passwordCheck = validatePassword(passwordTrim);
    if (!passwordCheck.valid) {
      reject(new Error(passwordCheck.message));
      return;
    }

    const user = {
      userName: email,
      passWord: passwordTrim,
    };

    try {
      addUser(user);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    const email = username.trim();
    const passwordTrim = password;

    if (!email || !passwordTrim) {
      reject(new Error("Email và mật khẩu không được để trống"));
      return;
    }

    if (!validateEmail(email)) {
      reject(new Error("Email không hợp lệ"));
      return;
    }

    const data = getUserList();
    const user = data.find((u) => u.userName === email && u.passWord === passwordTrim);

    if (user) {
      resolve(user);
    } else {
      reject(new Error("Thông tin đăng nhập không đúng"));
    }
  });
}

// ******************* Code phần Register (Đăng ký)
// Sử dụng event delegation vì form được tạo sau khi JS load
document.addEventListener("submit", async function (event) {
  if (event.target.id === "regFormUser") {
    event.preventDefault();
    setFeedback("regMessage", "", true);

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;

    try {
      await registerUser(username, password);
      setFeedback("regMessage", "Đăng ký thành công!", false);
      closeModal("dangky");
      event.target.reset();
    } catch (error) {
      setFeedback("regMessage", error.message || "Đăng ký thất bại", true);
    }
  }
});

// ******************* Code phần Login (Đăng nhập)
const loginForm = document.getElementById("loginForm");
//Dùng if là để kiểm tra phần tử html có tồn tại hay không
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    setFeedback("loginMessage", "", true);

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      await loginUser(username, password);
      setFeedback("loginMessage", "Đăng nhập thành công!", false);
      loginForm.reset();
      closeModal("dangnhap");
    } catch (error) {
      setFeedback("loginMessage", error.message || "Thông tin đăng nhập không đúng", true);
    }
  });
}

//1. Khi đăng nhập xong, ẩn button login và singin chỉ hiển thị Quyền
//2. Kiểm tra đăng nhập nếu chưa chuyển sang trang login
