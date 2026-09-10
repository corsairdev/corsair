import type { RawWebhookRequest } from 'corsair/core';
import { waboxapp } from './index';
import { matchWaboxappTenantWebhook } from './webhooks/tenant-matcher';
import {
	createWaboxappMatch,
	parseWaboxappWebhookBody,
	verifyWaboxappWebhookToken,
} from './webhooks/types';

const MESSAGE_BODY =
	'event=message&token=abcd1234&uid=34666123456' +
	'&contact%5Buid%5D=34666789123&contact%5Bname%5D=Peter&contact%5Btype%5D=user' +
	'&message%5Bdtm%5D=1487082303&message%5Buid%5D=62397B58E3E0B' +
	'&message%5Bdir%5D=i&message%5Btype%5D=chat' +
	'&message%5Bbody%5D%5Btext%5D=Hey%21+How+are+you+doing%3F&message%5Back%5D=3';

const ACK_BODY =
	'event=ack&token=abcd1234&uid=34666123456&muid=62397B58E3E0B&ack=3';

const formRequest = (body: string): RawWebhookRequest => ({
	headers: { 'content-type': 'application/x-www-form-urlencoded' },
	body,
});

describe('parseWaboxappWebhookBody', () => {
	it('parses a form-encoded message and nests bracket keys', () => {
		const parsed = parseWaboxappWebhookBody(MESSAGE_BODY);
		expect(parsed).not.toBeNull();
		expect(parsed?.event).toBe('message');
		expect(parsed?.token).toBe('abcd1234');
		expect(parsed?.uid).toBe('34666123456');
		const contact = parsed?.contact as Record<string, unknown>;
		expect(contact.uid).toBe('34666789123');
		expect(contact.name).toBe('Peter');
		const message = parsed?.message as Record<string, unknown>;
		expect(message.uid).toBe('62397B58E3E0B');
		expect(message.type).toBe('chat');
		expect((message.body as Record<string, unknown>).text).toBe(
			'Hey! How are you doing?',
		);
	});

	it('accepts an already nested object', () => {
		const parsed = parseWaboxappWebhookBody({
			event: 'ack',
			token: 't',
			uid: '1',
		});
		expect(parsed?.event).toBe('ack');
	});

	it('nests flat bracket keys on an already-parsed object', () => {
		const parsed = parseWaboxappWebhookBody({
			event: 'message',
			token: 't',
			uid: '1',
			'contact[uid]': '2',
		});
		expect((parsed?.contact as Record<string, unknown>).uid).toBe('2');
	});

	it('returns null for empty or non-object bodies', () => {
		expect(parseWaboxappWebhookBody('')).toBeNull();
		expect(parseWaboxappWebhookBody(null)).toBeNull();
		expect(parseWaboxappWebhookBody(42)).toBeNull();
	});
});

describe('createWaboxappMatch', () => {
	it('matches message events and rejects ack', () => {
		expect(createWaboxappMatch('message')(formRequest(MESSAGE_BODY))).toBe(
			true,
		);
		expect(createWaboxappMatch('ack')(formRequest(MESSAGE_BODY))).toBe(false);
		expect(createWaboxappMatch('ack')(formRequest(ACK_BODY))).toBe(true);
	});
});

describe('pluginWebhookMatcher', () => {
	const matcher = waboxapp().pluginWebhookMatcher!;

	it('accepts waboxapp message and ack payloads', () => {
		expect(matcher(formRequest(MESSAGE_BODY))).toBe(true);
		expect(matcher(formRequest(ACK_BODY))).toBe(true);
	});

	it('rejects a generic event field without uid and token', () => {
		expect(matcher(formRequest('event=push&ref=main'))).toBe(false);
	});
});

describe('matchWaboxappTenantWebhook', () => {
	it('routes by account uid, not the API token', () => {
		expect(matchWaboxappTenantWebhook(formRequest(MESSAGE_BODY))).toEqual({
			linkType: 'uid',
			externalId: '34666123456',
		});
	});
});

describe('verifyWaboxappWebhookToken', () => {
	it('accepts a token that matches the stored secret', () => {
		expect(
			verifyWaboxappWebhookToken(
				{ payload: { token: 'abcd1234' } },
				'abcd1234',
			),
		).toEqual({ valid: true });
	});

	it('rejects a mismatched token', () => {
		const result = verifyWaboxappWebhookToken(
			{ payload: { token: 'nope' } },
			'abcd1234',
		);
		expect(result.valid).toBe(false);
	});
});
