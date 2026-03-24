import { headerMenu } from "./header-menu.js";

export function footer() {
  return `
  <div class="container">
      <footer class="py-3 my-4">
        <ul class="d-flex nav justify-content-center border-bottom pb-3 mb-3">
        ${headerMenu()}
        </ul>
        <p class="text-center text-muted">© 2021 Company, Inc</p>
      </footer>
    </div>`;
}
