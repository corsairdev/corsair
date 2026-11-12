import type { CorsairEndpoint } from 'corsair/core';
import type { SmsalertContext } from '..';
import { SmsalertError, smsalertRequest } from '../client';
import type { SmsalertEndpointInputs, SmsalertEndpointOutputs } from './types';
import {
	SmsalertEndpointInputSchemas as inputs,
	SmsalertEndpointOutputSchemas as outputs,
} from './types';

function endpoint<K extends keyof SmsalertEndpointInputs>(
	name: K,
	method: 'GET' | 'POST',
	path: string,
	auth: 'query' | 'form' | 'none' = 'query',
): CorsairEndpoint<
	SmsalertContext,
	SmsalertEndpointInputs[K],
	SmsalertEndpointOutputs[K]
> {
	return async (ctx, rawInput) => {
		// Every input schema is a flat object of string/number fields. The generic
		// indexed schema loses that shared record type, so assert it after parsing.
		const input = inputs[name].parse(rawInput) as Record<
			string,
			string | number | undefined
		>;
		let query = input;
		let form: Record<string, string> | undefined;
		if (name === 'register') {
			query = { rtype: 'self' };
			form = Object.fromEntries(
				Object.entries(input).map(([key, value]) => [
					`data[User][${key}]`,
					String(value),
				]),
			);
		} else if (name === 'forgotPassword') {
			query = {};
			form = { 'data[User][username_email]': String(input.username_email) };
		} else if (auth === 'form') {
			query = {};
			form = Object.fromEntries(
				Object.entries(input).map(([key, value]) => [key, String(value)]),
			);
		}
		const response = await smsalertRequest(
			ctx.key,
			method,
			path,
			query,
			form,
			auth,
		);
		const parsed = outputs[name].safeParse(response);
		if (!parsed.success)
			throw new SmsalertError('SMS Alert returned an invalid response');
		if (name === 'validateOtp') {
			const otp = outputs.validateOtp.parse(response);
			if (otp.description.desc === 'Code does not match.')
				throw new SmsalertError('SMS Alert OTP code does not match');
		}
		// Both the schema and return type are indexed by the same name; TypeScript
		// widens the generic indexed parse result to a union despite that pairing.
		return parsed.data as SmsalertEndpointOutputs[K];
	};
}

export const endpoints = {
	account: {
		profile: endpoint('profile', 'POST', '/api/user.json'),
		register: endpoint('register', 'POST', '/users/add.json', 'none'),
		forgotPassword: endpoint(
			'forgotPassword',
			'POST',
			'/users/forgotpassword.json',
			'none',
		),
		changePassword: endpoint(
			'changePassword',
			'POST',
			'/api/changepwd.json',
			'form',
		),
		updateProfile: endpoint('updateProfile', 'POST', '/api/updateprofile.json'),
		balance: endpoint('balance', 'GET', '/api/creditstatus.json'),
		senders: endpoint('senders', 'GET', '/api/senderlist.json'),
	},
	groups: {
		list: endpoint('listGroups', 'GET', '/api/grouplist.json'),
		create: endpoint('createGroup', 'POST', '/api/creategroup.json'),
		delete: endpoint('deleteGroup', 'POST', '/api/deletegroup.json'),
		update: endpoint('updateGroup', 'POST', '/api/updategroup.json'),
		send: endpoint('sendGroup', 'POST', '/api/grouppush.json'),
	},
	contacts: {
		list: endpoint('listContacts', 'GET', '/api/contactlist.json'),
		create: endpoint('createContact', 'POST', '/api/createcontact.json'),
		update: endpoint('updateContact', 'POST', '/api/updatecontact.json'),
		delete: endpoint('deleteContact', 'POST', '/api/deletecontact.json'),
	},
	templates: {
		list: endpoint('listTemplates', 'GET', '/api/templatelist.json'),
		create: endpoint('createTemplate', 'POST', '/api/createtemplate.json'),
		update: endpoint('updateTemplate', 'POST', '/api/updatetemplate.json'),
		delete: endpoint('deleteTemplate', 'POST', '/api/deletetemplate.json'),
	},
	messages: { send: endpoint('sendSms', 'POST', '/api/push.json') },
	schedules: {
		update: endpoint('updateSchedule', 'POST', '/api/modifyschedule.json'),
		cancel: endpoint('cancelSchedule', 'POST', '/api/cancelschedule.json'),
	},
	reports: {
		sent: endpoint('sentReport', 'POST', '/api/smscampaignlog.json'),
		delivery: endpoint('deliveryReport', 'POST', '/api/pull.json'),
	},
	otp: {
		generate: endpoint('generateOtp', 'POST', '/api/mverify.json'),
		validate: endpoint('validateOtp', 'POST', '/api/mverify.json'),
	},
	shortUrls: {
		create: endpoint('createShortUrl', 'POST', '/api/createshorturl.json'),
		delete: endpoint('deleteShortUrl', 'POST', '/api/deleteshorturl.json'),
	},
} as const;
