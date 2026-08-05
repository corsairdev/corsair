import { OnePasswordItem, OnePasswordVault } from './database';

export const OnePasswordSchema = {
	version: '1.0.0',
	entities: {
		vaults: OnePasswordVault,
		items: OnePasswordItem,
	},
} as const;
