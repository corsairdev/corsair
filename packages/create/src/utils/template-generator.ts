import fs from "fs-extra";
import path from "path";
import type { ProjectConfig } from "../cli/create-project.js";

export async function generateTemplate(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	// Ensure project directory exists
	await fs.ensureDir(projectPath);

	// Generate package.json
	await generatePackageJson(projectPath, config);

	// Generate basic project structure
	await generateProjectStructure(projectPath, config);

	// Generate environment files
	await generateEnvironmentFiles(projectPath);

	// Generate configuration files
	await generateConfigFiles(projectPath, config);

	// Generate database files
	await generateDatabaseFiles(projectPath, config);

	// Generate Corsair setup
	await generateCorsairSetup(projectPath, config);

	// Generate Next.js app structure
	await generateNextjsStructure(projectPath, config);

	// Generate UI components
	await generateUIComponents(projectPath);

	// Generate seed data
	await generateSeedData(projectPath, config);

	// Generate README and documentation
	await generateDocumentation(projectPath, config);
}

async function generatePackageJson(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	const packageJson = {
		name: config.projectName,
		version: "0.1.0",
		private: true,
		scripts: {
			dev: "next dev",
			build: "next build",
			start: "next start",
			lint: "eslint",
			...(config.orm === "prisma"
				? {
						"db:generate": "prisma generate",
						"db:push": "prisma db push",
						"db:migrate": "prisma migrate dev",
						"db:studio": "prisma studio",
						"db:seed": "tsx db/seed.ts",
					}
				: {
						"db:generate": "drizzle-kit generate",
						"db:push": "drizzle-kit push",
						"db:migrate": "drizzle-kit migrate",
						"db:studio": "drizzle-kit studio",
						"db:seed": "tsx db/seed.ts",
					}),
			"corsair:generate": "corsair generate",
			"corsair:check": "corsair check",
			"corsair:migrate": "corsair migrate",
			config: "tsx corsair.config.ts",
		},
		dependencies: {
			"@corsair-ai/core": "latest",
			"@tanstack/react-query": "^5.90.5",
			"@trpc/client": "^11.6.0",
			"@trpc/server": "^11.6.0",
			"@trpc/tanstack-react-query": "^11.6.0",
			...(config.orm === "prisma"
				? {
						"@prisma/client": "^5.22.0",
					}
				: {
						"drizzle-orm": "^0.31.2",
						"drizzle-zod": "^0.5.1",
						pg: "^8.11.0",
					}),
			"@radix-ui/react-avatar": "^1.1.10",
			"@radix-ui/react-dialog": "^1.1.15",
			"@radix-ui/react-select": "^2.2.6",
			"@radix-ui/react-slot": "^1.2.3",
			"class-variance-authority": "^0.7.1",
			clsx: "^2.1.1",
			dotenv: "^17.2.3",
			"lucide-react": "^0.546.0",
			next: "15.5.6",
			react: "19.1.0",
			"react-dom": "19.1.0",
			"server-only": "^0.0.1",
			"tailwind-merge": "^3.3.1",
			tsx: "^4.20.6",
			zod: "^3.23.8",
		},
		devDependencies: {
			"@eslint/eslintrc": "^3",
			"@tailwindcss/postcss": "^4",
			"@types/node": "^20",
			"@types/react": "^19",
			"@types/react-dom": "^19",
			...(config.orm === "prisma"
				? {
						prisma: "^5.22.0",
					}
				: {
						"@types/pg": "^8.11.0",
						"drizzle-kit": "^0.22.7",
					}),
			eslint: "^9",
			"eslint-config-next": "15.5.6",
			tailwindcss: "^4",
			"tw-animate-css": "^1.4.0",
			typescript: "^5",
		},
	};

	await fs.writeJson(path.join(projectPath, "package.json"), packageJson, {
		spaces: 2,
	});
}

