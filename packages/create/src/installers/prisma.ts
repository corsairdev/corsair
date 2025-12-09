import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import { addPackageScript } from "~/utils/addPackageScript.js";

export const prismaInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["prisma"],
    devMode: true,
  });
  addPackageDependency({
    projectDir,
    dependencies: ["@prisma/client"],
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  // Always use with-better-auth since betterAuth is required
  const schemaSrc = path.join(
    extrasDir,
    "prisma/schema",
    "with-better-auth.prisma"
  );
  let schemaText = fs.readFileSync(schemaSrc, "utf-8");
  // Update provider to postgresql
  schemaText = schemaText.replace(
    'provider = "sqlite"',
    'provider = "postgresql"'
  );
  const schemaDest = path.join(projectDir, "prisma/schema.prisma");
  fs.mkdirSync(path.dirname(schemaDest), { recursive: true });
  fs.writeFileSync(schemaDest, schemaText);

  const clientSrc = path.join(extrasDir, "src/server/db/db-prisma.ts");
  const clientDest = path.join(projectDir, "src/server/db.ts");

  addPackageScript({
    projectDir,
    scripts: {
      postinstall: "prisma generate",
      "db:push": "prisma db push",
      "db:studio": "prisma studio",
      "db:generate": "prisma migrate dev",
      "db:migrate": "prisma migrate deploy",
    },
  });

  fs.copySync(clientSrc, clientDest);
};
