import { createCorsairTRPC } from 'corsair';
import { createPlugins } from 'corsair/plugins';
import { config } from '@/corsair.config';

export const plugins = createPlugins(config);

export type DatabaseContext = {
	db: typeof config.db;
	userId?: string;
	plugins: typeof plugins;
};

const t = createCorsairTRPC<DatabaseContext>();
export const { router, procedure } = t;