async function generateProjectStructure(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	const directories = [
		"app",
		"components",
		"corsair",
		"db",
		"lib",
		"public",
		"data",
	];

	if (config.orm === "prisma") {
		directories.push("prisma");
	} else {
		directories.push("drizzle");
	}

	for (const dir of directories) {
		await fs.ensureDir(path.join(projectPath, dir));
	}
}

async function generateEnvironmentFiles(projectPath: string): Promise<void> {
	const envExample = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"

# Next.js
NEXT_PUBLIC_CORSAIR_API_ROUTE="/api/corsair"

# Optional: For production
# NEXTAUTH_SECRET=""
# NEXTAUTH_URL=""
`;

	const envLocal = `# Database (copy from .env.example and update)
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"

# Next.js
NEXT_PUBLIC_CORSAIR_API_ROUTE="/api/corsair"
`;

	await fs.writeFile(path.join(projectPath, ".env.example"), envExample);
	await fs.writeFile(path.join(projectPath, ".env.local"), envLocal);
}

async function generateConfigFiles(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	// Next.js config
	const nextConfig = `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: [${
		config.orm === "prisma" ? '"@prisma/client"' : '"drizzle-orm"'
	}, "@corsair-ai/core"]
}

export default nextConfig
`;

	await fs.writeFile(path.join(projectPath, "next.config.ts"), nextConfig);

	// TypeScript config
	const tsConfig = {
		compilerOptions: {
			target: "ES2017",
			lib: ["dom", "dom.iterable", "esnext"],
			allowJs: true,
			skipLibCheck: true,
			strict: true,
			noEmit: true,
			esModuleInterop: true,
			module: "esnext",
			moduleResolution: "bundler",
			resolveJsonModule: true,
			isolatedModules: true,
			jsx: "preserve",
			incremental: true,
			plugins: [
				{
					name: "next",
				},
			],
			baseUrl: ".",
			paths: {
				"@/*": ["./*"],
				"@/corsair": ["./corsair/index"],
				"@/corsair/*": ["./corsair/*"],
			},
		},
		include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
		exclude: ["node_modules"],
	};

	await fs.writeJson(path.join(projectPath, "tsconfig.json"), tsConfig, {
		spaces: 2,
	});

	// Other config files
	const configs = getConfigTemplates();

	await fs.writeFile(
		path.join(projectPath, "tailwind.config.ts"),
		configs.tailwind,
	);
	await fs.writeFile(
		path.join(projectPath, "postcss.config.mjs"),
		configs.postcss,
	);
	await fs.writeFile(
		path.join(projectPath, "eslint.config.mjs"),
		configs.eslint,
	);

	// components.json for shadcn
	const componentsJson = {
		$schema: "https://ui.shadcn.com/schema.json",
		style: "default",
		rsc: true,
		tsx: true,
		tailwind: {
			config: "tailwind.config.ts",
			css: "app/globals.css",
			baseColor: "slate",
			cssVariables: true,
			prefix: "",
		},
		aliases: {
			components: "@/components",
			utils: "@/lib/utils",
		},
	};

	await fs.writeJson(
		path.join(projectPath, "components.json"),
		componentsJson,
		{ spaces: 2 },
	);
}

async function generateDatabaseFiles(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	if (config.orm === "prisma") {
		await generatePrismaFiles(projectPath);
	} else {
		await generateDrizzleFiles(projectPath);
	}
}

async function generatePrismaFiles(projectPath: string): Promise<void> {
	const templates = getPrismaTemplates();
	await fs.writeFile(
		path.join(projectPath, "prisma", "schema.prisma"),
		templates.schema,
	);
	await fs.writeFile(
		path.join(projectPath, "db", "index.ts"),
		templates.dbIndex,
	);
}

async function generateDrizzleFiles(projectPath: string): Promise<void> {
	const templates = getDrizzleTemplates();
	await fs.writeFile(
		path.join(projectPath, "db", "schema.ts"),
		templates.schema,
	);
	await fs.writeFile(
		path.join(projectPath, "db", "index.ts"),
		templates.dbIndex,
	);
	await fs.writeFile(
		path.join(projectPath, "drizzle.config.ts"),
		templates.config,
	);
}

async function generateCorsairSetup(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	const templates = getCorsairTemplates(config);

	await fs.writeFile(
		path.join(projectPath, "corsair.config.ts"),
		templates.config,
	);
	await fs.writeFile(
		path.join(projectPath, "corsair", "procedure.ts"),
		templates.procedure,
	);
	await fs.writeFile(
		path.join(projectPath, "corsair", "client.ts"),
		templates.client,
	);
	await fs.writeFile(
		path.join(projectPath, "corsair", "index.ts"),
		templates.index,
	);

	await fs.ensureDir(path.join(projectPath, "corsair", "queries"));
	await fs.ensureDir(path.join(projectPath, "corsair", "mutations"));
	await fs.writeFile(
		path.join(projectPath, "corsair", "queries", "index.ts"),
		templates.queriesIndex,
	);
	await fs.writeFile(
		path.join(projectPath, "corsair", "mutations", "index.ts"),
		templates.mutationsIndex,
	);
}

async function generateNextjsStructure(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	await fs.ensureDir(
		path.join(projectPath, "app", "api", "corsair", "[...corsair]"),
	);

	const templates = getNextjsTemplates(config);

	await fs.writeFile(
		path.join(projectPath, "app", "api", "corsair", "[...corsair]", "route.ts"),
		templates.apiRoute,
	);
	await fs.writeFile(
		path.join(projectPath, "app", "layout.tsx"),
		templates.layout,
	);
	await fs.writeFile(
		path.join(projectPath, "app", "page.tsx"),
		templates.homepage,
	);
	await fs.ensureDir(path.join(projectPath, "app", "dashboard"));
	await fs.writeFile(
		path.join(projectPath, "app", "dashboard", "page.tsx"),
		templates.dashboard,
	);
	await fs.writeFile(
		path.join(projectPath, "app", "globals.css"),
		templates.globalCss,
	);
	await fs.writeFile(
		path.join(projectPath, "next-env.d.ts"),
		templates.nextEnv,
	);
}

async function generateUIComponents(projectPath: string): Promise<void> {
	await fs.ensureDir(path.join(projectPath, "components", "ui"));

	const templates = getUITemplates();

	await fs.writeFile(
		path.join(projectPath, "lib", "utils.ts"),
		templates.utils,
	);
	await fs.writeFile(
		path.join(projectPath, "components", "ui", "button.tsx"),
		templates.button,
	);
	await fs.writeFile(
		path.join(projectPath, "components", "ui", "card.tsx"),
		templates.card,
	);
}

async function generateSeedData(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	if (config.orm === "prisma") {
		const template = getPrismaSeedTemplate();
		await fs.writeFile(path.join(projectPath, "db", "seed.ts"), template);
	} else {
		const template = getDrizzleSeedTemplate();
		await fs.writeFile(path.join(projectPath, "db", "seed.ts"), template);
	}
}

async function generateDocumentation(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	const templates = getDocumentationTemplates(config);

	await fs.writeFile(path.join(projectPath, "README.md"), templates.readme);

	if (config.ide === "claude") {
		await fs.writeFile(path.join(projectPath, "CLAUDE.md"), templates.claude);
	}

	if (config.ide === "cursor") {
		await fs.writeFile(
			path.join(projectPath, ".cursorrules"),
			templates.cursorrules,
		);
	}

	await fs.writeFile(path.join(projectPath, ".gitignore"), templates.gitignore);
}

// Template functions to avoid inline templates
function getConfigTemplates() {
	return {
		tailwind: `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
