// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var { docs, meta } = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig({});
export {
  source_config_default as default,
  docs,
  meta
};
