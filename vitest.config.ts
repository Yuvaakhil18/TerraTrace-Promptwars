import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        include: [
          'src/utils/validators.ts',
          'src/services/emissionFactors.ts',
          'src/components/Logger/ActivityLogger.tsx',
          'src/hooks/useGemini.ts',
        ],
        thresholds: {
          statements: 90,
          branches: 80,
          functions: 70,
          lines: 90,
        },
      },
    },
  }),
);
