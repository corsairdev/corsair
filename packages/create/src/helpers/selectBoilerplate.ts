import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type InstallerOptions } from "~/installers/index.js";

type SelectBoilerplateProps = Required<
  Pick<InstallerOptions, "packages" | "projectDir">
>;

// This generates the layout.tsx file that is used to render the app (App Router only)
export const selectLayoutFile = ({
  projectDir,
  packages,
}: SelectBoilerplateProps) => {
  const layoutFileDir = path.join(PKG_ROOT, "template/extras/src/app/layout");

  const usingTw = packages.tailwind.inUse;
  const usingTRPC = packages.trpc.inUse;
  let layoutFile = "with-tw.tsx"; // Default to tailwind since we always have betterAuth
  if (usingTRPC && usingTw) {
    layoutFile = "with-trpc-tw.tsx";
  } else if (usingTRPC && !usingTw) {
    layoutFile = "with-trpc.tsx";
  } else if (!usingTRPC && usingTw) {
    layoutFile = "with-tw.tsx";
  } else {
    layoutFile = "with-trpc.tsx"; // Fallback
  }

  const appSrc = path.join(layoutFileDir, layoutFile);
  const appDest = path.join(projectDir, "src/app/layout.tsx");
  fs.copySync(appSrc, appDest);
};

// This selects the proper page.tsx to be used that showcases the chosen tech (App Router only)
export const selectPageFile = ({
  projectDir,
  packages,
}: SelectBoilerplateProps) => {
  const indexFileDir = path.join(PKG_ROOT, "template/extras/src/app/page");

  const usingTRPC = packages.trpc.inUse;
  const usingTw = packages.tailwind.inUse;

  // Always use BetterAuth pages
  let indexFile = "with-better-auth.tsx";
  if (usingTRPC && usingTw) {
    indexFile = "with-better-auth-trpc-tw.tsx";
  } else if (usingTRPC && !usingTw) {
    indexFile = "with-better-auth-trpc.tsx";
  } else if (!usingTRPC && usingTw) {
    indexFile = "with-better-auth-tw.tsx";
  } else {
    indexFile = "with-better-auth.tsx";
  }

  const indexSrc = path.join(indexFileDir, indexFile);
  const indexDest = path.join(projectDir, "src/app/page.tsx");
  fs.copySync(indexSrc, indexDest);
};
