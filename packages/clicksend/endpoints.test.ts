import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { ClickSendBoundEndpoints } from './index';
import { clicksend } from './index';

const USERNAME = 'testuser';
const API_KEY = 'test-api-key';

const fetchSpy = jest.spyOn(globalThis, 'fetch');

// unknown justification: envelope fixtures stand in for arbitrary provider
// payloads; they travel through the real client parser, never inspected here.
function envelope(data: unknown): Response {
	return new Response(
		JSON.stringify({
			http_code: 200,
			response_code: 'SUCCESS',
			response_msg: 'ok',
			data,
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		},
	);
}

function lastRequest(): {
	url: string;
	method: string | undefined;
	// unknown justification: captured request bodies are opaque JSON; tests
	// only compare them with toEqual, never narrowing the value.
	body: unknown;
} {
	const calls = fetchSpy.mock.calls;
	const call = calls[calls.length - 1];
	if (!call) {
		throw new Error('expected an HTTP call');
	}
	const [input, init] = call;
	const rawBody = init?.body;
	// typeof-guard justification: fetch BodyInit is a union type; this client
	// only ever sends string bodies, so other variants need no handling here.
	// unknown justification: JSON.parse returns an untyped value by design; it
	// is annotated as unknown (never any) and only consumed via toEqual below.
	const parsedBody: unknown =
		typeof rawBody === 'string' && rawBody.length > 0
			? JSON.parse(rawBody)
			: undefined;
	return { url: String(input), method: init?.method, body: parsedBody };
}

type EndpointCase = {
	name: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	// unknown justification: each case carries its endpoint's mock provider
	// payload; the shape differs per endpoint and is validated by the real
	// client parser when the case runs.
	data: unknown;
	run: (api: ClickSendBoundEndpoints) => Promise<void>;
};

const CONTACT = {
	contact_id: 501,
	list_id: 101,
	phone_number: '+1234567890',
	first_name: 'Alice',
};

const cases: EndpointCase[] = [
	{
		name: 'account.get',
		method: 'GET',
		path: 'account',
		data: {
			user_id: 1,
			username: USERNAME,
			user_email: 'test@example.com',
			balance: 25.5,
			currency: 'USD',
		},
		run: async (api) => {
			const res = await api.account.get({});
			expect(res.username).toBe(USERNAME);
			expect(res.balance).toBe(25.5);
		},
	},
	{
		name: 'account.update',
		method: 'PUT',
		path: 'account',
		data: { user_id: 1, username: USERNAME, balance: 25.5 },
		run: async (api) => {
			const res = await api.account.update({ user_first_name: 'Ada' });
			expect(res.username).toBe(USERNAME);
			const req = lastRequest();
			expect(req.body).toMatchObject({ user_first_name: 'Ada' });
		},
	},
	{
		name: 'sms.send',
		method: 'POST',
		path: 'sms/send',
		data: {
			total_price: 0.05,
			total_count: 1,
			queued_count: 1,
			messages: [
				{
					to: '+1234567890',
					body: 'Hello',
					message_id: 'MSG-1',
					status: 'SUCCESS',
				},
			],
		},
		run: async (api) => {
			const res = await api.sms.send({
				messages: [{ to: '+1234567890', body: 'Hello' }],
			});
			expect(res.messages.length).toBe(1);
			expect(res.messages[0]?.message_id).toBe('MSG-1');
			const req = lastRequest();
			expect(req.body).toMatchObject({
				messages: [{ to: '+1234567890', body: 'Hello' }],
			});
		},
	},
	{
		name: 'sms.history',
		method: 'GET',
		path: 'sms/history',
		data: { current_page: 1, per_page: 15, total: 0, last_page: 1, data: [] },
		run: async (api) => {
			const res = await api.sms.history({ page: 1, limit: 15 });
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'sms.inbound',
		method: 'GET',
		path: 'sms/inbound',
		data: {
			current_page: 1,
			per_page: 15,
			total: 1,
			last_page: 1,
			data: [{ message_id: 'IN-1', to: '+1', from: '+2', body: 'reply' }],
		},
		run: async (api) => {
			const res = await api.sms.inbound({});
			expect(res.data[0]?.message_id).toBe('IN-1');
		},
	},
	{
		name: 'sms.receipts',
		method: 'GET',
		path: 'sms/receipts',
		data: {
			current_page: 1,
			per_page: 15,
			total: 1,
			last_page: 1,
			data: [{ message_id: 'MSG-1', status: 'Delivered' }],
		},
		run: async (api) => {
			const res = await api.sms.receipts({});
			expect(res.data[0]?.status).toBe('Delivered');
		},
	},
	{
		name: 'sms.price',
		method: 'POST',
		path: 'sms/price',
		data: { total_price: 0.05, total_count: 1, messages: [] },
		run: async (api) => {
			const res = await api.sms.price({
				messages: [{ to: '+1234567890', body: 'Hello' }],
			});
			expect(res.total_count).toBe(1);
		},
	},
	{
		name: 'sms.historyExport',
		method: 'GET',
		path: 'sms/history/export',
		data: { url: 'https://example.com/sms.csv' },
		run: async (api) => {
			const res = await api.sms.historyExport({ filename: 'sms.csv' });
			expect(res.url).toBe('https://example.com/sms.csv');
		},
	},
	{
		name: 'sms.receiptGet',
		method: 'GET',
		path: 'sms/receipts/MSG-1',
		data: { message_id: 'MSG-1', status: 'Delivered' },
		run: async (api) => {
			const res = await api.sms.receiptGet({ message_id: 'MSG-1' });
			expect(res.message_id).toBe('MSG-1');
		},
	},
	{
		name: 'sms.receiptCreateTest',
		method: 'POST',
		path: 'sms/receipts',
		data: { message_id: 'MSG-1', status: 'Delivered' },
		run: async (api) => {
			const res = await api.sms.receiptCreateTest({ url: 'poll' });
			expect(res.message_id).toBe('MSG-1');
			const req = lastRequest();
			expect(req.body).toMatchObject({ url: 'poll' });
		},
	},
	{
		name: 'sms.receiptsMarkRead',
		method: 'PUT',
		path: 'sms/receipts-read',
		data: [],
		run: async (api) => {
			const res = await api.sms.receiptsMarkRead({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'sms.inboundCreateTest',
		method: 'POST',
		path: 'sms/inbound',
		data: { message_id: 'IN-2', to: '+1', from: '+2', body: 'test' },
		run: async (api) => {
			const res = await api.sms.inboundCreateTest({
				to: '+1',
				from: '+2',
				body: 'test',
			});
			expect(res.message_id).toBe('IN-2');
		},
	},
	{
		name: 'sms.inboundMarkRead',
		method: 'PUT',
		path: 'sms/inbound-read',
		data: [],
		run: async (api) => {
			const res = await api.sms.inboundMarkRead({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'sms.inboundMarkReadOne',
		method: 'PUT',
		path: 'sms/inbound-read/IN-1',
		data: [],
		run: async (api) => {
			const res = await api.sms.inboundMarkReadOne({ message_id: 'IN-1' });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'sms.cancel',
		method: 'PUT',
		path: 'sms/MSG-1/cancel',
		data: {
			to: '+1234567890',
			body: 'Hello',
			message_id: 'MSG-1',
			status: 'Cancelled',
		},
		run: async (api) => {
			const res = await api.sms.cancel({ message_id: 'MSG-1' });
			expect(res.status).toBe('Cancelled');
		},
	},
	{
		name: 'sms.cancelAll',
		method: 'PUT',
		path: 'sms/cancel-all',
		data: { count: 3 },
		run: async (api) => {
			const res = await api.sms.cancelAll({});
			expect(res.count).toBe(3);
		},
	},
	{
		name: 'sms.statistics',
		method: 'GET',
		path: 'statistics/sms',
		data: { total: { outbound: { count: 10, price: 0.5 } } },
		run: async (api) => {
			const res = await api.sms.statistics({});
			expect(res).toBeDefined();
		},
	},
	{
		name: 'smsTemplates.create',
		method: 'POST',
		path: 'sms/templates',
		data: { template_id: 1, template_name: 'Welcome', body: 'Hi!' },
		run: async (api) => {
			const res = await api.smsTemplates.create({
				template_name: 'Welcome',
				body: 'Hi!',
			});
			expect(res.template_id).toBe(1);
		},
	},
	{
		name: 'smsTemplates.list',
		method: 'GET',
		path: 'sms/templates',
		data: { data: [] },
		run: async (api) => {
			const res = await api.smsTemplates.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'smsTemplates.get',
		method: 'GET',
		path: 'sms/templates/1',
		data: { template_id: 1, template_name: 'Welcome', body: 'Hi!' },
		run: async (api) => {
			const res = await api.smsTemplates.get({ template_id: 1 });
			expect(res.template_name).toBe('Welcome');
		},
	},
	{
		name: 'smsTemplates.update',
		method: 'PUT',
		path: 'sms/templates/1',
		data: { template_id: 1, template_name: 'Welcome', body: 'Hi!!' },
		run: async (api) => {
			const res = await api.smsTemplates.update({
				template_id: 1,
				body: 'Hi!!',
			});
			expect(res.body).toBe('Hi!!');
		},
	},
	{
		name: 'smsTemplates.delete',
		method: 'DELETE',
		path: 'sms/templates/1',
		data: [],
		run: async (api) => {
			const res = await api.smsTemplates.delete({ template_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'smsStrippedStrings.list',
		method: 'GET',
		path: 'sms/email-sms-stripped-strings',
		data: { data: [] },
		run: async (api) => {
			const res = await api.smsStrippedStrings.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'smsStrippedStrings.get',
		method: 'GET',
		path: 'sms/email-sms-stripped-strings/1',
		data: { rule_id: 1, strip_string: 'Sent from' },
		run: async (api) => {
			const res = await api.smsStrippedStrings.get({ rule_id: 1 });
			expect(res.rule_id).toBe(1);
		},
	},
	{
		name: 'smsStrippedStrings.create',
		method: 'POST',
		path: 'sms/email-sms-stripped-strings',
		data: { rule_id: 2, strip_string: 'Sent from' },
		run: async (api) => {
			const res = await api.smsStrippedStrings.create({
				strip_string: 'Sent from',
			});
			expect(res.rule_id).toBe(2);
		},
	},
	{
		name: 'smsStrippedStrings.update',
		method: 'PUT',
		path: 'sms/email-sms-stripped-strings/1',
		data: { rule_id: 1, strip_string: 'Sent from my iPhone' },
		run: async (api) => {
			const res = await api.smsStrippedStrings.update({
				rule_id: 1,
				strip_string: 'Sent from my iPhone',
			});
			expect(res.strip_string).toBe('Sent from my iPhone');
		},
	},
	{
		name: 'smsStrippedStrings.delete',
		method: 'DELETE',
		path: 'sms/email-sms-stripped-strings/1',
		data: [],
		run: async (api) => {
			const res = await api.smsStrippedStrings.delete({ rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'smsEmailSms.create',
		method: 'POST',
		path: 'sms/email-sms',
		data: { email_address_id: 1, email_address: 'a@example.com' },
		run: async (api) => {
			const res = await api.smsEmailSms.create({
				email_address: 'a@example.com',
			});
			expect(res.email_address_id).toBe(1);
		},
	},
	{
		name: 'smsEmailSms.list',
		method: 'GET',
		path: 'sms/email-sms',
		data: { data: [] },
		run: async (api) => {
			const res = await api.smsEmailSms.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'voice.send',
		method: 'POST',
		path: 'voice/send',
		data: {
			messages: [{ to: '+1', body: 'Hi', message_id: 'V-1', status: 'ok' }],
		},
		run: async (api) => {
			const res = await api.voice.send({
				messages: [{ to: '+1', body: 'Hi' }],
			});
			expect(res.messages[0]?.message_id).toBe('V-1');
		},
	},
	{
		name: 'voice.history',
		method: 'GET',
		path: 'voice/history',
		data: { data: [] },
		run: async (api) => {
			const res = await api.voice.history({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'voice.cancelAll',
		method: 'PUT',
		path: 'voice/cancel-all',
		data: { count: 1 },
		run: async (api) => {
			const res = await api.voice.cancelAll({});
			expect(res.count).toBe(1);
		},
	},
	{
		name: 'voice.historyExport',
		method: 'GET',
		path: 'voice/history/export',
		data: { url: 'https://example.com/voice.csv' },
		run: async (api) => {
			const res = await api.voice.historyExport({});
			expect(res.url).toBe('https://example.com/voice.csv');
		},
	},
	{
		name: 'voice.languages',
		method: 'GET',
		path: 'voice/lang',
		data: [{ code: 'en-us', country: 'US', gender: 'female' }],
		run: async (api) => {
			const res = await api.voice.languages({});
			expect(res[0]?.code).toBe('en-us');
		},
	},
	{
		name: 'voice.statistics',
		method: 'GET',
		path: 'statistics/voice',
		data: { total: { outbound: { count: 2, price: 0.2 } } },
		run: async (api) => {
			const res = await api.voice.statistics({});
			expect(res).toBeDefined();
		},
	},
	{
		name: 'voice.receiptsMarkRead',
		method: 'PUT',
		path: 'voice/receipts-read',
		data: [],
		run: async (api) => {
			const res = await api.voice.receiptsMarkRead({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'mms.send',
		method: 'POST',
		path: 'mms/send',
		data: {
			messages: [{ to: '+1', message_id: 'MMS-1', status: 'SUCCESS' }],
		},
		run: async (api) => {
			const res = await api.mms.send({
				media_file: 'https://example.com/img.jpg',
				messages: [{ to: '+1', body: 'pic', subject: 'Hi', from: 'Me' }],
			});
			expect(res.messages[0]?.message_id).toBe('MMS-1');
		},
	},
	{
		name: 'mms.price',
		method: 'POST',
		path: 'mms/price',
		data: { total_price: 0.1, messages: [] },
		run: async (api) => {
			const res = await api.mms.price({
				media_file: 'https://example.com/img.jpg',
				messages: [{ to: '+1', body: 'pic', subject: 'Hi', from: 'Me' }],
			});
			expect(res.total_price).toBe(0.1);
		},
	},
	{
		name: 'mms.history',
		method: 'GET',
		path: 'mms/history',
		data: { data: [] },
		run: async (api) => {
			const res = await api.mms.history({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'mms.historyExport',
		method: 'GET',
		path: 'mms/history/export',
		data: { url: 'https://example.com/mms.csv' },
		run: async (api) => {
			const res = await api.mms.historyExport({});
			expect(res.url).toBe('https://example.com/mms.csv');
		},
	},
	{
		name: 'mms.receipts',
		method: 'GET',
		path: 'mms/receipts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.mms.receipts({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'mms.receiptsMarkRead',
		method: 'PUT',
		path: 'mms/receipts-read',
		data: [],
		run: async (api) => {
			const res = await api.mms.receiptsMarkRead({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'campaigns.sms.price',
		method: 'POST',
		path: 'sms-campaigns/price',
		data: { total_price: 1.5, total_count: 10 },
		run: async (api) => {
			const res = await api.campaigns.sms.price({
				list_id: 101,
				name: 'Promo',
				body: 'Sale!',
				from: 'Shop',
			});
			expect(res.total_price).toBe(1.5);
		},
	},
	{
		name: 'campaigns.sms.send',
		method: 'POST',
		path: 'sms-campaigns/send',
		data: { total_count: 10, queued_count: 10 },
		run: async (api) => {
			const res = await api.campaigns.sms.send({
				list_id: 101,
				name: 'Promo',
				body: 'Sale!',
				from: 'Shop',
				senders: [{ country: 'AU', sender: 'Shop' }],
			});
			expect(res.total_count).toBe(10);
		},
	},
	{
		name: 'campaigns.sms.list',
		method: 'GET',
		path: 'sms-campaigns',
		data: { data: [] },
		run: async (api) => {
			const res = await api.campaigns.sms.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'campaigns.sms.get',
		method: 'GET',
		path: 'sms-campaigns/5',
		data: { sms_campaign_id: 5, name: 'Promo', status: 'Sent' },
		run: async (api) => {
			const res = await api.campaigns.sms.get({ sms_campaign_id: 5 });
			expect(res.name).toBe('Promo');
		},
	},
	{
		name: 'campaigns.sms.update',
		method: 'PUT',
		path: 'sms-campaigns/5',
		data: { sms_campaign_id: 5, name: 'Promo v2' },
		run: async (api) => {
			const res = await api.campaigns.sms.update({
				sms_campaign_id: 5,
				list_id: 101,
				name: 'Promo v2',
				body: 'Sale!',
				from: 'Shop',
			});
			expect(res.name).toBe('Promo v2');
		},
	},
	{
		name: 'campaigns.sms.cancel',
		method: 'PUT',
		path: 'sms-campaigns/5/cancel',
		data: { sms_campaign_id: 5, status: 'Cancelled' },
		run: async (api) => {
			const res = await api.campaigns.sms.cancel({ sms_campaign_id: 5 });
			expect(res).toMatchObject({ status: 'Cancelled' });
		},
	},
	{
		name: 'campaigns.mms.list',
		method: 'GET',
		path: 'mms-campaigns',
		data: { data: [] },
		run: async (api) => {
			const res = await api.campaigns.mms.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'campaigns.mms.send',
		method: 'POST',
		path: 'mms-campaigns/send',
		data: { name: 'MMS Promo', status: 'Queued' },
		run: async (api) => {
			const res = await api.campaigns.mms.send({
				list_id: 101,
				name: 'MMS Promo',
				body: 'Look!',
				from: 'Shop',
				subject: 'Hi',
				media_file: 'https://example.com/img.jpg',
			});
			expect(res.name).toBe('MMS Promo');
		},
	},
	{
		name: 'campaigns.mms.price',
		method: 'POST',
		path: 'mms-campaigns/price',
		data: { total_price: 2.5, total_count: 10 },
		run: async (api) => {
			const res = await api.campaigns.mms.price({
				list_id: 101,
				name: 'MMS Promo',
				body: 'Look!',
				from: 'Shop',
				subject: 'Hi',
				media_file: 'https://example.com/img.jpg',
			});
			expect(res.total_price).toBe(2.5);
		},
	},
	{
		name: 'campaigns.mms.update',
		method: 'PUT',
		path: 'mms-campaigns/7',
		data: { mms_campaign_id: 7, name: 'MMS Promo v2' },
		run: async (api) => {
			const res = await api.campaigns.mms.update({
				mms_campaign_id: 7,
				name: 'MMS Promo v2',
			});
			expect(res.name).toBe('MMS Promo v2');
		},
	},
	{
		name: 'campaigns.mms.cancel',
		method: 'PUT',
		path: 'mms-campaigns/7/cancel',
		data: { mms_campaign_id: 7, status: 'Cancelled' },
		run: async (api) => {
			const res = await api.campaigns.mms.cancel({ mms_campaign_id: 7 });
			expect(res).toMatchObject({ status: 'Cancelled' });
		},
	},
	{
		name: 'emailAddresses.create',
		method: 'POST',
		path: 'email/addresses',
		data: { email_address_id: 1, email_address: 'a@example.com', verified: 0 },
		run: async (api) => {
			const res = await api.emailAddresses.create({
				email_address: 'a@example.com',
			});
			expect(res.email_address_id).toBe(1);
		},
	},
	{
		name: 'emailAddresses.list',
		method: 'GET',
		path: 'email/addresses',
		data: { data: [] },
		run: async (api) => {
			const res = await api.emailAddresses.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'emailAddresses.get',
		method: 'GET',
		path: 'email/addresses/1',
		data: { email_address_id: 1, email_address: 'a@example.com' },
		run: async (api) => {
			const res = await api.emailAddresses.get({ email_address_id: 1 });
			expect(res.email_address).toBe('a@example.com');
		},
	},
	{
		name: 'emailAddresses.delete',
		method: 'DELETE',
		path: 'email/addresses/1',
		data: [],
		run: async (api) => {
			const res = await api.emailAddresses.delete({ email_address_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'emailAddresses.sendToken',
		method: 'PUT',
		path: 'email/address-verify/1/send',
		data: [],
		run: async (api) => {
			const res = await api.emailAddresses.sendToken({ email_address_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'emailAddresses.verify',
		method: 'PUT',
		path: 'email/address-verify/1/verify/tok-1',
		data: { email_address_id: 1, verified: 1 },
		run: async (api) => {
			const res = await api.emailAddresses.verify({
				email_address_id: 1,
				activation_token: 'tok-1',
			});
			expect(res.verified).toBe(1);
		},
	},
	{
		name: 'emailTemplates.list',
		method: 'GET',
		path: 'email/templates',
		data: { data: [] },
		run: async (api) => {
			const res = await api.emailTemplates.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'emailTemplates.get',
		method: 'GET',
		path: 'email/templates/1',
		data: { template_id: 1, template_name: 'T' },
		run: async (api) => {
			const res = await api.emailTemplates.get({ template_id: 1 });
			expect(res.template_id).toBe(1);
		},
	},
	{
		name: 'emailTemplates.create',
		method: 'POST',
		path: 'email/templates',
		data: { template_id: 2, template_id_master: 9, template_name: 'Mine' },
		run: async (api) => {
			const res = await api.emailTemplates.create({
				template_id_master: 9,
				template_name: 'Mine',
			});
			expect(res.template_id_master).toBe(9);
		},
	},
	{
		name: 'emailTemplates.update',
		method: 'PUT',
		path: 'email/templates/2',
		data: { template_id: 2, body: '<p>Hi</p>' },
		run: async (api) => {
			const res = await api.emailTemplates.update({
				template_id: 2,
				body: '<p>Hi</p>',
			});
			expect(res.body).toBe('<p>Hi</p>');
		},
	},
	{
		name: 'emailTemplates.delete',
		method: 'DELETE',
		path: 'email/templates/2',
		data: [],
		run: async (api) => {
			const res = await api.emailTemplates.delete({ template_id: 2 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'emailMasterTemplates.list',
		method: 'GET',
		path: 'email/master-templates',
		data: { data: [] },
		run: async (api) => {
			const res = await api.emailMasterTemplates.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'emailMasterTemplates.get',
		method: 'GET',
		path: 'email/master-templates/9',
		data: { template_id_master: 9, template_name: 'Master' },
		run: async (api) => {
			const res = await api.emailMasterTemplates.get({ template_id: 9 });
			expect(res.template_id_master).toBe(9);
		},
	},
	{
		name: 'emailMasterTemplates.listInCategory',
		method: 'GET',
		path: 'email/master-templates-categories/3/master-templates',
		data: { data: [] },
		run: async (api) => {
			const res = await api.emailMasterTemplates.listInCategory({
				category_id: 3,
			});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'emailMasterCategories.list',
		method: 'GET',
		path: 'email/master-templates-categories',
		data: [],
		run: async (api) => {
			const res = await api.emailMasterCategories.list({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'emailMasterCategories.get',
		method: 'GET',
		path: 'email/master-templates-categories/3',
		data: { category_id: 3, name: 'Retail' },
		run: async (api) => {
			const res = await api.emailMasterCategories.get({ category_id: 3 });
			expect(res.name).toBe('Retail');
		},
	},
	{
		name: 'emailReceiptRules.list',
		method: 'GET',
		path: 'automations/email/receipts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.emailReceiptRules.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'emailReceiptRules.create',
		method: 'POST',
		path: 'automations/email/receipts',
		data: { receipt_rule_id: 1, rule_name: 'R' },
		run: async (api) => {
			const res = await api.emailReceiptRules.create({
				rule_name: 'R',
				match_type: 0,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.receipt_rule_id).toBe(1);
		},
	},
	{
		name: 'emailReceiptRules.get',
		method: 'GET',
		path: 'automations/email/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'R' },
		run: async (api) => {
			const res = await api.emailReceiptRules.get({ receipt_rule_id: 1 });
			expect(res.rule_name).toBe('R');
		},
	},
	{
		name: 'emailReceiptRules.update',
		method: 'PUT',
		path: 'automations/email/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'R2' },
		run: async (api) => {
			const res = await api.emailReceiptRules.update({
				receipt_rule_id: 1,
				rule_name: 'R2',
				match_type: 0,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.rule_name).toBe('R2');
		},
	},
	{
		name: 'emailReceiptRules.delete',
		method: 'DELETE',
		path: 'automations/email/receipts/1',
		data: [],
		run: async (api) => {
			const res = await api.emailReceiptRules.delete({ receipt_rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'emailCampaigns.get',
		method: 'GET',
		path: 'email-campaigns/4',
		data: { email_campaign_id: 4, name: 'Newsletter', status: 'Sent' },
		run: async (api) => {
			const res = await api.emailCampaigns.get({ email_campaign_id: 4 });
			expect(res.name).toBe('Newsletter');
		},
	},
	{
		name: 'faxReceipts.createTest',
		method: 'POST',
		path: 'fax/receipts',
		data: { message_id: 'FAX-1', status: 'Sent' },
		run: async (api) => {
			const res = await api.faxReceipts.createTest({ url: 'poll' });
			expect(res.message_id).toBe('FAX-1');
		},
	},
	{
		name: 'faxReceipts.list',
		method: 'GET',
		path: 'fax/receipts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.faxReceipts.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'faxReceipts.get',
		method: 'GET',
		path: 'fax/receipts/FAX-1',
		data: { message_id: 'FAX-1', status: 'Delivered' },
		run: async (api) => {
			const res = await api.faxReceipts.get({ message_id: 'FAX-1' });
			expect(res.status).toBe('Delivered');
		},
	},
	{
		name: 'faxReceipts.markRead',
		method: 'PUT',
		path: 'fax/receipts-read',
		data: [],
		run: async (api) => {
			const res = await api.faxReceipts.markRead({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'faxReceiptRules.list',
		method: 'GET',
		path: 'automations/fax/receipts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.faxReceiptRules.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'faxReceiptRules.create',
		method: 'POST',
		path: 'automations/fax/receipts',
		data: { receipt_rule_id: 1, rule_name: 'FR' },
		run: async (api) => {
			const res = await api.faxReceiptRules.create({
				rule_name: 'FR',
				match_type: 0,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.receipt_rule_id).toBe(1);
		},
	},
	{
		name: 'faxReceiptRules.get',
		method: 'GET',
		path: 'automations/fax/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'FR' },
		run: async (api) => {
			const res = await api.faxReceiptRules.get({ receipt_rule_id: 1 });
			expect(res.rule_name).toBe('FR');
		},
	},
	{
		name: 'faxReceiptRules.update',
		method: 'PUT',
		path: 'automations/fax/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'FR2' },
		run: async (api) => {
			const res = await api.faxReceiptRules.update({
				receipt_rule_id: 1,
				rule_name: 'FR2',
				match_type: 0,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.rule_name).toBe('FR2');
		},
	},
	{
		name: 'faxReceiptRules.delete',
		method: 'DELETE',
		path: 'automations/fax/receipts/1',
		data: [],
		run: async (api) => {
			const res = await api.faxReceiptRules.delete({ receipt_rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'faxInboundRules.list',
		method: 'GET',
		path: 'automations/fax/inbound',
		data: { data: [] },
		run: async (api) => {
			const res = await api.faxInboundRules.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'faxInboundRules.create',
		method: 'POST',
		path: 'automations/fax/inbound',
		data: { inbound_rule_id: 1, rule_name: 'FI' },
		run: async (api) => {
			const res = await api.faxInboundRules.create({
				dedicated_number: '*',
				rule_name: 'FI',
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.inbound_rule_id).toBe(1);
		},
	},
	{
		name: 'faxInboundRules.get',
		method: 'GET',
		path: 'automations/fax/inbound/1',
		data: { inbound_rule_id: 1, rule_name: 'FI' },
		run: async (api) => {
			const res = await api.faxInboundRules.get({ inbound_rule_id: 1 });
			expect(res.rule_name).toBe('FI');
		},
	},
	{
		name: 'faxInboundRules.update',
		method: 'PUT',
		path: 'automations/fax/inbound/1',
		data: { inbound_rule_id: 1, rule_name: 'FI2' },
		run: async (api) => {
			const res = await api.faxInboundRules.update({
				inbound_rule_id: 1,
				dedicated_number: '*',
				rule_name: 'FI2',
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.rule_name).toBe('FI2');
		},
	},
	{
		name: 'faxInboundRules.delete',
		method: 'DELETE',
		path: 'automations/fax/inbound/1',
		data: [],
		run: async (api) => {
			const res = await api.faxInboundRules.delete({ inbound_rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'contactLists.getAll',
		method: 'GET',
		path: 'lists',
		data: { data: [{ list_id: 101, list_name: 'VIP' }] },
		run: async (api) => {
			const res = await api.contactLists.getAll({});
			expect(res.data[0]?.list_id).toBe(101);
		},
	},
	{
		name: 'contactLists.create',
		method: 'POST',
		path: 'lists',
		data: { list_id: 102, list_name: 'New' },
		run: async (api) => {
			const res = await api.contactLists.create({ list_name: 'New' });
			expect(res.list_id).toBe(102);
			const req = lastRequest();
			expect(req.body).toMatchObject({ list_name: 'New' });
		},
	},
	{
		name: 'contactLists.update',
		method: 'PUT',
		path: 'lists/101',
		data: { list_id: 101, list_name: 'VIP v2' },
		run: async (api) => {
			const res = await api.contactLists.update({
				list_id: 101,
				list_name: 'VIP v2',
			});
			expect(res.list_name).toBe('VIP v2');
		},
	},
	{
		name: 'contactLists.delete',
		method: 'DELETE',
		path: 'lists/101',
		data: [],
		run: async (api) => {
			const res = await api.contactLists.delete({ list_id: 101 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'contactLists.get',
		method: 'GET',
		path: 'lists/101',
		data: { list_id: 101, list_name: 'VIP' },
		run: async (api) => {
			const res = await api.contactLists.get({ list_id: 101 });
			expect(res.list_name).toBe('VIP');
		},
	},
	{
		name: 'contacts.create',
		method: 'POST',
		path: 'lists/101/contacts',
		data: CONTACT,
		run: async (api) => {
			const res = await api.contacts.create({
				list_id: 101,
				phone_number: '+1234567890',
				first_name: 'Alice',
			});
			expect(res.contact_id).toBe(501);
		},
	},
	{
		name: 'contacts.list',
		method: 'GET',
		path: 'lists/101/contacts',
		data: { data: [CONTACT] },
		run: async (api) => {
			const res = await api.contacts.list({ list_id: 101 });
			expect(res.data[0]?.contact_id).toBe(501);
		},
	},
	{
		name: 'contacts.get',
		method: 'GET',
		path: 'lists/101/contacts/501',
		data: CONTACT,
		run: async (api) => {
			const res = await api.contacts.get({ list_id: 101, contact_id: 501 });
			expect(res.phone_number).toBe('+1234567890');
		},
	},
	{
		name: 'contacts.update',
		method: 'PUT',
		path: 'lists/101/contacts/501',
		data: { ...CONTACT, first_name: 'Alicia' },
		run: async (api) => {
			const res = await api.contacts.update({
				list_id: 101,
				contact_id: 501,
				first_name: 'Alicia',
			});
			expect(res.first_name).toBe('Alicia');
		},
	},
	{
		name: 'contacts.delete',
		method: 'DELETE',
		path: 'lists/101/contacts/501',
		data: [],
		run: async (api) => {
			const res = await api.contacts.delete({
				list_id: 101,
				contact_id: 501,
			});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'contacts.copy',
		method: 'PUT',
		path: 'lists/101/contacts/501/copy/102',
		data: { ...CONTACT, list_id: 102 },
		run: async (api) => {
			const res = await api.contacts.copy({
				from_list_id: 101,
				contact_id: 501,
				to_list_id: 102,
			});
			expect(res.list_id).toBe(102);
		},
	},
	{
		name: 'contacts.transfer',
		method: 'PUT',
		path: 'lists/101/contacts/501/transfer/102',
		data: { ...CONTACT, list_id: 102 },
		run: async (api) => {
			const res = await api.contacts.transfer({
				from_list_id: 101,
				contact_id: 501,
				to_list_id: 102,
			});
			expect(res.list_id).toBe(102);
		},
	},
	{
		name: 'contacts.import',
		method: 'POST',
		path: 'lists/101/import',
		data: { msg: 'queued', ids: ['1'], id: '1' },
		run: async (api) => {
			const res = await api.contacts.import({
				list_id: 101,
				file_url: 'https://example.com/contacts.csv',
				field_order: ['phone_number', 'first_name'],
			});
			expect(res.msg).toBe('queued');
		},
	},
	{
		name: 'contacts.importFields',
		method: 'GET',
		path: 'lists/101/import-fields',
		data: [{ field: 'phone_number', label: 'Phone' }],
		run: async (api) => {
			const res = await api.contacts.importFields({ list_id: 101 });
			expect(res[0]?.field).toBe('phone_number');
		},
	},
	{
		name: 'contacts.importPreview',
		method: 'POST',
		path: 'lists/101/import-csv-preview',
		data: { row: ['+1234567890', 'Alice'] },
		run: async (api) => {
			const res = await api.contacts.importPreview({
				list_id: 101,
				file_url: 'https://example.com/contacts.csv',
			});
			expect(res.row).toEqual(['+1234567890', 'Alice']);
		},
	},
	{
		name: 'contacts.removeOptedOut',
		method: 'PUT',
		path: 'lists/101/remove-opted-out-contacts/9',
		data: { deleted: 2 },
		run: async (api) => {
			const res = await api.contacts.removeOptedOut({
				list_id: 101,
				opt_out_list_id: 9,
			});
			expect(res.deleted).toBe(2);
		},
	},
	{
		name: 'contacts.search',
		method: 'GET',
		path: 'search/contacts-lists',
		data: { data: [{ id: 101, name: 'VIP', type: 'list' }] },
		run: async (api) => {
			const res = await api.contacts.search({ q: 'vip' });
			expect(res.data?.[0]?.type).toBe('list');
		},
	},
	{
		name: 'contacts.suggestions',
		method: 'GET',
		path: 'contact-suggestions',
		data: [CONTACT],
		run: async (api) => {
			const res = await api.contacts.suggestions({});
			expect(res[0]?.contact_id).toBe(501);
		},
	},
	{
		name: 'recharge.transactions',
		method: 'GET',
		path: 'recharge/transactions',
		data: { data: [] },
		run: async (api) => {
			const res = await api.recharge.transactions({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'recharge.transactionGet',
		method: 'GET',
		path: 'recharge/transactions/55',
		data: { invoice_number: 'INV-55', amount: 20, currency: 'USD' },
		run: async (api) => {
			const res = await api.recharge.transactionGet({ transaction_id: 55 });
			expect(res.invoice_number).toBe('INV-55');
		},
	},
	{
		name: 'recharge.packages',
		method: 'GET',
		path: 'recharge/packages',
		data: { packages: [], currency: 'USD' },
		run: async (api) => {
			const res = await api.recharge.packages({});
			expect(res.packages).toEqual([]);
		},
	},
	{
		name: 'recharge.purchase',
		method: 'PUT',
		path: 'recharge/purchase/3',
		data: { amount: 20, currency: 'USD' },
		run: async (api) => {
			const res = await api.recharge.purchase({ package_id: 3 });
			expect(res.amount).toBe(20);
		},
	},
	{
		name: 'recharge.creditCardGet',
		method: 'GET',
		path: 'recharge/credit-card',
		data: { display_number: 'XXXX-XXXX-XXXX-4242', name: 'Ada' },
		run: async (api) => {
			const res = await api.recharge.creditCardGet({});
			expect(res.name).toBe('Ada');
		},
	},
	{
		name: 'recharge.creditCardUpdate',
		method: 'PUT',
		path: 'recharge/credit-card',
		data: { token: 'tok-1' },
		run: async (api) => {
			const res = await api.recharge.creditCardUpdate({
				number: '4242424242424242',
				expiry_month: '12',
				expiry_year: '2030',
				cvc: '123',
				name: 'Ada',
			});
			expect(res.token).toBe('tok-1');
		},
	},
	{
		name: 'subaccounts.list',
		method: 'GET',
		path: 'subaccounts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.subaccounts.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'subaccounts.get',
		method: 'GET',
		path: 'subaccounts/11',
		data: { subaccount_id: 11, api_username: 'sub1' },
		run: async (api) => {
			const res = await api.subaccounts.get({ subaccount_id: 11 });
			expect(res.api_username).toBe('sub1');
		},
	},
	{
		name: 'subaccounts.create',
		method: 'POST',
		path: 'subaccounts',
		data: { subaccount_id: 12, api_username: 'sub2' },
		run: async (api) => {
			const res = await api.subaccounts.create({
				api_username: 'sub2',
				password: 'secret-1',
				email: 'sub2@example.com',
				phone_number: '+10000000001',
				first_name: 'Sub',
				last_name: 'Two',
			});
			expect(res.subaccount_id).toBe(12);
		},
	},
	{
		name: 'subaccounts.update',
		method: 'PUT',
		path: 'subaccounts/11',
		data: { subaccount_id: 11, first_name: 'Subby' },
		run: async (api) => {
			const res = await api.subaccounts.update({
				subaccount_id: 11,
				first_name: 'Subby',
			});
			expect(res.first_name).toBe('Subby');
		},
	},
	{
		name: 'subaccounts.delete',
		method: 'DELETE',
		path: 'subaccounts/11',
		data: [],
		run: async (api) => {
			const res = await api.subaccounts.delete({ subaccount_id: 11 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'subaccounts.regenKey',
		method: 'PUT',
		path: 'subaccounts/11/regen-api-key',
		data: { api_key: 'new-key' },
		run: async (api) => {
			const res = await api.subaccounts.regenKey({ subaccount_id: 11 });
			expect(res.api_key).toBe('new-key');
		},
	},
	{
		name: 'reseller.accountsList',
		method: 'GET',
		path: 'reseller/accounts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.reseller.accountsList({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'reseller.settingsGet',
		method: 'GET',
		path: 'reseller',
		data: { subdomain: 'acme' },
		run: async (api) => {
			const res = await api.reseller.settingsGet({});
			expect(res.subdomain).toBe('acme');
		},
	},
	{
		name: 'reseller.settingsUpdate',
		method: 'PUT',
		path: 'reseller',
		data: { subdomain: 'acme2' },
		run: async (api) => {
			const res = await api.reseller.settingsUpdate({
				subdomain: 'acme2',
			});
			expect(res.subdomain).toBe('acme2');
		},
	},
	{
		name: 'referral.accountsList',
		method: 'GET',
		path: 'referral/accounts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.referral.accountsList({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'countries.list',
		method: 'GET',
		path: 'countries',
		data: [{ code: 'AU', value: 'Australia' }],
		run: async (api) => {
			const res = await api.countries.list({});
			expect(res[0]?.code).toBe('AU');
		},
	},
	{
		name: 'countries.globalList',
		method: 'GET',
		path: 'country-list',
		data: [{ id: 1, name: 'Australia', code: 'AU' }],
		run: async (api) => {
			const res = await api.countries.globalList({});
			expect(res[0]?.code).toBe('AU');
		},
	},
	{
		name: 'countries.pricing',
		method: 'GET',
		path: 'pricing/AU',
		data: { country: 'AU' },
		run: async (api) => {
			const res = await api.countries.pricing({
				country: 'AU',
				currency: 'USD',
			});
			expect(res.country).toBe('AU');
		},
	},
	{
		name: 'countries.userCountriesGet',
		method: 'GET',
		path: 'user-countries',
		data: [],
		run: async (api) => {
			const res = await api.countries.userCountriesGet({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'countries.userCountriesSelect',
		method: 'POST',
		path: 'user-countries',
		data: [],
		run: async (api) => {
			const res = await api.countries.userCountriesSelect({
				country_list_ids: [1, 2],
			});
			expect(res).toEqual([]);
			const req = lastRequest();
			expect(req.body).toMatchObject({ country_list_ids: [1, 2] });
		},
	},
	{
		name: 'countries.userCountriesAgree',
		method: 'POST',
		path: 'user-countries/agree',
		data: [],
		run: async (api) => {
			const res = await api.countries.userCountriesAgree({});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'timezones.list',
		method: 'GET',
		path: 'timezones',
		data: ['Australia/Melbourne', 'UTC'],
		run: async (api) => {
			const res = await api.timezones.list({});
			expect(res).toContain('UTC');
		},
	},
	{
		name: 'deliveryIssues.list',
		method: 'GET',
		path: 'delivery-issues',
		data: { data: [] },
		run: async (api) => {
			const res = await api.deliveryIssues.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'deliveryIssues.create',
		method: 'POST',
		path: 'delivery-issues',
		data: { issue_id: 1, type: 'SMS' },
		run: async (api) => {
			const res = await api.deliveryIssues.create({
				type: 'SMS',
				description: 'Not received',
				email_address: 'a@example.com',
			});
			expect(res.issue_id).toBe(1);
		},
	},
	{
		name: 'postLetters.send',
		method: 'POST',
		path: 'post/letters/send',
		data: { total_price: 1.87, recipients: [] },
		run: async (api) => {
			const res = await api.postLetters.send({
				file_url: 'https://example.com/letter.pdf',
				recipients: [
					{
						address_name: 'John',
						address_line_1: '1 Main St',
						address_city: 'Perth',
						address_postal_code: '6000',
						address_country: 'AU',
						return_address_id: 1,
					},
				],
			});
			expect(res.total_price).toBe(1.87);
		},
	},
	{
		name: 'postLetters.history',
		method: 'GET',
		path: 'post/letters/history',
		data: { data: [] },
		run: async (api) => {
			const res = await api.postLetters.history({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'postLetters.historyExport',
		method: 'GET',
		path: 'post/letters/history/export',
		data: { url: 'https://example.com/post.csv' },
		run: async (api) => {
			const res = await api.postLetters.historyExport({
				filename: 'post.csv',
			});
			expect(res.url).toBe('https://example.com/post.csv');
		},
	},
	{
		name: 'postLetters.price',
		method: 'POST',
		path: 'post/letters/price',
		data: { total_price: 1.87 },
		run: async (api) => {
			const res = await api.postLetters.price({
				file_url: 'https://example.com/letter.pdf',
				recipients: [
					{
						address_name: 'John',
						address_line_1: '1 Main St',
						address_city: 'Perth',
						address_postal_code: '6000',
						address_country: 'AU',
						return_address_id: 1,
					},
				],
			});
			expect(res.total_price).toBe(1.87);
		},
	},
	{
		name: 'postLetters.detectAddress',
		method: 'POST',
		path: 'post/letters/detect-address',
		data: { address_name: 'John', address_city: 'Perth' },
		run: async (api) => {
			const res = await api.postLetters.detectAddress({
				address: 'John, 1 Main St, Perth WA 6000',
			});
			expect(res.address_city).toBe('Perth');
		},
	},
	{
		name: 'postReturnAddresses.create',
		method: 'POST',
		path: 'post/return-addresses',
		data: { return_address_id: 1, address_name: 'HQ' },
		run: async (api) => {
			const res = await api.postReturnAddresses.create({
				address_name: 'HQ',
				address_line_1: '1 Main St',
				address_city: 'Perth',
				address_postal_code: '6000',
				address_country: 'AU',
			});
			expect(res.return_address_id).toBe(1);
		},
	},
	{
		name: 'postReturnAddresses.list',
		method: 'GET',
		path: 'post/return-addresses',
		data: { data: [] },
		run: async (api) => {
			const res = await api.postReturnAddresses.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'postReturnAddresses.get',
		method: 'GET',
		path: 'post/return-addresses/1',
		data: { return_address_id: 1, address_name: 'HQ' },
		run: async (api) => {
			const res = await api.postReturnAddresses.get({
				return_address_id: 1,
			});
			expect(res.address_name).toBe('HQ');
		},
	},
	{
		name: 'postReturnAddresses.update',
		method: 'PUT',
		path: 'post/return-addresses/1',
		data: { return_address_id: 1, address_name: 'HQ2' },
		run: async (api) => {
			const res = await api.postReturnAddresses.update({
				return_address_id: 1,
				address_name: 'HQ2',
				address_line_1: '1 Main St',
				address_city: 'Perth',
				address_postal_code: '6000',
				address_country: 'AU',
			});
			expect(res.address_name).toBe('HQ2');
		},
	},
	{
		name: 'postReturnAddresses.delete',
		method: 'DELETE',
		path: 'post/return-addresses/1',
		data: [],
		run: async (api) => {
			const res = await api.postReturnAddresses.delete({
				return_address_id: 1,
			});
			expect(res).toEqual([]);
		},
	},
	{
		name: 'postDirectMail.send',
		method: 'POST',
		path: 'post/direct-mail/campaigns/send',
		data: {},
		run: async (api) => {
			const res = await api.postDirectMail.send({
				name: 'Flyers',
				size: 'A5',
				file_urls: ['https://example.com/a5.pdf'],
			});
			expect(res).toBeDefined();
		},
	},
	{
		name: 'postDirectMail.searchLocations',
		method: 'GET',
		path: 'post/direct-mail/locations/search/AU',
		data: { data: [] },
		run: async (api) => {
			const res = await api.postDirectMail.searchLocations({
				country: 'AU',
				q: '2000',
			});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'numbers.list',
		method: 'GET',
		path: 'numbers',
		data: { data: [] },
		run: async (api) => {
			const res = await api.numbers.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'numbers.search',
		method: 'GET',
		path: 'numbers/search/AU',
		data: { data: [] },
		run: async (api) => {
			const res = await api.numbers.search({ country: 'AU' });
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'numbers.buy',
		method: 'POST',
		path: 'numbers/buy/+61400000001',
		data: { dedicated_number: '+61400000001', country: 'AU' },
		run: async (api) => {
			const res = await api.numbers.buy({
				dedicated_number: '+61400000001',
				type: 'sms',
			});
			expect(res.dedicated_number).toBe('+61400000001');
		},
	},
	{
		name: 'smsInboundRules.list',
		method: 'GET',
		path: 'automations/sms/inbound',
		data: { data: [] },
		run: async (api) => {
			const res = await api.smsInboundRules.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'smsInboundRules.create',
		method: 'POST',
		path: 'automations/sms/inbound',
		data: { inbound_rule_id: 1, rule_name: 'Catch-all' },
		run: async (api) => {
			const res = await api.smsInboundRules.create({
				dedicated_number: '*',
				rule_name: 'Catch-all',
				message_search_type: 0,
				action: 'POLL',
				action_address: '',
				enabled: 1,
			});
			expect(res.inbound_rule_id).toBe(1);
		},
	},
	{
		name: 'smsInboundRules.get',
		method: 'GET',
		path: 'automations/sms/inbound/1',
		data: { inbound_rule_id: 1, rule_name: 'Catch-all' },
		run: async (api) => {
			const res = await api.smsInboundRules.get({ inbound_rule_id: 1 });
			expect(res.rule_name).toBe('Catch-all');
		},
	},
	{
		name: 'smsInboundRules.update',
		method: 'PUT',
		path: 'automations/sms/inbound/1',
		data: { inbound_rule_id: 1, rule_name: 'Catch-all v2' },
		run: async (api) => {
			const res = await api.smsInboundRules.update({
				inbound_rule_id: 1,
				dedicated_number: '*',
				rule_name: 'Catch-all v2',
				message_search_type: 0,
				action: 'POLL',
				action_address: '',
				enabled: 1,
			});
			expect(res.rule_name).toBe('Catch-all v2');
		},
	},
	{
		name: 'smsInboundRules.delete',
		method: 'DELETE',
		path: 'automations/sms/inbound/1',
		data: [],
		run: async (api) => {
			const res = await api.smsInboundRules.delete({ inbound_rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'smsReceiptRules.list',
		method: 'GET',
		path: 'automations/sms/receipts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.smsReceiptRules.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'smsReceiptRules.create',
		method: 'POST',
		path: 'automations/sms/receipts',
		data: { receipt_rule_id: 1, rule_name: 'R' },
		run: async (api) => {
			const res = await api.smsReceiptRules.create({
				rule_name: 'R',
				match_type: 1,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.receipt_rule_id).toBe(1);
		},
	},
	{
		name: 'smsReceiptRules.get',
		method: 'GET',
		path: 'automations/sms/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'R' },
		run: async (api) => {
			const res = await api.smsReceiptRules.get({ receipt_rule_id: 1 });
			expect(res.rule_name).toBe('R');
		},
	},
	{
		name: 'smsReceiptRules.update',
		method: 'PUT',
		path: 'automations/sms/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'R2' },
		run: async (api) => {
			const res = await api.smsReceiptRules.update({
				receipt_rule_id: 1,
				rule_name: 'R2',
				match_type: 1,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.rule_name).toBe('R2');
		},
	},
	{
		name: 'smsReceiptRules.delete',
		method: 'DELETE',
		path: 'automations/sms/receipts/1',
		data: [],
		run: async (api) => {
			const res = await api.smsReceiptRules.delete({ receipt_rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'voiceReceiptRules.list',
		method: 'GET',
		path: 'automations/voice/receipts',
		data: { data: [] },
		run: async (api) => {
			const res = await api.voiceReceiptRules.list({});
			expect(res.data).toEqual([]);
		},
	},
	{
		name: 'voiceReceiptRules.create',
		method: 'POST',
		path: 'automations/voice/receipts',
		data: { receipt_rule_id: 1, rule_name: 'VR' },
		run: async (api) => {
			const res = await api.voiceReceiptRules.create({
				rule_name: 'VR',
				match_type: 1,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.receipt_rule_id).toBe(1);
		},
	},
	{
		name: 'voiceReceiptRules.get',
		method: 'GET',
		path: 'automations/voice/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'VR' },
		run: async (api) => {
			const res = await api.voiceReceiptRules.get({ receipt_rule_id: 1 });
			expect(res.rule_name).toBe('VR');
		},
	},
	{
		name: 'voiceReceiptRules.update',
		method: 'PUT',
		path: 'automations/voice/receipts/1',
		data: { receipt_rule_id: 1, rule_name: 'VR2' },
		run: async (api) => {
			const res = await api.voiceReceiptRules.update({
				receipt_rule_id: 1,
				rule_name: 'VR2',
				match_type: 1,
				action: 'URL',
				action_address: 'https://example.com/hook',
				enabled: 1,
			});
			expect(res.rule_name).toBe('VR2');
		},
	},
	{
		name: 'voiceReceiptRules.delete',
		method: 'DELETE',
		path: 'automations/voice/receipts/1',
		data: [],
		run: async (api) => {
			const res = await api.voiceReceiptRules.delete({ receipt_rule_id: 1 });
			expect(res).toEqual([]);
		},
	},
	{
		name: 'uploads.upload',
		method: 'POST',
		path: 'uploads?convert=post',
		data: { _url: 'https://example.com/converted.pdf' },
		run: async (api) => {
			const res = await api.uploads.upload({
				convert: 'post',
				content: 'Q29udGVudA==',
			});
			expect(res._url).toBe('https://example.com/converted.pdf');
		},
	},
	{
		name: 'uploads.uploadDocument',
		method: 'POST',
		path: 'uploads?convert=fax',
		data: { _url: 'https://example.com/fax.pdf' },
		run: async (api) => {
			const res = await api.uploads.uploadDocument({
				convert: 'fax',
				content: 'Q29udGVudA==',
			});
			expect(res._url).toBe('https://example.com/fax.pdf');
		},
	},
];

describe('ClickSend endpoints', () => {
	const testDb = createTestDatabase();
	let api: ClickSendBoundEndpoints;

	beforeAll(async () => {
		await createIntegrationAndAccount(testDb.db, 'clicksend');
		const corsair = createCorsair({
			plugins: [
				clicksend({
					authType: 'api_key',
					username: USERNAME,
					apiKey: API_KEY,
				}),
			],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});
		api = corsair.clicksend.api;
	});

	afterAll(() => {
		testDb.cleanup();
		jest.restoreAllMocks();
	});

	for (const testCase of cases) {
		it(`${testCase.name} calls ${testCase.method} ${testCase.path}`, async () => {
			fetchSpy.mockReset();
			fetchSpy.mockImplementation(() =>
				Promise.resolve(envelope(testCase.data)),
			);
			await testCase.run(api);
			const req = lastRequest();
			expect(req.url).toContain(`/v3/${testCase.path}`);
			expect(req.method).toBe(testCase.method);
		});
	}
});
