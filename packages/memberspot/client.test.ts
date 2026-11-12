import { inspect } from 'node:util';
import { makeMemberSpotRequest } from './client';

// The request layer builds the headers itself, so a key the header check
// refuses fails there with undici's TypeError, which quotes the value. Under
// jest that TypeError comes from another realm and skips the branch under test,
// so the request layer is replaced with one that throws the same message.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(async () => {
			throw new TypeError(
				'Headers.append: "super-secret\nkey" is an invalid header value.',
			);
		}),
	};
});

describe('a key the header layer rejects', () => {
	it('keeps the key out of the transport error message and its cause', async () => {
		const error = await makeMemberSpotRequest(
			'super-secret\nkey',
			'/api-auth',
			// unknown: a rejection can be any value; the assertions name the shape.
		).catch((caught: unknown) => caught);

		expect((error as Error).message).not.toContain('super-secret');
		expect(inspect(error)).not.toContain('super-secret');
		expect(error).toMatchObject({ transport: true });
	});

	it('keeps an ordinary transport message as it was', async () => {
		const error = await makeMemberSpotRequest('', '/api-auth').catch(
			// unknown: a rejection can be any value; the assertion names the shape.
			(caught: unknown) => caught,
		);
		expect((error as Error).message).toContain('invalid header value');
	});
});