`,
		postcss: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
`,
		eslint: `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
`,
	};
}

function getPrismaTemplates() {
	return {
		schema: `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  comments  Comment[]

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String

  comments Comment[]

  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String
  post     Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId   String

  @@map("comments")
}
`,
		dbIndex: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export type DB = typeof db;
`,
	};
}

function getDrizzleTemplates() {
	return {
		schema: `import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey().notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
`,
		dbIndex: `import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
`,
		config: `import type { Config } from "drizzle-kit";
import { config } from 'dotenv'
config({ path: ".env.local" });


export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
`,
	};
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

function getNextjsTemplates(config: ProjectConfig) {
	return {
		apiRoute: `import { fetchRequestHandler } from "@corsair-ai/core";
import { corsairRouter } from "@/corsair/index";
import { plugins } from "@/corsair/procedure";
import { db } from "@/db";

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/corsair",
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        userId: "123",
        db,
        plugins,
      };
    },
  });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
`,
		layout: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CorsairProvider } from "@corsair-ai/core/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Corsair App",
  description: "Generated by create-corsair",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={\`\${inter.className} antialiased\`}>
        <CorsairProvider>
          {children}
        </CorsairProvider>
      </body>
    </html>
  );
}
`,
		homepage: `import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🏴‍☠️ Welcome to Corsair
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your full-stack Next.js application with type-safe database operations,
            powered by Corsair and ${
							config.orm === "prisma" ? "Prisma" : "Drizzle"
						}.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://corsair.dev" target="_blank" rel="noopener noreferrer">
                Documentation
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Setup
              </CardTitle>
              <CardDescription>
                Configure your database and start building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Update your .env.local file</li>
                <li>Run database migrations</li>
                <li>Start the development server</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Features
              </CardTitle>
              <CardDescription>
                Everything you need to build modern apps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Type-safe database queries</li>
                <li>• Real-time data fetching</li>
                <li>• Authentication ready</li>
                <li>• Modern UI components</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 Deploy
              </CardTitle>
              <CardDescription>
                Ready for production deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vercel optimized</li>
                <li>• PostgreSQL ready</li>
                <li>• Environment variables</li>
                <li>• Edge runtime support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,
		dashboard: `"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Start building your application with Corsair
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage your application users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Content management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Published posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>User engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total comments
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`,
		globalCss: `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`,
		nextEnv: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`,
	};
}

