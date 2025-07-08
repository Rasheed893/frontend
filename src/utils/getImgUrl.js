function getImgUrl(name) {
  return new URL(`../assets/default-image.png`, import.meta.url);
  // return new URL(`../assets/items/${name}`, import.meta.url);
}
export { getImgUrl };
