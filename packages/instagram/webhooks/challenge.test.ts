import { url_verification } from './challenge';

type ChallengeContext = Parameters<typeof url_verification.handler>[0];
type ChallengeRequest = Parameters<typeof url_verification.handler>[1];

function createContext(webhookVerifyToken: string | undefined) {
	return {
		options: { webhookVerifyToken },
		$getAccountId: jest.fn().mockResolvedValue('account-id'),
	} as unknown as ChallengeContext;
}

function createRequest(verifyToken: string): ChallengeRequest {
	return {
		query: {
			'hub.mode': 'subscribe',
			'hub.verify_token': verifyToken,
			'hub.challenge': 'challenge-value',
		},
		payload: {},
	} as unknown as ChallengeRequest;
}

describe('instagram url_verification', () => {
	it('succeeds when the verify token matches', async () => {
		const result = await url_verification.handler(
			createContext('verify-token'),
			createRequest('verify-token'),
		);

		expect(result).toMatchObject({
			success: true,
			returnToSender: { validationToken: 'challenge-value' },
		});
	});

	it('rejects a same-length token that does not match', async () => {
		const result = await url_verification.handler(
			createContext('verify-token'),
			createRequest('verify-taken'),
		);

		expect(result).toEqual({
			success: false,
			error: 'Invalid verification token',
		});
	});

	it('rejects a length mismatch without throwing', async () => {
		const result = await url_verification.handler(
			createContext('verify-token'),
			createRequest('short'),
		);

		expect(result).toEqual({
			success: false,
			error: 'Invalid verification token',
		});
	});
});
