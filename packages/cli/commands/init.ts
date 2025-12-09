import type { DBTypes, Framework, ORMs } from "@corsair-ai/core/config";
import { confirm, input, select } from "@inquirer/prompts";
import { promises as fs } from "fs";
import { dirname, join } from "path";

interface InitConfig {
	orm: ORMs;
	dbType: DBTypes;
	framework: Framework;
	dbPath: string;
	apiRoute: string;
	corsairPath: string;
}

async function ensureDir(dirPath: string) {
	try {
		await fs.mkdir(dirPath, { recursive: true });
	} catch (error: any) {
		if (error.code !== "EEXIST") {
			throw error;
		}
	}
}

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

function getCorsairConfigTemplate(config: InitConfig): string {
	const { orm, dbType, dbPath } = config;

	if (orm === "drizzle") {
		return `import { config as dotenvConfig } from 'dotenv'
import { type CorsairConfig } from 'corsair'
import { db } from '${dbPath}'

dotenvConfig({ path: '.env.local' })

export const config = {
  dbType: '${dbType}',
  orm: 'drizzle',
  framework: 'nextjs',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  schema: db._.schema,
  connection: process.env.DATABASE_URL!,
  plugins: {},
} satisfies CorsairConfig<typeof db>

export type Config = typeof config
`;
	} else {
		return `import { config as dotenvConfig } from 'dotenv'
import { type CorsairConfig } from 'corsair'
import { db } from '${dbPath}'
import { Prisma } from '@prisma/client'

dotenvConfig({ path: '.env.local' })

export const config = {
  dbType: '${dbType}',
  orm: 'prisma',
  framework: 'nextjs',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  schema: Prisma.dmmf.datamodel,
  connection: process.env.DATABASE_URL!,
  plugins: {},
} satisfies CorsairConfig<typeof db>

export type Config = typeof config
`;
	}
}

function getProcedureTemplate(): string {
	return `import { createCorsairTRPC } from 'corsair'
import { createPlugins } from 'corsair/plugins'
import { config } from '@/corsair.config'

export const plugins = createPlugins(config)

export type DatabaseContext = {
  db: typeof config.db
  schema: Exclude<typeof config.schema, undefined>
  userId?: string
  plugins: typeof plugins
}

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t
`;
}

function getIndexTemplate(): string {
	return `import { dualKeyOperationsMap } from 'corsair'
import { router } from './procedure'
import * as queries from './queries'
import * as mutations from './mutations'

export const corsairRouter = router({
  ...dualKeyOperationsMap(queries),
  ...dualKeyOperationsMap(mutations),
})

export type CorsairRouter = typeof corsairRouter
`;
}

function getClientTemplate(): string {
	return `import { createCorsairClient, createCorsairHooks } from 'corsair'
import type { CorsairRouter } from '.'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) {
    return \`https://\${process.env.VERCEL_URL}\`
  }
  return \`http://localhost:\${process.env.PORT || 3000}\`
}

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: \`\${getBaseUrl()}\${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}\`,
})

const {
  useCorsairQuery,
  useCorsairMutation,
  corsairQuery,
  corsairMutation,
  types,
} = createCorsairHooks<CorsairRouter>(typedClient)

export { useCorsairQuery, useCorsairMutation, corsairQuery, corsairMutation }

export type QueryInputs = typeof types.QueryInputs
export type QueryOutputs = typeof types.QueryOutputs
export type MutationInputs = typeof types.MutationInputs
export type MutationOutputs = typeof types.MutationOutputs
`;
}

function getQueriesIndexTemplate(): string {
	return ``;
}

function getMutationsIndexTemplate(): string {
	return ``;
}

function getDbIndexTemplate(config: InitConfig): string {
	const { orm } = config;

	if (orm === "drizzle") {
		return `import 'server-only'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

export type DB = typeof db
`;
	} else {
		return `import 'server-only'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export type DB = typeof db
`;
	}
}

function getApiRouteTemplate(config: InitConfig): string {
	const { orm } = config;

	if (orm === "drizzle") {
		return `import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair/index'
import { db } from '@/db'
import { plugins } from '@/corsair/procedure'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/corsair',
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        userId: '123',
        db,
        schema: db._.schema!,
        plugins,
      }
    },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const HEAD = handler
export const OPTIONS = handler
`;
	} else {
		return `import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair/index'
import { db } from '@/db'
import { plugins } from '@/corsair/procedure'
import { Prisma } from '@prisma/client'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/corsair',
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        userId: '123',
        db,
        schema: Prisma.dmmf.datamodel,
        plugins,
      }
    },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const HEAD = handler
export const OPTIONS = handler
`;
	}
}

