# vite-plugin-react-css-modules

automatically transform component-scoped _.css|scss files to _.module.css|scss

# how to use

```
pnpm:
pnpm i --save-dev @roeefl/vite-plugin-react-css-modules

npm:
npm i --save-dev @roeefl/vite-plugin-react-css-modules
```

```ts
import { defineConfig } from 'vite'
import vitePluginReactCssModules from '@roeefl/vite-plugin-react-css-modules';

export default defineConfig({
  ...
  plugins: [
    vitePluginReactCssModules()
  ]
})
```
