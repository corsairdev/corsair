import { Ip2proxyCheckEntity } from './database';

export const Ip2proxySchema = {
	version: '1.0.0',
	entities: {
		checks: Ip2proxyCheckEntity,
	},
} as const;
