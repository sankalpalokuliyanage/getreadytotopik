import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // මෙම ප්ලගිනය අනිවාර්යයි

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});