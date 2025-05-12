import { resolve } from 'path'
import { defineConfig } from 'vite'


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        exercise: resolve(__dirname, 'mainExercise/exercise.html'),
        admin: resolve(__dirname, 'admin/admin.html'),

      },
    },
  },
})
