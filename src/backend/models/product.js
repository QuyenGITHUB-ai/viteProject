import { supabase } from "../supabase";

export async function createProduct(data) {
  const file = data["anh_san_pham"];
  const tieu_de = data["ten_san_pham"];
  const mo_ta_ngan = data["mo_ta_ngan"];
  const gia_tien = data["gia_tien"];

  let imageUrl = "";
  if (file && typeof file !== 'string') { // Check if it's a file object, not a URL string
    const fileName = Date.now() + "_" + file.name;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = await supabase.storage.from("images").getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  } else if (typeof file === 'string') {
    // If file is already a URL string, use it directly
    imageUrl = file;
  }

  const { data: productData, error: insertError } = await supabase
    .from("products")
    .insert({
      tieu_de,
      mo_ta_ngan,
      gia_tien,
      anh_san_pham: imageUrl,
    })
    .select()
    .single();

  console.log("Insert response:", { productData, insertError });
  if (insertError) throw insertError;
  console.log("Inserted product:", productData);

  return mapProduct(productData);
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  // Map fields to match product structure
  return (data || []).map(mapProduct);
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  return mapProduct(data);
}

export async function updateProduct(id, data) {
  let imageUrl = data.anh_san_pham;

  // Handle file upload if a new file is provided
  if (data.anh_san_pham instanceof File) {
    const file = data.anh_san_pham;
    const fileName = Date.now() + "_" + file.name;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = await supabase.storage.from("images").getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("products")
    .update({
      tieu_de: data.ten_san_pham,
      mo_ta_ngan: data.mo_ta_ngan,
      gia_tien: data.gia_tien,
      anh_san_pham: imageUrl,
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) throw updateError;
  console.log("Updated product:", updatedData);

  return mapProduct(updatedData);
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
  console.log("Deleted product with ID:", id);
}

// Helper function to map Supabase fields to frontend format
function mapProduct(data) {
  return {
    id: data.id,
    ten_san_pham: data.tieu_de,
    mo_ta: data.mo_ta_ngan,
    gia_tien: data.gia_tien,
    anh_san_pham: data.anh_san_pham,
  };
}