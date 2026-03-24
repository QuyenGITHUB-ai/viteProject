import { productList } from "./product-list.js";
import { contentLeft } from "./content-left.js";

export function content() {
  return `
 <div class="album py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
         ${contentLeft()}
          </div>
          <div class="col-md-9">${productList()}</div>
        </div>
      </div>
    </div>
`;
}
