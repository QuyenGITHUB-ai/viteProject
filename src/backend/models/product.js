import { supabase } from "../supabase";

export async function createProduct(data) {
  const file = data["anh_san_pham"];
  const tieu_de = data["ten_san_pham"];
  const mo_ta_ngan = data["mo_ta_ngan"];
  const gia_tien = data["gia_tien"];

  let imageUrl = "";
  if (file) {
    const fileName = Date.now() + "_" + file.name;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const { error: insertError } = await supabase.from("products").insert({
    tieu_de,
    mo_ta_ngan,
    gia_tien,
    anh_san_pham: imageUrl,
  });

  if (insertError) throw insertError;
}
