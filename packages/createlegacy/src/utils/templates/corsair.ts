import fs from 'fs-extra';
import path from 'path';
import type { ProjectConfig } from '../../cli/create-project.js';

export async function generateCorsairSetup(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	const templates = getCorsairTemplates(config);

	await fs.writeFile(
		path.join(projectPath, 'corsair.config.ts'),
		templates.config,
	);
	await fs.writeFile(
		path.join(projectPath, 'corsair', 'procedure.ts'),
		templates.procedure,
	);
	await fs.writeFile(
		path.join(projectPath, 'corsair', 'client.ts'),
		templates.client,
	);
	await fs.writeFile(
		path.join(projectPath, 'corsair', 'index.ts'),
		templates.index,
	);

	await fs.ensureDir(path.join(projectPath, 'corsair', 'queries'));
	await fs.ensureDir(path.join(projectPath, 'corsair', 'mutations'));
	await fs.writeFile(
		path.join(projectPath, 'corsair', 'queries', 'index.ts'),
		templates.queriesIndex,
	);
	await fs.writeFile(
		path.join(projectPath, 'corsair', 'mutations', 'index.ts'),
		templates.mutationsIndex,
	);
}

function getCorsairTemplates(config: ProjectConfig) {
	return {
		config: `import type { CorsairConfig } from "@corsair-ai/core";
import { config as dotenvConfig } from "dotenv";
import { db } from "./db";

dotenvConfig({ path: ".env.local" });

export const config = {
  dbType: "postgres",
  orm: "${config.orm}",
  framework: "nextjs",
  pathToCorsairFolder: "./corsair",
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  connection: process.env.DATABASE_URL!,
  plugins: {
    slack: {
      token: "",
      channels: {
        general: "id-1",
        technology: "id-2",
        "notifications-error": "id-2",
      },
    },
  },
} satisfies CorsairConfig<typeof db>;

export type Config = typeof config;
`,
		procedure: `import { createCorsairTRPC } from "@corsair-ai/core";
import { createPlugins } from "@corsair-ai/core/plugins";
import { config } from "@/corsair.config";

export const plugins = createPlugins(config);

export type DatabaseContext = {
  db: typeof config.db;
  userId?: string;
  plugins: typeof plugins;
};

const t = createCorsairTRPC<DatabaseContext>();
export const { router, procedure } = t;
`,
		client: `import { createCorsairClient, createCorsairHooks } from "@corsair-ai/core";
import type { CorsairRouter } from "@/corsair";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return \`https://\${process.env.VERCEL_URL}\`;
  }
  return \`http://localhost:\${process.env.PORT || 3000}\`;
};

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: \`\${getBaseUrl()}\${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}\`,
});

const {
  useCorsairQuery,
  useCorsairMutation,
  corsairQuery,
  corsairMutation,
  types,
} = createCorsairHooks<CorsairRouter>(typedClient);

export { useCorsairQuery, useCorsairMutation, corsairQuery, corsairMutation };

export type QueryInputs = typeof types.QueryInputs;
export type QueryOutputs = typeof types.QueryOutputs;
export type MutationInputs = typeof types.MutationInputs;
export type MutationOutputs = typeof types.MutationOutputs;
`,
		index: `import { dualKeyOperationsMap } from "@corsair-ai/core";
import { router } from "@/corsair/procedure";
import * as mutations from "@/corsair/mutations";
import * as queries from "@/corsair/queries";

export const corsairRouter = router({
  ...dualKeyOperationsMap(queries),
  ...dualKeyOperationsMap(mutations),
});

export type CorsairRouter = typeof corsairRouter;
`,
		queriesIndex: `// This file is managed by Corsair CLI
// Do not edit manually - use 'corsair query' command instead

export {};
`,
		mutationsIndex: `// This file is managed by Corsair CLI
// Do not edit manually - use 'corsair mutation' command instead

export {};
`,
	};
}
