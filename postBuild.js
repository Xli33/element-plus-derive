import { rename } from 'node:fs/promises'

rename('dist/umd.d.ts', 'dist/umd/index.d.ts').catch((err) => {
  console.warn(`failed to move umd.d.ts and the error is:`, err)
})
