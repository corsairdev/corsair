import { ShortioDomainSchema, ShortioLinkSchema } from '../endpoints/types';

export const ShortioSchema = {
	version: '1.0.0',
	entities: { links: ShortioLinkSchema, domains: ShortioDomainSchema },
} as const;
