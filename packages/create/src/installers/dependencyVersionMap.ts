/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
	// Better-Auth
	'better-auth': '^1.3',
	'@auth/drizzle-adapter': '^1.7.2',

	// Drizzle
	'drizzle-kit': '^0.30.5',
	'drizzle-orm': '^0.41.0',
	'drizzle-zod': '^0.5.1',
	mysql2: '^3.11.0',
	'@planetscale/database': '^1.19.0',
	postgres: '^3.4.4',
	'@libsql/client': '^0.14.0',

	// TailwindCSS
	tailwindcss: '^4.0.15',
	postcss: '^8.5.3',
	'@tailwindcss/postcss': '^4.0.15',
	clsx: '^2.1.1',
	'tailwind-merge': '^2.5.5',

	// React Query (used by Corsair)
	'@tanstack/react-query': '^5.69.0',
	'@trpc/client': '^11.0.0',
	'@trpc/server': '^11.0.0',
	'@trpc/tanstack-react-query': '^11.0.0',
	'server-only': '^0.0.1',

	// biome
	'@biomejs/biome': '^2.2.5',

	// eslint / prettier
	prettier: '^3.5.3',
	'@eslint/eslintrc': '^3.3.1',
	'prettier-plugin-tailwindcss': '^0.6.11',
	eslint: '^9.23.0',
	'eslint-config-next': '^15.2.3',
	'eslint-plugin-drizzle': '^0.2.3',
	'typescript-eslint': '^8.27.0',

	// Corsair
	'@corsair-ai/core': '^0.1.0',
	'@corsair-ai/cli': '^0.1.0',
	dotenv: '^17.2.3',
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
