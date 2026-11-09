import type { GongCredentials } from '../client';

export type GongFamilyContext = {
	key: string;
	options: {
		baseUrl?: string;
		authType?: 'api_key' | 'oauth_2';
		accessKey?: string;
		accessKeySecret?: string;
	};
	$getAccountId: () => Promise<string>;
};

export function gongCredentials(ctx: GongFamilyContext): GongCredentials {
	if (ctx.options.authType === 'oauth_2')
		return { type: 'bearer', accessToken: ctx.key };
	if (!ctx.options.accessKeySecret)
		throw new Error('Gong Basic authentication requires an API key secret');
	return {
		type: 'basic',
		accessKey: ctx.key,
		accessKeySecret: ctx.options.accessKeySecret,
	};
}
