//******************** Ý tưởng xử lý
//1. Hàm lấy user từ local
const USER_LIST = "my_user_list";

export function getUserList() {
  const data = localStorage.getItem(USER_LIST);
  return data ? JSON.parse(data) : [];
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
//********************* Code phần (Register) đăng ký
//1. Khi người dùng bấm Đăng ký:
//2. Chặn hành vi submit mặc định (preventDefault)
export function registerUser(username, password) {
  //4. Tạo dữ liệu object chứa thông tin đăng ký đưa vào USER_LIST
  const user = {
    userName: username,
    passWord: password,
  };
  //5. Lưu object vào localStorage
  addUser(user);
  alert("Đăng ký thành công!");
}

// ******************* Code phần Login (Đăng nhập)
const loginForm = document.getElementById("loginForm");
//Dùng if là để kiểm tra phần tử html có tồn tại hay không
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    //3. Lấy dữ liệu từ các ô input
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const data = getUserList();
    //Hàm CallBack
    const isExisted = data.findLast((u) => {
      return u.userName === username && u.passWord === password;
    });

    if (isExisted) {
      alert("Đăng nhập thành công!");
      loginForm.reset();
    } else {
      alert("Thông tin đăng nhập không đúng!");
    }
  });
}

//1. Khi đăng nhập xong, ẩn button login và singin chỉ hiển thị Quyền
//2. Kiểm tra đăng nhập nếu chưa chuyển sang trang login
