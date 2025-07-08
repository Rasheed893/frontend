export const loadState = (key, defaultValue) => {
  try {
    const serializedState = sessionStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.log("Failed to load from session storage: ", error);
    return defaultValue;
  }
};

export const saveState = (key, obj) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(obj));
  } catch (error) {
    console.log("Failed to save into session storage: ", error);
  }
};
