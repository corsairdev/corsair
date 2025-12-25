import type { CorsairConfig } from './index';

export const createCorsair = <Options extends CorsairConfig<any>>(
	options: Options,
): Options => {
	// Validate and return the config with proper typing
	return options;
};

