import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import gltf from 'vite-plugin-gltf';
import { textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    gltf({
      transforms: [ textureCompress({ encoder: sharp }) ]
    })
  ],
});
