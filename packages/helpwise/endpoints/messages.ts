import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { HELPWISE_APP_BASE, makeHelpwiseRequest } from '../client';
import type {
	ListEmailsResponse,
	SendChatResponse,
	SendEmailResponse,
	SendSmsResponse,
	SendWhatsAppResponse,
} from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const sendEmail: HelpwiseEndpoint<'messages.sendEmail'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['messages.sendEmail'].parse(input);
	const response = await makeHelpwiseRequest<SendEmailResponse>(
		'/dev-apis/emails/send_mail',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['messages.sendEmail'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.messages.sendEmail',
		{ mailboxId: parsedInput.mailbox_id },
		'completed',
	);
	return parsed;
};

export const listEmails: HelpwiseEndpoint<'messages.listEmails'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['messages.listEmails'].parse(input);
	const response = await makeHelpwiseRequest<ListEmailsResponse>(
		'/dev-apis/emails/list',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['messages.listEmails'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.messages.listEmails',
		{ threadId: parsedInput.threadId },
		'completed',
	);
	return parsed;
};

export const sendSms: HelpwiseEndpoint<'messages.sendSms'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['messages.sendSms'].parse(input);
	const response = await makeHelpwiseRequest<SendSmsResponse>(
		'/smsWhatsApp/sendMsg',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['messages.sendSms'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.messages.sendSms',
		{ inboxId: parsedInput.inboxId },
		'completed',
	);
	return parsed;
};

export const sendWhatsApp: HelpwiseEndpoint<'messages.sendWhatsApp'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['messages.sendWhatsApp'].parse(input);
	const response = await makeHelpwiseRequest<SendWhatsAppResponse>(
		'/smsWhatsApp/sendMsg',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['messages.sendWhatsApp'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.messages.sendWhatsApp',
		{ inboxId: parsedInput.inboxId },
		'completed',
	);
	return parsed;
};

export const sendChat: HelpwiseEndpoint<'messages.sendChat'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['messages.sendChat'].parse(input);
	const response = await makeHelpwiseRequest<SendChatResponse>(
		'/dev-apis/chat/send',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['messages.sendChat'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.messages.sendChat',
		{ threadId: parsedInput.thread_id },
		'completed',
	);
	return parsed;
};
