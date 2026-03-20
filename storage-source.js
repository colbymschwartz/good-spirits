// Local storage utility with Good Spirits key prefix
// Provides safe access to localStorage with JSON parsing/stringifying

export const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("good-spirits-" + key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("good-spirits-" + key, JSON.stringify(value));
    } catch {}
  }
};
