import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./style.css";

//1. Cách gọi ảnh
import logoIpg from "./assets/logo.jpg";

//2. Import header
import { header } from "./header.js";
import { footer } from "./footer.js";
import { content } from "./content.js";
import { updateHeaderUI } from "./user.js";

//3. import tài nguyên để sử dụng ở tấ cả mọi nơi
document.querySelector("#app").innerHTML = `
  <div>${header(logoIpg)}</div>
  <div>${content()}</div>
  <div>${footer()}</div>
`;

// Initialize header UI after rendering
updateHeaderUI();
