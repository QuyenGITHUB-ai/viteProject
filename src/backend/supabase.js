//Đoạn code này làm 3 việc chính:
//1. Import thư viện Supabase Thư viện này giúp bạn: Kết nối database, Gọi API, Xác thực (auth), Storage (upload file)
//2. Khai báo thông tin project (URL + API Key)
//3. Tạo client để làm việc với database

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
