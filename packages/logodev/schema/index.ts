import { LogoDevBrandEntity, LogoDevImageEntity } from './database';

export const LogoDevSchema = {
	version: '1.0.0',
	entities: {
		brands: LogoDevBrandEntity,
		images: LogoDevImageEntity,
	},
} as const;
