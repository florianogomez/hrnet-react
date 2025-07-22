// Mock window.alert pour éviter les warnings jsdom dans les tests
window.alert = jest.fn();
import "@testing-library/jest-dom";

// Masque les warnings act(...) de React Suspense dans la console des tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("A suspended resource finished loading inside a test")
  ) {
    return;
  }
  originalError(...args);
};
