import { listWorkspaces } from './endpoints/workspaces';

const apiUrl = process.env.GONG_API_BASE_URL;
const accessKey = process.env.GONG_ACCESS_KEY;
const accessKeySecret = process.env.GONG_ACCESS_KEY_SECRET;
const accessToken = process.env.GONG_ACCESS_TOKEN;
const liveEnabled =
	process.env.LIVE_TEST === '1' &&
	Boolean(apiUrl) &&
	Boolean(accessToken || (accessKey && accessKeySecret));

const ctx = {
	key: accessToken ?? accessKey ?? '',
	options: {
		baseUrl: apiUrl,
		authType: accessToken ? ('oauth_2' as const) : ('api_key' as const),
		accessKey,
		accessKeySecret,
	},
	$getAccountId: async () => 'live-test-account',
};

(liveEnabled ? it : it.skip)(
	'lists workspaces using Gong live credentials',
	async () => {
		const result = await listWorkspaces(ctx, {});
		expect(result.requestId).toEqual(expect.any(String));
		expect(result.workspaces).toEqual(expect.any(Array));
	},
);
