import '@testing-library/jest-dom'
// Mock de matchMedia para el entorno de Jest
window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
  
