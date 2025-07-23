import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    globalName: 'num2text',
    outDir: 'dist',
    target: 'es2018',
    clean: true,
})
