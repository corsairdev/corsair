import * as client from './client';
import { PostmarkAPIError } from './client';
import { Bounces, Email, Server, Templates } from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePostmarkRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePostmarkRequest);
const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('response parsing', () => {
	it('accepts a field Postmark adds and keeps it on the result', async () => {
		mockedRequest.mockResolvedValue({ ID: 1234, brand_new_field: 'x' });

		const result = await Server.get(ctx, {});

		expect(result).toMatchObject({ brand_new_field: 'x' });
	});

	it('rejects a template list whose Templates is not an array', async () => {
		mockedRequest.mockResolvedValue({ TotalCount: 0, Templates: 'nope' });

		await expect(Templates.list(ctx, {})).rejects.toThrow();
	});

	it('rejects a list that omits TotalCount, which the page loop depends on', async () => {
		mockedRequest.mockResolvedValue({ Templates: [] });

		await expect(Templates.list(ctx, {})).rejects.toThrow();
	});

	it('accepts an empty page, which a fresh server returns', async () => {
		mockedRequest.mockResolvedValue({ TotalCount: 0, Templates: [] });

		const result = await Templates.list(ctx, { Count: 10 });

		expect(result.Templates).toEqual([]);
		expect(result.TotalCount).toBe(0);
	});

	it('keeps a per-message failure code in a batch result', async () => {
		mockedRequest.mockResolvedValue([
			{ To: 'a@example.com', ErrorCode: 0, Message: 'OK', MessageID: 'id-1' },
			{ To: 'b@example.com', ErrorCode: 300, Message: 'Invalid address' },
		]);

		const result = await Email.sendBatch(ctx, {
			Messages: [
				{ From: 's@example.com', To: 'a@example.com', TextBody: 'One' },
				{ From: 's@example.com', To: 'b@example.com', TextBody: 'Two' },
			],
		});

		// The HTTP status is 200 for the whole batch, so the codes are the signal.
		expect(result.results[0]?.ErrorCode).toBe(0);
		expect(result.results[1]?.ErrorCode).toBe(300);
	});

	it('rejects a send result whose ErrorCode is a string', async () => {
		mockedRequest.mockResolvedValue({ ErrorCode: '0', Message: 'OK' });

		await expect(
			Email.send(ctx, {
				From: 's@example.com',
				To: 'a@example.com',
				TextBody: 'Hi',
			}),
		).rejects.toThrow();
	});

	it('accepts a bounce with a null DumpAvailable and no dump', async () => {
		mockedRequest.mockResolvedValue({
			ID: 42,
			Type: 'HardBounce',
			DumpAvailable: null,
			CanActivate: false,
		});

		const result = await Bounces.get(ctx, { id: 42 });

		expect(result.DumpAvailable).toBeNull();
		expect(result.CanActivate).toBe(false);
	});

	it('rejects a stats day whose Date is a number', async () => {
		mockedRequest.mockResolvedValue({ Days: [{ Date: 20240101, Sent: 10 }] });

		await expect(Bounces.sends(ctx, {})).rejects.toThrow();
	});

	it('accepts a stream with an archived timestamp', async () => {
		mockedRequest.mockResolvedValue({
			ID: 'broadcast-1',
			Name: 'Newsletter',
			MessageStreamType: 'Broadcasts',
			ArchivedAt: '2024-06-01T00:00:00Z',
		});

		const result = await Server.stream(ctx, { id: 'broadcast-1' });

		expect(result.ArchivedAt).toBe('2024-06-01T00:00:00Z');
	});
});

describe('input validation before the request', () => {
	it('rejects a send with neither body', async () => {
		await expect(
			Email.send(ctx, {
				From: 's@example.com',
				To: 'a@example.com',
				Subject: 'No body',
			}),
		).rejects.toThrow(/Supply HtmlBody, TextBody, or both/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a send with only a text body', async () => {
		mockedRequest.mockResolvedValue({ ErrorCode: 0, Message: 'OK' });

		await expect(
			Email.send(ctx, {
				From: 's@example.com',
				To: 'a@example.com',
				TextBody: 'Hi',
			}),
		).resolves.toBeDefined();
	});

	it('rejects a batch above the documented 500-message limit', async () => {
		const message = {
			From: 's@example.com',
			To: 'a@example.com',
			TextBody: 'Hi',
		};
		await expect(
			Email.sendBatch(ctx, {
				Messages: Array.from({ length: 501 }, () => message),
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a batch containing a message with no body', async () => {
		await expect(
			Email.sendBatch(ctx, {
				Messages: [{ From: 's@example.com', To: 'a@example.com' }],
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a template with neither body', async () => {
		await expect(Templates.create(ctx, { Name: 'Empty' })).rejects.toThrow(
			/Supply HtmlBody or TextBody/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a template update that changes nothing', async () => {
		await expect(Templates.update(ctx, { idOrAlias: '1234' })).rejects.toThrow(
			/at least one field/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a template update that changes only the subject', async () => {
		mockedRequest.mockResolvedValue({ TemplateId: 1234 });

		await expect(
			Templates.update(ctx, { idOrAlias: '1234', Subject: 'New' }),
		).resolves.toBeDefined();
	});

	it('rejects a server update that changes nothing', async () => {
		await expect(Server.update(ctx, {})).rejects.toThrow(/at least one field/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an inbound spam threshold outside the documented 0 to 30', async () => {
		await expect(
			Server.update(ctx, { InboundSpamThreshold: 31 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a template type outside Standard and Layout', async () => {
		await expect(
			Templates.list(ctx, { TemplateType: 'Partial' as never }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a bounce page above the documented 500', async () => {
		await expect(Bounces.list(ctx, { Count: 501 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces a Postmark rejection as an error a handler can match', async () => {
		mockedRequest.mockRejectedValue(
			new PostmarkAPIError('Postmark 401 code 10: bad token', {
				status: 401,
				errorCode: 10,
				method: 'GET',
				credentialsRejected: true,
			}),
		);

		const error = await captureError(Server.get(ctx, {}));

		expect(error).toBeInstanceOf(PostmarkAPIError);
		expect(error).toMatchObject({ status: 401, errorCode: 10 });
	});
});
