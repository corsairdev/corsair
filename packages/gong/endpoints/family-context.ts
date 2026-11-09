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
