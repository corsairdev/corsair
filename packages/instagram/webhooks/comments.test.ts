import { comments } from './comments';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

type CommentsContext = Parameters<typeof comments.handler>[0];
type CommentsRequest = Parameters<typeof comments.handler>[1];

const upsertByEntityId = jest.fn();

function createContext(
	authType: 'oauth_2' | 'managed',
	clientSecret = 'app-secret',
): CommentsContext {
	return {
		options: { authType },
		keys: {
			get_integration_credentials: jest
				.fn()
				.mockResolvedValue({ client_secret: clientSecret }),
		},
		db: { comments: { upsertByEntityId } },
	} as unknown as CommentsContext;
}

function createRequest(hubVerified: boolean): CommentsRequest {
	return {
		hubVerified,
		payload: {
			entry: [
				{
					time: 1_700_000_000,
					changes: [
						{
							value: {
								comment_id: 'c1',
								text: 'hi',
								from: { username: 'bob' },
							},
						},
					],
				},
			],
		},
	} as unknown as CommentsRequest;
}

beforeEach(() => {
	upsertByEntityId.mockReset();
});

describe('instagram comments webhook', () => {
	it('processes a Hub-verified managed delivery without local verification', async () => {
		const result = await comments.handler(
			createContext('managed'),
			createRequest(true),
		);

		expect(result).toMatchObject({ success: true, data: { id: 'c1' } });
		expect(upsertByEntityId).toHaveBeenCalled();
	});

	it('still refuses a managed delivery that did not cross the Hub boundary', async () => {
		const result = await comments.handler(
			createContext('managed'),
			createRequest(false),
		);

		expect(result).toMatchObject({ success: false, statusCode: 501 });
		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('still verifies the signature for non-Hub oauth deliveries', async () => {
		const result = await comments.handler(
			createContext('oauth_2'),
			createRequest(false),
		);

		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(upsertByEntityId).not.toHaveBeenCalled();
	});
});