async function createCorsairFiles(
	config: InitConfig,
	createDbFiles: boolean,
	createSchema: boolean,
	overwriteConfig: boolean,
) {
	const { corsairPath, apiRoute, dbPath } = config;

	console.log("\n📁 Creating Corsair project structure...\n");

	const dbDir = dbPath.startsWith("./") ? dbPath.slice(2) : dbPath;
	const dbDirExists = await fileExists(dbDir);

	if (createDbFiles && !dbDirExists) {
		await ensureDir(dbDir);

		const dbIndexPath = join(dbDir, "index.ts");
		await fs.writeFile(dbIndexPath, getDbIndexTemplate(config));
		console.log(`   ✅ Created ${dbIndexPath}`);

		if (createSchema && config.orm === "drizzle") {
			const schemaPath = join(dbDir, "schema.ts");
			await fs.writeFile(schemaPath, "");
			console.log(`   ✅ Created ${schemaPath} (empty file)`);
		}
	} else if (dbDirExists) {
		console.log(`   ℹ️  ${dbDir}/ already exists, skipping db file creation`);
	}

	const corsairConfigPath = "corsair.config.ts";
	if (overwriteConfig) {
		await fs.writeFile(corsairConfigPath, getCorsairConfigTemplate(config));
		console.log(`   ✅ Created ${corsairConfigPath}`);
	} else {
		console.log(`   ⏭️  Skipping ${corsairConfigPath}`);
	}

	await ensureDir(corsairPath);
	console.log(`   ✅ Created ${corsairPath}/`);

	const procedurePath = join(corsairPath, "procedure.ts");
	await fs.writeFile(procedurePath, getProcedureTemplate());
	console.log(`   ✅ Created ${procedurePath}`);

	const indexPath = join(corsairPath, "index.ts");
	await fs.writeFile(indexPath, getIndexTemplate());
	console.log(`   ✅ Created ${indexPath}`);

	const clientPath = join(corsairPath, "client.ts");
	await fs.writeFile(clientPath, getClientTemplate());
	console.log(`   ✅ Created ${clientPath}`);

	const queriesDir = join(corsairPath, "queries");
	await ensureDir(queriesDir);
	const queriesIndexPath = join(queriesDir, "index.ts");
	await fs.writeFile(queriesIndexPath, getQueriesIndexTemplate());
	console.log(`   ✅ Created ${queriesDir}/`);
	console.log(`   ✅ Created ${queriesIndexPath}`);

	const mutationsDir = join(corsairPath, "mutations");
	await ensureDir(mutationsDir);
	const mutationsIndexPath = join(mutationsDir, "index.ts");
	await fs.writeFile(mutationsIndexPath, getMutationsIndexTemplate());
	console.log(`   ✅ Created ${mutationsDir}/`);
	console.log(`   ✅ Created ${mutationsIndexPath}`);

	const apiRouteDir = dirname(apiRoute);
	await ensureDir(apiRouteDir);
	await fs.writeFile(apiRoute, getApiRouteTemplate(config));
	console.log(`   ✅ Created ${apiRoute}`);
}

export async function init() {
	console.log("\n🚀 Welcome to Corsair! Let's set up your project.\n");
	console.log("📋 Please answer the following questions:\n");

	const orm = await select<ORMs>({
		message: "Which ORM are you using?",
		choices: [
			{ name: "Drizzle", value: "drizzle" },
			{ name: "Prisma", value: "prisma" },
		],
	});

	const dbType = await select<DBTypes>({
		message: "Which database are you using?",
		choices: [{ name: "PostgreSQL", value: "postgres" }],
	});

	const dbPath = await input({
		message: "Path to your database instance (e.g., ./db or ./db/index):",
		default: "./db",
	});

	const apiRoute = await input({
		message: "Path for API route:",
		default: "app/api/corsair/[...corsair]/route.ts",
	});

	const corsairPath = await input({
		message: "Path for Corsair folder:",
		default: "corsair",
	});

	const dbDir = dbPath.startsWith("./") ? dbPath.slice(2) : dbPath;
	const dbDirExists = await fileExists(dbDir);
	const corsairConfigExists = await fileExists("corsair.config.ts");

	let createDbFiles = false;
	let createSchema = false;
	let overwriteConfig = true;

	if (!dbDirExists) {
		createDbFiles = await confirm({
			message: `Create ${dbDir}/ folder with db/index.ts?`,
			default: true,
		});

		if (createDbFiles && orm === "drizzle") {
			createSchema = await confirm({
				message: "Create db/schema.ts (empty file)?",
				default: true,
			});
		}
	}

	if (corsairConfigExists) {
		overwriteConfig = await confirm({
			message: "corsair.config.ts already exists. Overwrite?",
			default: false,
		});
	}

	console.log("\n✨ Starting setup...\n");

	const config: InitConfig = {
		orm,
		dbType,
		framework: "nextjs",
		dbPath,
		apiRoute,
		corsairPath,
	};

	try {
		await createCorsairFiles(
			config,
			createDbFiles,
			createSchema,
			overwriteConfig,
		);

		console.log("\n✨ Corsair project initialized successfully!\n");
		console.log("📝 Next steps:");
		console.log(
			'   1. Add NEXT_PUBLIC_CORSAIR_API_ROUTE="/api/corsair" to your .env.local',
		);
		console.log("   2. Add DATABASE_URL to your .env.local");
		if (orm === "drizzle") {
			if (createSchema) {
				console.log("   3. Add your database schema to db/schema.ts");
				console.log(
					'   4. Run `pnpm corsair query -n "your query name"` to create your first query',
				);
				console.log(
					'   5. Run `pnpm corsair mutation -n "your mutation name"` to create your first mutation',
				);
			} else {
				console.log("   3. Create your database schema in db/schema.ts");
				console.log(
					'   4. Run `pnpm corsair query -n "your query name"` to create your first query',
				);
				console.log(
					'   5. Run `pnpm corsair mutation -n "your mutation name"` to create your first mutation',
				);
			}
		} else {
			console.log("   3. Create your Prisma schema in prisma/schema.prisma");
			console.log("   4. Run `npx prisma generate` to generate Prisma Client");
			console.log(
				'   5. Run `pnpm corsair query -n "your query name"` to create your first query',
			);
			console.log(
				'   6. Run `pnpm corsair mutation -n "your mutation name"` to create your first mutation',
			);
		}
		console.log("\n");
	} catch (error) {
		console.error("\n❌ Error initializing Corsair project:", error);
		process.exit(1);
	}
}
