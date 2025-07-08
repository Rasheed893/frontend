export default function getFirebasePathFromUrl(url) {
  const decoded = decodeURIComponent(url);
  const start = decoded.indexOf("/o/") + 3;
  const end = decoded.indexOf("?alt=");
  return decoded.substring(start, end); // items/itemId/filename.jpg
}
