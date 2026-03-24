import { headerMenu } from "./header-menu.js";
import { registerUser } from "./user.js";

function actSubmit() {
  registerUser("quyen@gmil.com", "qưeqwe");
}

export function header(logoIpg) {
  return `
    <header class="p-3 bg-dark text-white">
  <div class="container">
    <div
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
    >
      <a
        href="/"
        class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
      >
        <img src="${logoIpg}" alt="logo" style="height: 30px;" />
      </a>
<ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0" > ${headerMenu()} </ul>
      <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
        <input
          type="search"
          class="form-control form-control-dark"
          placeholder="Search..."
          aria-label="Search"
        />
      </form>
      <div class="text-end">
        <a data-bs-toggle="modal" data-bs-target="#dangky" class="btn btn-outline-light me-2"> Đăng ký </a>
        <a data-bs-toggle="modal" data-bs-target="#dangnhap" class="btn btn-warning">Đăng nhập</a>
      </div>
    </div>
  </div>
</header>

<!-- Modal đăng ký -->
<div class="modal fade" id="dangky" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2">Form đăng ký</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-5 pt-0">
          <form class="" id="regFormUser" onsubmit="${actSubmit()}">
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control rounded-3"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control rounded-3"
                id="floatingPassword"
                placeholder="Password"
              />
              <label for="floatingPassword">Password</label>
            </div>
            <button
              class="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
              type="submit"
            >
              Đăng ký
            </button>
            <small class="text-body-secondary"
              >By clicking Sign up, you agree to the terms of use.</small
            >
            <hr class="my-4" />
            <h2 class="fs-5 fw-bold mb-3">Or use a third-party</h2>
            <button
              class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3"
              type="submit"
            >
              <svg class="bi me-1" width="16" height="16" aria-hidden="true">
                <use xlink:href="#google"></use>
              </svg>
              Đăng ký với Google
            </button>
            <button
              class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3"
              type="submit"
            >
              <svg class="bi me-1" width="16" height="16" aria-hidden="true">
                <use xlink:href="#facebook"></use>
              </svg>
              Đăng ký với Facebook
            </button>
          </form>
        </div>
      </div>
    </div>
</div>

<!-- Modal đăng nhập -->
<div class="modal fade" id="dangnhap" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2">Form đăng nhập</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-5 pt-0">
          <form class="">
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control rounded-3"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control rounded-3"
                id="floatingPassword"
                placeholder="Password"
              />
              <label for="floatingPassword">Password</label>
            </div>
            <button
              class="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
              type="submit"
            >
              Đăng nhập
            </button>
            <small class="text-body-secondary"
              >By clicking Sign up, you agree to the terms of use.</small
            >
            <hr class="my-4" />
            <h2 class="fs-5 fw-bold mb-3">Or use a third-party</h2>
            <button
              class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3"
              type="submit"
            >
              <svg class="bi me-1" width="16" height="16" aria-hidden="true">
                <use xlink:href="#google"></use>
              </svg>
              Đăng nhập với Google
            </button>
            <button
              class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3"
              type="submit"
            >
              <svg class="bi me-1" width="16" height="16" aria-hidden="true">
                <use xlink:href="#facebook"></use>
              </svg>
              Đăng nhập với Facebook
            </button>
          </form>
        </div>
      </div>
    </div>
</div>
`;
}
