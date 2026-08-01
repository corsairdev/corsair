import type { PluginAuthConfig } from 'corsair/core';

export const cloudinaryAuthConfig = {
	api_key: {
		account: ['api_secret', 'cloud_name'] as const,
	},
} as const satisfies PluginAuthConfig;
