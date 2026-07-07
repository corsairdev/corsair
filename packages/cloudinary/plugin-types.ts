import type { CorsairPluginContext, PickAuth } from 'corsair/core';
import { cloudinaryAuthConfig } from './auth-config';
import { CloudinarySchema } from './schema';

export type CloudinaryPluginOptionsBase = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiSecret?: string;
	cloudName?: string;
	webhookSecret?: string;
};

export type CloudinaryContext<
	Options extends CloudinaryPluginOptionsBase = CloudinaryPluginOptionsBase,
> = CorsairPluginContext<
	typeof CloudinarySchema,
	Options,
	undefined,
	typeof cloudinaryAuthConfig
> & {
	cloudName?: string;
};

export { cloudinaryAuthConfig };
