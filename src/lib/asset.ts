/// <reference types="vite/client" />

/** Prepends the Vite base URL so public assets work on both dev and GitHub Pages */
const asset = (filename: string) =>
  `${import.meta.env.BASE_URL}${filename.replace(/^\//, '')}`;

export default asset;
