import type { CorsairDBAdapter } from './db/adapter';
import type { CorsairPlugin } from './plugin';

export type CorsairOptions = {
	db?: CorsairDBAdapter | undefined;
	plugins?: readonly CorsairPlugin[] | undefined;
};
