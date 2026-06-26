import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from "node:url"

const kitSrc = fileURLToPath(new URL("../../packages/logistic-kit/src", import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Mirror the published entry points onto the workspace source so the
      // gallery exercises the real package surface without a build step.
      "@dash-electric/logistic-kit/lib/utils": `${kitSrc}/lib/utils.tsx`,
      "@dash-electric/logistic-kit": `${kitSrc}/index.tsx`,
    },
  },
  server: { port: 4321, open: true },
})
