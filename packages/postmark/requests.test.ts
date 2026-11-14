import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Bounces, Email, Server, Templates } from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePostmarkRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePostmarkRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

const sendResult = {
	To: 'receiver@example.com',
	SubmittedAt: '2014-02-17T07:25:01.4178645-05:00',
	MessageID: '0a129aee-e1cd-480d-b08d-4f48548ff48d',
	ErrorCode: 0,
	Message: 'OK',
};

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('email endpoints', () => {
	it('email.send posts the message and wraps the single result', async () => {
		mockedRequest.mockResolvedValue(sendResult);

		const result = await Email.send(ctx, {
			From: 'sender@example.com',
			To: 'receiver@example.com',
			Subject: 'Password Reset',
			TextBody: 'Click here to reset your password.',
			MessageStream: 'outbound',
		});

		expect(sentRequest()).toMatchObject({
			method: 'POST',
			path: '/email',
		});
		expect(result.message.MessageID).toBe(sendResult.MessageID);
		expect(result.message.ErrorCode).toBe(0);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'postmark.email.send',
			{ messageId: sendResult.MessageID, errorCode: 0 },
			'completed',
		);
	});

	it('email.send does not log the recipient address', async () => {
		mockedRequest.mockResolvedValue(sendResult);

		await Email.send(ctx, {
			From: 'sender@example.com',
			To: 'private@example.com',
			TextBody: 'Hi',
		});

		const logged = JSON.stringify(mockedLog.mock.calls.at(-1));
		expect(logged).not.toContain('private@example.com');
	});

	it('email.sendBatch posts a bare array of messages and counts failures', async () => {
		mockedRequest.mockResolvedValue([
			sendResult,
			{ ...sendResult, ErrorCode: 300, Message: 'Invalid address' },
		]);

		const result = await Email.sendBatch(ctx, {
			Messages: [
				{ From: 'a@example.com', To: 'b@example.com', TextBody: 'One' },
				{ From: 'a@example.com', To: 'c@example.com', TextBody: 'Two' },
			],
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/email/batch');
		// The route takes a bare array, not a `{ Messages }` envelope.
		expect(Array.isArray(request?.body)).toBe(true);
		expect(result.results).toHaveLength(2);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'postmark.email.sendBatch',
			{ count: 2, failed: 1 },
			'completed',
		);
	});
});

describe('templates endpoints', () => {
	it('templates.list sends Count and Offset with a capitalised name', async () => {
		mockedRequest.mockResolvedValue({ TotalCount: 0, Templates: [] });

		await Templates.list(ctx, { Count: 10, Offset: 20 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/templates',
			query: { Count: 10, Offset: 20, TemplateType: undefined },
		});
	});

	it('templates.get reads by id or alias', async () => {
		mockedRequest.mockResolvedValue({ TemplateId: 1234, Name: 'Welcome' });

		const result = await Templates.get(ctx, { idOrAlias: 'onboarding-v1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/templates/onboarding-v1',
		});
		expect(result.TemplateId).toBe(1234);
	});

	it('templates.create posts the template body', async () => {
		mockedRequest.mockResolvedValue({ TemplateId: 1234 });

		await Templates.create(ctx, {
			Name: 'Welcome Email',
			Alias: 'onboarding-v1',
			HtmlBody: '<html><body>Hello{{name}}</body></html>',
			Subject: 'Hello, from {{company.name}}',
			TemplateType: 'Standard',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/templates',
			body: {
				Name: 'Welcome Email',
				Alias: 'onboarding-v1',
				HtmlBody: '<html><body>Hello{{name}}</body></html>',
				Subject: 'Hello, from {{company.name}}',
				TemplateType: 'Standard',
			},
		});
	});

	it('templates.update puts only the fields given, without the path id', async () => {
		mockedRequest.mockResolvedValue({ TemplateId: 1234 });

		await Templates.update(ctx, {
			idOrAlias: '1234',
			Subject: 'New subject',
		});

		expect(sentRequest()).toEqual({
			method: 'PUT',
			path: '/templates/1234',
			body: { Subject: 'New subject' },
		});
	});

	it('templates.delete removes by id or alias', async () => {
		mockedRequest.mockResolvedValue({ Message: 'Template 1234 removed.' });

		const result = await Templates.remove(ctx, { idOrAlias: '1234' });

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/templates/1234',
		});
		expect(result.Message).toBe('Template 1234 removed.');
	});

	it('templates.validate posts the bodies and model', async () => {
		mockedRequest.mockResolvedValue({ AllContentIsValid: true });

		const result = await Templates.validate(ctx, {
			HtmlBody: '<b>{{name}}</b>',
			TemplateModel: { name: 'Kevin' },
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/templates/validate');
		expect(result.AllContentIsValid).toBe(true);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'postmark.templates.validate',
			{ valid: true },
			'completed',
		);
	});
});

