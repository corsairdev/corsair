import type { PrismaOperation } from '../endpoints/operation-types';

export const regionsOperations = [
	{
		key: 'listRegions',
		group: 'regions',
		name: 'list',
		method: 'GET',
		path: '/regions',
		riskLevel: 'read',
		description:
			'List all available regions across products (optionally by product)',
	},
	{
		key: 'listPostgresRegions',
		group: 'regions',
		name: 'listPostgres',
		method: 'GET',
		path: '/regions/postgres',
		riskLevel: 'read',
		description: 'List all available Prisma Postgres regions with availability',
	},
	{
		key: 'listAccelerateRegions',
		group: 'regions',
		name: 'listAccelerate',
		method: 'GET',
		path: '/regions/accelerate',
		riskLevel: 'read',
		description: 'List all available Prisma Accelerate regions',
	},
] as const satisfies readonly PrismaOperation[];
