import { withEsbuildOverride } from "remix-esbuild-override";
import NodeGlobalsPolyfills from "@esbuild-plugins/node-globals-polyfill";
import NodeModulesPolyfills from "@esbuild-plugins/node-modules-polyfill";
withEsbuildOverride((option, { isServer, isDev }) => {
  // update the option
  option.plugins = [
    NodeGlobalsPolyfills['default']({ buffer: true }),
    NodeModulesPolyfills['default'](),
    ...option.plugins,
  ];

  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  postcss: true,
  future: {
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*"],
  server: "./server.ts",
  serverBuildPath: "functions/[[path]].js",
  serverConditions: ["workerd", "worker", "browser"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "browser",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};
