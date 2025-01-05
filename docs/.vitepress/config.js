import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ol-displaced-points",
  description: "Displaced Points methodology works to visualize all features of a point layer, even if they have the same location. The map takes the points falling in a given Distance tolerance from each other (cluster) and places them around their barycenter.",
  base: '/ol-displaced-points/',
})
