// Utility functions for image handling
export function getPlaceholderImage() {
  return '/src/assets/placeholder-image.jpg'; // fallback if no image
}

export function isValidImageUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}