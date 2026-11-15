import type { TeltelEndpoints } from '..';
import { call } from './call';
import {
	BalanceInputSchema,
	BalanceResponseSchema,
	InboxGetInputSchema,
	InboxGetResponseSchema,
	InboxListInputSchema,
	InboxListResponseSchema,
	SmsReportGetInputSchema,
	SmsReportGetResponseSchema,
	SmsReportsListInputSchema,
	SmsReportsListResponseSchema,
	SmsSendBulkInputSchema,
	SmsSendBulkResponseSchema,
	SmsSendInputSchema,
	SmsSendResponseSchema,
} from './types';

export const accountBalance: TeltelEndpoints['accountBalance'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'account.balance',
			input: BalanceInputSchema,
			output: BalanceResponseSchema,
		},
		input,
		undefined,
		() => ({ method: 'GET', path: '/account/balance' }),
	);
};

export const smsSend: TeltelEndpoints['smsSend'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'sms.send',
			input: SmsSendInputSchema,
			output: SmsSendResponseSchema,
		},
		input,
		(parsed) => parsed,
		() => ({ method: 'POST', path: '/sms/text' }),
	);
};

export const smsSendBulk: TeltelEndpoints['smsSendBulk'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'sms.sendBulk',
			input: SmsSendBulkInputSchema,
			output: SmsSendBulkResponseSchema,
		},
		input,
		// The bulk route takes an array of messages as the `data` value.
		(parsed) => parsed.messages,
		() => ({ method: 'POST', path: '/sms/bulk/text' }),
	);
};

export const smsReportsList: TeltelEndpoints['smsReportsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'smsReports.list',
			input: SmsReportsListInputSchema,
			output: SmsReportsListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/sms/reports',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
				sort: parsed.sort,
				state: parsed.state,
				from: parsed.from,
				to: parsed.to,
				'created_at[from]': parsed['created_at[from]'],
				'created_at[to]': parsed['created_at[to]'],
			},
		}),
	);
};

export const smsReportsGet: TeltelEndpoints['smsReportsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'smsReports.get',
			input: SmsReportGetInputSchema,
			output: SmsReportGetResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/sms/reports/${parsed.reportId}`,
		}),
	);
};

export const inboxList: TeltelEndpoints['inboxList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'inbox.list',
			input: InboxListInputSchema,
			output: InboxListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/sms/inbox/reports',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
				sort: parsed.sort,
				from: parsed.from,
				to: parsed.to,
			},
		}),
	);
};

export const inboxGet: TeltelEndpoints['inboxGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'inbox.get',
			input: InboxGetInputSchema,
			output: InboxGetResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/sms/inbox/reports/${parsed.inboxMessageId}`,
		}),
	);
};