function getUITemplates() {
	return {
		utils: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
		button: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,
		card: `import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`,
	};
}

function getPrismaSeedTemplate() {
	return `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
    },
  });

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with Corsair",
      content: "This is a sample post about getting started with Corsair.",
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Building with Next.js",
      content: "Learn how to build modern web applications with Next.js.",
      published: true,
      authorId: user2.id,
    },
  });

  // Create sample comments
  await prisma.comment.create({
    data: {
      content: "Great post! Thanks for sharing.",
      authorId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Very helpful tutorial!",
      authorId: user1.id,
      postId: post2.id,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
}

function getDrizzleSeedTemplate() {
	return `import { db } from "./index";
import { users, posts, comments } from "./schema";

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users
  const [user1] = await db.insert(users).values({
    id: "user_1",
    email: "alice@example.com",
    name: "Alice",
  }).returning();

  const [user2] = await db.insert(users).values({
    id: "user_2",
    email: "bob@example.com",
    name: "Bob",
  }).returning();

  // Create sample posts
  const [post1] = await db.insert(posts).values({
    id: "post_1",
    title: "Getting Started with Corsair",
    content: "This is a sample post about getting started with Corsair.",
    published: true,
    authorId: user1!.id,
  }).returning();

  const [post2] = await db.insert(posts).values({
    id: "post_2",
    title: "Building with Next.js",
    content: "Learn how to build modern web applications with Next.js.",
    published: true,
    authorId: user2!.id,
  }).returning();

  // Create sample comments
  await db.insert(comments).values([
    {
      id: "comment_1",
      content: "Great post! Thanks for sharing.",
      authorId: user2!.id,
      postId: post1!.id,
    },
    {
      id: "comment_2",
      content: "Very helpful tutorial!",
      authorId: user1!.id,
      postId: post2!.id,
    },
  ]);

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
`;
}

function getDocumentationTemplates(config: ProjectConfig) {
	return {
		readme: `# ${config.projectName}

A modern, full-stack Next.js application built with Corsair, ${
			config.orm === "prisma" ? "Prisma" : "Drizzle"
		}, and PostgreSQL.

## 🏴‍☠️ What's Included

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[Corsair](https://corsair.dev/)** - Type-safe database operations and API generation
- **[${config.orm === "prisma" ? "Prisma" : "Drizzle"}](${
			config.orm === "prisma"
				? "https://prisma.io/"
				: "https://orm.drizzle.team/"
		})** - Database ORM
- **[PostgreSQL](https://postgresql.org/)** - Production-ready database
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[TypeScript](https://typescriptlang.org/)** - Type safety throughout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (local or hosted)

### Installation

1. **Install dependencies:**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Update \`.env.local\` with your database connection string:
   \`\`\`
   DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
   \`\`\`

3. **Set up the database:**${
			config.orm === "prisma"
				? `
   \`\`\`bash
   # Generate Prisma client
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # (Optional) Seed the database
   pnpm db:seed
   \`\`\``
				: `
   \`\`\`bash
   # Push schema to database
   pnpm db:push

   # (Optional) Seed the database
   pnpm db:seed
   \`\`\``
		}

4. **Start the development server:**
   \`\`\`bash
   pnpm dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📚 Using Corsair

Corsair provides type-safe database operations through generated queries and mutations.

### Generating Queries

Generate a new query:
\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details"
\`\`\`

### Generating Mutations

Generate a new mutation:
\`\`\`bash
pnpm corsair mutation -n "create post" -i "create a new post with title and content"
\`\`\`

### Using in Components

\`\`\`tsx
'use client'

import { useCorsairQuery, useCorsairMutation } from '@/corsair/client'

export function PostList() {
  const { data: posts, isLoading } = useCorsairQuery('get posts with authors')
  const createPost = useCorsairMutation('create post')

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
        </div>
      ))}
    </div>
  )
}
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Import your repository in [Vercel](https://vercel.com)
3. Add your \`DATABASE_URL\` environment variable
4. Deploy!

## 📖 Learn More

- [Corsair Documentation](https://corsair.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [${config.orm === "prisma" ? "Prisma" : "Drizzle"} Documentation](${
			config.orm === "prisma"
				? "https://prisma.io/docs"
				: "https://orm.drizzle.team/"
		})

---

Built with ❤️ using Corsair and Next.js
`,
		claude: `# Corsair Agent Guide

## Code Generation Commands

### Generate Query/Mutation

\`\`\`bash
pnpm corsair query/mutation -n "query/mutationName" -i "instructions"
\`\`\`

**Agent must use this to generate queries.** DO NOT write query code manually.

- Adds the query/mutation file in the appropriate folder (queries/mutations) and also exports it in the index.ts file.
- Returns path where query/mutation was generated (e.g., \`corsair/queries/get-posts-with-authors.ts\`)
- To modify generated code, use: \`-u\` flag to update existing query/mutation

### Examples

**Query Examples:**

\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details from posts and users tables"
\`\`\`

\`\`\`bash
pnpm corsair query -n "get comments by post id" -i "get all comments for a specific post ID including author information"
\`\`\`

\`\`\`bash
pnpm corsair query -n "get user profile" -i "fetch user profile with their posts count and recent activity"
\`\`\`

**Mutation Examples:**

\`\`\`bash
pnpm corsair mutation -n "create post" -i "create a new post with title, content, and author ID"
\`\`\`

\`\`\`bash
pnpm corsair mutation -n "update comment" -i "update an existing comment's content by comment ID"
\`\`\`

\`\`\`bash
pnpm corsair mutation -n "delete post" -i "delete a post and all its associated comments by post ID"
\`\`\`

**Update Existing Query/Mutation:**

\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all published posts with author details, sorted by created date" -u
\`\`\`

## Development Commands

### Watch Mode

\`\`\`bash
pnpm corsair watch
\`\`\`

Continuously monitors schema changes and auto-regenerates type definitions.
Use during active development for instant feedback.

### Generate Types

\`\`\`bash
pnpm corsair generate
\`\`\`

One-time generation of all Corsair types and configurations.
Run after schema changes if not using watch mode.

## Validation Commands

### Check

\`\`\`bash
pnpm corsair check
\`\`\`

Validates all queries/mutations against current schema without making changes.
Reports type mismatches and breaking changes.

### Fix

\`\`\`bash
pnpm corsair fix
\`\`\`

Auto-fixes validation issues found by \`check\` command.
Updates queries/mutations to match current schema.

## Key Paths

\`\`\`
project-root/
├── corsair.config.ts           # Main config
├── corsair/
│   ├── index.ts                # Exports all procedures
│   ├── procedure.ts            # Base procedure config
│   ├── client.ts               # Client-side setup
│   ├── queries/
│   │   └── index.ts            # (managed by Corsair - don't change)
│   └── mutations/
│       └── index.ts            # (managed by Corsair - don't change)
├── app/api/corsair/[...corsair]/route.ts  # API endpoint
└── db/
    ├── index.ts                # Database client
    └── schema.ts               # Database schema${
			config.orm === "prisma" ? " (Prisma)" : " (Drizzle)"
		}
\`\`\`

## React Component Example

### Using Queries and Mutations in Components

\`\`\`tsx
'use client'

import { useState, useEffect } from 'react'
import {
  useCorsairQuery,
  useCorsairMutation,
  QueryOutputs,
} from '@/corsair/client'

interface PostDetailsProps {
  post: QueryOutputs['get post by id'] | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetails({ post, open, onOpenChange }: PostDetailsProps) {
  const { data: comments, isLoading } = useCorsairQuery(
    'get comments by post id',
    { postId: post?.id || '' },
    { enabled: !!post?.id }
  )

  const updatePost = useCorsairMutation('update post')
  const deleteComment = useCorsairMutation('delete comment')

  const [localPost, setLocalPost] = useState(post)

  useEffect(() => {
    setLocalPost(post)
  }, [post])

  const handleUpdateTitle = async (newTitle: string) => {
    if (!localPost) return

    setLocalPost({ ...localPost, title: newTitle })

    await updatePost.mutateAsync({
      postId: localPost.id,
      title: newTitle,
    })
  }

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment.mutateAsync({ commentId })
  }

  if (!localPost) return null

  return (
    <div>
      <h1>{localPost.title}</h1>
      <p>{localPost.content}</p>

      <div>
        <h2>Comments ({comments?.length || 0})</h2>
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments?.map(comment => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                disabled={deleteComment.isPending}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
\`\`\`
`,
		cursorrules: `# Corsair Project - Cursor Rules

## Code Generation Commands

### Generate Queries and Mutations

To generate queries and mutations, you MUST use the Corsair CLI commands. DO NOT write query/mutation code manually.

\`\`\`bash
pnpm corsair query -n "query-name" -i "detailed instructions"
pnpm corsair mutation -n "mutation-name" -i "detailed instructions"
\`\`\`

The CLI will:
- Generate the query/mutation file in the appropriate folder
- Export it in the index.ts file automatically
- Ensure type-safety with your database schema
- Return the path where the file was generated

### Update Existing Queries/Mutations

\`\`\`bash
pnpm corsair query -n "query-name" -i "updated instructions" -u
pnpm corsair mutation -n "mutation-name" -i "updated instructions" -u
\`\`\`

### Query Examples

\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details from posts and users tables"
pnpm corsair query -n "get user profile" -i "get user by ID with their posts count"
pnpm corsair query -n "get comments by post" -i "fetch all comments for a specific post ID with author info"
\`\`\`

### Mutation Examples

\`\`\`bash
pnpm corsair mutation -n "create post" -i "create a new post with title, content, and author ID"
pnpm corsair mutation -n "update user profile" -i "update user name and email by user ID"
pnpm corsair mutation -n "delete post" -i "delete a post by ID"
\`\`\`

## Development Workflow

### Watch Mode

Start watch mode during development to auto-regenerate types on schema changes:

\`\`\`bash
pnpm corsair watch
\`\`\`

### Database Commands${
			config.orm === "prisma"
				? `

\`\`\`bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create and run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed the database
\`\`\``
				: `

\`\`\`bash
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed the database
\`\`\``
		}

## Project Structure

\`\`\`
project-root/
├── corsair.config.ts           # Main Corsair configuration
├── corsair/
│   ├── index.ts                # Exports all procedures
│   ├── procedure.ts            # Base procedure configuration
│   ├── client.ts               # Client-side React hooks setup
│   ├── queries/                # Auto-generated queries (don't edit manually)
│   │   └── index.ts            # Managed by Corsair CLI
│   └── mutations/              # Auto-generated mutations (don't edit manually)
│       └── index.ts            # Managed by Corsair CLI
├── app/api/corsair/[...corsair]/route.ts  # API route handler
├── db/
│   ├── index.ts                # Database client
│   └── schema.ts               # Database schema${
			config.orm === "prisma" ? " (Prisma)" : " (Drizzle)"
		}
└── components/                 # React components
\`\`\`

## Important Rules

1. **Always use the Corsair CLI** to generate queries and mutations
2. **Do not manually edit** files in \`corsair/queries/\` or \`corsair/mutations/\`
3. **Use \`useCorsairQuery\` and \`useCorsairMutation\`** hooks in client components
4. **Follow Next.js 15 App Router** conventions (use 'use client' directive when needed)
5. **Keep database schema** in \`db/schema.ts\`${
			config.orm === "prisma" ? "" : " (or `prisma/schema.prisma`)"
		}
6. **Run \`pnpm db:push\`** after schema changes
7. **Use TypeScript** for all files
8. **Run \`pnpm corsair check\`** to validate queries/mutations after schema changes
9. **Run \`pnpm corsair fix\`** to auto-fix validation issues

## Using Corsair in Components

### Basic Usage

\`\`\`tsx
'use client'

import { useCorsairQuery, useCorsairMutation } from '@/corsair/client'

export function MyComponent() {
  const { data, isLoading, error } = useCorsairQuery('query-name')
  const mutation = useCorsairMutation('mutation-name')
  
  const handleAction = async () => {
    await mutation.mutateAsync({ /* params */ })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{/* Use data */}</div>
}
\`\`\`

### With Parameters

\`\`\`tsx
'use client'

import { useCorsairQuery } from '@/corsair/client'

export function PostDetail({ postId }: { postId: string }) {
  const { data: post } = useCorsairQuery(
    'get post by id',
    { postId },
    { enabled: !!postId }
  )
  
  return <div>{post?.title}</div>
}
\`\`\`

### With TypeScript Types

\`\`\`tsx
'use client'

import { useCorsairQuery, QueryOutputs } from '@/corsair/client'

type Post = QueryOutputs['get post by id']

export function PostComponent() {
  const { data: post } = useCorsairQuery('get post by id', { postId: '1' })
  
  return <div>{post?.title}</div>
}
\`\`\`

## Schema Changes Workflow

1. Update your database schema in \`db/schema.ts\`${
			config.orm === "prisma" ? " or `prisma/schema.prisma`" : ""
		}
2. Run \`pnpm db:push\` to apply changes to database
3. Run \`pnpm corsair check\` to validate existing queries/mutations
4. Run \`pnpm corsair fix\` to auto-fix any issues
5. Update component code if type signatures changed

## Tips

- Use descriptive names for queries and mutations
- Provide detailed instructions to the CLI for better code generation
- Review generated code to understand what was created
- Use \`-u\` flag to update existing queries/mutations instead of creating new ones
- Run \`pnpm corsair watch\` during development for instant feedback
- Check the \`CLAUDE.md\` file for more detailed examples
`,
		gitignore: `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Database
${config.orm === "prisma" ? "prisma/migrations" : "/drizzle/migrations"}
`,
	};
}
