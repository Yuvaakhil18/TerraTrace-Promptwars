/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // React Compiler Babel transform (must come before react() plugin)
    babel({
      presets: [reactCompilerPreset()],
    }),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      include: [
        'src/utils/validators.ts',
        'src/services/emissionFactors.ts',
        'src/components/Logger/ActivityLogger.tsx',
        'src/hooks/useGemini.ts'
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 70,
        lines: 90
      }
    }
  },
});