describe('server endpoints', () => {
	it('server.get reads this server', async () => {
		mockedRequest.mockResolvedValue({ ID: 1234, DeliveryType: 'Live' });

		const result = await Server.get(ctx, {});

		expect(sentRequest()).toEqual({ method: 'GET', path: '/server' });
		expect(result.DeliveryType).toBe('Live');
	});

	it('server.update puts the changed settings', async () => {
		mockedRequest.mockResolvedValue({ ID: 1234, TrackOpens: true });

		await Server.update(ctx, { TrackOpens: true, InboundSpamThreshold: 10 });

		expect(sentRequest()).toEqual({
			method: 'PUT',
			path: '/server',
			body: { TrackOpens: true, InboundSpamThreshold: 10 },
		});
	});
});

describe('streams endpoints', () => {
	it('streams.list pages the message streams', async () => {
		mockedRequest.mockResolvedValue({ MessageStreams: [] });

		await Server.streams(ctx, { MessageStreamType: 'Transactional' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/message-streams',
			query: {
				MessageStreamType: 'Transactional',
				IncludeArchivedStreams: undefined,
			},
		});
	});

	it('streams.get reads one stream', async () => {
		mockedRequest.mockResolvedValue({ ID: 'outbound', Name: 'Outbound' });

		await Server.stream(ctx, { id: 'outbound' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/message-streams/outbound',
		});
	});

	it('streams.archive posts to the archive sub-path', async () => {
		mockedRequest.mockResolvedValue({ Message: 'Stream archived.' });

		const result = await Server.archiveStream(ctx, { id: 'broadcast-1' });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/message-streams/broadcast-1/archive',
		});
		expect(result.Message).toBe('Stream archived.');
	});
});

describe('bounces endpoints', () => {
	it('bounces.list sends the documented lowercase query names', async () => {
		mockedRequest.mockResolvedValue({ TotalCount: 0, Bounces: [] });

		await Bounces.list(ctx, {
			Count: 10,
			Offset: 0,
			Type: 'HardBounce',
			EmailFilter: 'bounce@example.com',
			FromDate: '2024-01-01T00:00:00Z',
		});

		// The query the client will serialise, read field by field below.
		const query = sentRequest()?.query as Record<string, string | number>;
		// The API spells these on the wire without capitals, and `emailFilter`
		// with one, so the mapping is what keeps them right.
		expect(query.count).toBe(10);
		expect(query.offset).toBe(0);
		expect(query.type).toBe('HardBounce');
		expect(query.emailFilter).toBe('bounce@example.com');
		expect(query.fromdate).toBe('2024-01-01T00:00:00Z');
	});

	it('bounces.get reads one bounce', async () => {
		mockedRequest.mockResolvedValue({ ID: 42, Type: 'HardBounce' });

		await Bounces.get(ctx, { id: 42 });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/bounces/42' });
	});

	it('bounces.activate puts to the activate sub-path', async () => {
		mockedRequest.mockResolvedValue({ Message: 'OK', Bounce: { ID: 42 } });

		const result = await Bounces.activate(ctx, { id: 42 });

		expect(sentRequest()).toEqual({
			method: 'PUT',
			path: '/bounces/42/activate',
		});
		expect(result.Message).toBe('OK');
	});

	it('bounces.delivery reads the delivery statistics', async () => {
		mockedRequest.mockResolvedValue({
			InactiveMails: 5,
			Bounces: [{ Type: 'HardBounce', Name: 'Hard bounce', Count: 5 }],
		});

		const result = await Bounces.delivery(ctx, {});

		expect(sentRequest()).toEqual({ method: 'GET', path: '/deliverystats' });
		expect(result.InactiveMails).toBe(5);
	});
});

describe('stats endpoints', () => {
	it('stats.overview sends the lowercase window parameters', async () => {
		mockedRequest.mockResolvedValue({ Outbound: 100, Opens: 50 });

		const result = await Bounces.overview(ctx, {
			Tag: 'welcome',
			FromDate: '2024-01-01',
			ToDate: '2024-01-31',
			MessageStream: 'outbound',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/stats/outbound',
			query: {
				tag: 'welcome',
				fromdate: '2024-01-01',
				todate: '2024-01-31',
				messagestream: 'outbound',
			},
		});
		expect(result.Outbound).toBe(100);
	});

	it('stats.sends reads the daily count series', async () => {
		mockedRequest.mockResolvedValue({
			Days: [{ Date: '2024-01-01', Sent: 10 }],
		});

		const result = await Bounces.sends(ctx, { FromDate: '2024-01-01' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/stats/outbound/sends',
			query: {
				tag: undefined,
				fromdate: '2024-01-01',
				todate: undefined,
				messagestream: undefined,
			},
		});
		expect(result.Days).toHaveLength(1);
	});
});
