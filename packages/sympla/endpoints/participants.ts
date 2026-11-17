import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SymplaContext } from '../context';
import { callSympla, requireKey } from './shared';
import type {
	CheckInByQrCodeInput,
	CheckInByQrCodeResponse,
	CheckInByTicketInput,
	CheckInByTicketResponse,
	CheckInParticipantInput,
	CheckInParticipantResponse,
	GetParticipantByTicketInput,
	GetParticipantByTicketResponse,
	GetParticipantInput,
	GetParticipantResponse,
	ListOrderParticipantsInput,
	ListOrderParticipantsResponse,
	ListParticipantsInput,
	ListParticipantsResponse,
	ListPresentationParticipantsInput,
	ListPresentationParticipantsResponse,
} from './types';
import {
	CheckInByQrCodeInputSchema,
	CheckInByQrCodeResponseSchema,
	CheckInByTicketInputSchema,
	CheckInByTicketResponseSchema,
	CheckInParticipantInputSchema,
	CheckInParticipantResponseSchema,
	GetParticipantByTicketInputSchema,
	GetParticipantByTicketResponseSchema,
	GetParticipantInputSchema,
	GetParticipantResponseSchema,
	ListOrderParticipantsInputSchema,
	ListOrderParticipantsResponseSchema,
	ListParticipantsInputSchema,
	ListParticipantsResponseSchema,
	ListPresentationParticipantsInputSchema,
	ListPresentationParticipantsResponseSchema,
} from './types';

export const listParticipants: CorsairEndpoint<
	SymplaContext,
	ListParticipantsInput,
	ListParticipantsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListParticipantsInputSchema.parse(input);
	const { event_id: _event_id, ...query } = parsed;
	return callSympla(
		ctx,
		'participants.list',
		{ path: `/events/${pathPart(parsed.event_id)}/participants`, query },
		ListParticipantsResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
};

export const listParticipantsByOrder: CorsairEndpoint<
	SymplaContext,
	ListOrderParticipantsInput,
	ListOrderParticipantsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListOrderParticipantsInputSchema.parse(input);
	const { event_id: _event_id, order_id: _order_id, ...query } = parsed;
	return callSympla(
		ctx,
		'participants.listByOrder',
		{
			path: `/events/${pathPart(parsed.event_id)}/orders/${pathPart(parsed.order_id)}/participants`,
			query,
		},
		ListOrderParticipantsResponseSchema,
		{ event_id: String(parsed.event_id), order_id: String(parsed.order_id) },
	);
};

export const listParticipantsByPresentation: CorsairEndpoint<
	SymplaContext,
	ListPresentationParticipantsInput,
	ListPresentationParticipantsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListPresentationParticipantsInputSchema.parse(input);
	const {
		event_id: _event_id,
		presentation_id: _presentation_id,
		...query
	} = parsed;
	return callSympla(
		ctx,
		'participants.listByPresentation',
		{
			path: `/events/${pathPart(parsed.event_id)}/presentations/${pathPart(parsed.presentation_id)}/participants`,
			query,
		},
		ListPresentationParticipantsResponseSchema,
		{
			event_id: String(parsed.event_id),
			presentation_id: String(parsed.presentation_id),
		},
	);
};

export const getParticipant: CorsairEndpoint<
	SymplaContext,
	GetParticipantInput,
	GetParticipantResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetParticipantInputSchema.parse(input);
	const {
		event_id: _event_id,
		participant_id: _participant_id,
		...query
	} = parsed;
	return callSympla(
		ctx,
		'participants.get',
		{
			path: `/events/${pathPart(parsed.event_id)}/participants/${pathPart(parsed.participant_id)}`,
			query,
		},
		GetParticipantResponseSchema,
		{
			event_id: String(parsed.event_id),
			participant_id: String(parsed.participant_id),
		},
	);
};

export const getParticipantByTicketNumber: CorsairEndpoint<
	SymplaContext,
	GetParticipantByTicketInput,
	GetParticipantByTicketResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetParticipantByTicketInputSchema.parse(input);
	const {
		event_id: _event_id,
		ticket_number: _ticket_number,
		...query
	} = parsed;
	return callSympla(
		ctx,
		'participants.getByTicketNumber',
		{
			path: `/events/${pathPart(parsed.event_id)}/participants/ticketNumber/${pathPart(parsed.ticket_number)}`,
			query,
		},
		GetParticipantByTicketResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
};

export const checkInParticipant: CorsairEndpoint<
	SymplaContext,
	CheckInParticipantInput,
	CheckInParticipantResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = CheckInParticipantInputSchema.parse(input);
	return callSympla(
		ctx,
		'participants.checkIn',
		{
			method: 'POST',
			path: `/events/${pathPart(parsed.event_id)}/participants/${pathPart(parsed.participant_id)}/check-in`,
		},
		CheckInParticipantResponseSchema,
		{
			event_id: String(parsed.event_id),
			participant_id: String(parsed.participant_id),
		},
	);
};

export const checkInByTicketNumber: CorsairEndpoint<
	SymplaContext,
	CheckInByTicketInput,
	CheckInByTicketResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = CheckInByTicketInputSchema.parse(input);
	return callSympla(
		ctx,
		'participants.checkInByTicketNumber',
		{
			method: 'POST',
			path: `/events/${pathPart(parsed.event_id)}/participants/ticketNumber/${pathPart(parsed.ticket_number)}/check-in`,
		},
		CheckInByTicketResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
};

export const checkInByQrCode: CorsairEndpoint<
	SymplaContext,
	CheckInByQrCodeInput,
	CheckInByQrCodeResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = CheckInByQrCodeInputSchema.parse(input);
	const { event_id: _eventId, ...qrPayload } = parsed;
	return callSympla(
		ctx,
		'participants.checkInByQrCode',
		{
			method: 'POST',
			path: `/events/${pathPart(parsed.event_id)}/qrcode/check-in`,
			body: qrPayload,
		},
		CheckInByQrCodeResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
};

export const Participants = {
	list: listParticipants,
	listByOrder: listParticipantsByOrder,
	listByPresentation: listParticipantsByPresentation,
	get: getParticipant,
	getByTicketNumber: getParticipantByTicketNumber,
	checkIn: checkInParticipant,
	checkInByTicketNumber: checkInByTicketNumber,
	checkInByQrCode: checkInByQrCode,
};
