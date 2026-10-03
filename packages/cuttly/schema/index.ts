import { CuttlyLinkEntity } from './database';

export const CuttlySchema = {
	version: '1.0.0',
	entities: { links: CuttlyLinkEntity },
} as const;
