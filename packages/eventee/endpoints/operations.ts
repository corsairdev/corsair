import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EventeeContext } from '..';
import { makeEventeeRequest } from '../client';
import {
	EventeeEndpointInputSchemas,
	EventeeEndpointOutputSchemas,
} from './types';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type InputSchema = z.ZodType;
type OutputSchema = z.ZodType;

type RequestParts<Input> = {
	path?: (input: Input) => Record<string, string | number>;
	query?: (
		input: Input,
	) => Record<string, string | number | boolean | undefined>;
	// Per-operation body shapes differ; after strict Zod validation, this shared dispatcher uses a JSON record instead of `any`.
	body?: (input: Input) => Record<string, unknown>;
};

function operation<In extends InputSchema, Out extends OutputSchema>(
	name: string,
	method: Method,
	url: string,
	inputSchema: In,
	outputSchema: Out,
	parts: RequestParts<z.output<In>> = {},
): CorsairEndpoint<EventeeContext, z.output<In>, z.output<Out>> {
	return async (ctx, input) => {
		const parsedInput = inputSchema.parse(input);
		const requestParts = {
			method,
			path: parts.path?.(parsedInput),
			query: parts.query?.(parsedInput),
			body: parts.body?.(parsedInput),
		};
		// Provider JSON is untrusted until the operation's output schema checks it.
		const response: unknown = await makeEventeeRequest<unknown>(
			url,
			ctx.key,
			requestParts,
		);
		const parsedOutput = outputSchema.parse(response);
		// Inputs and outputs contain attendee PII and event content; log only the operation name.
		await logEventFromContext(ctx, `eventee.${name}`, {}, 'completed');
		return parsedOutput;
	};
}

export const Content = {
	get: operation(
		'content.get',
		'GET',
		'/public/api/{api-version}/content',
		EventeeEndpointInputSchemas.contentGet,
		EventeeEndpointOutputSchemas.contentGet,
		{
			// Eventee validates this flag as 0/1 and answers 422 to the strings "true" and "false".
			query: ({ date, with_overlapping }) => ({
				date,
				with_overlapping:
					with_overlapping === undefined ? undefined : with_overlapping ? 1 : 0,
			}),
		},
	),
	deleteAll: operation(
		'contentReset.delete',
		'DELETE',
		'/public/api/{api-version}/test/content',
		EventeeEndpointInputSchemas.contentDeleteAll,
		EventeeEndpointOutputSchemas.contentDeleteAll,
	),
};

export const Halls = {
	create: operation(
		'hall.post',
		'POST',
		'/public/api/{api-version}/hall',
		EventeeEndpointInputSchemas.hallCreate,
		EventeeEndpointOutputSchemas.hallCreate,
		{ body: ({ name, order, stream }) => ({ name, order, stream }) },
	),
	update: operation(
		'hall.patch',
		'PATCH',
		'/public/api/{api-version}/hall/{hall_id}',
		EventeeEndpointInputSchemas.hallUpdate,
		EventeeEndpointOutputSchemas.hallUpdate,
		{
			path: ({ hall_id }) => ({ hall_id }),
			body: ({ name, order, stream }) => ({ name, order, stream }),
		},
	),
	delete: operation(
		'hall.delete',
		'DELETE',
		'/public/api/{api-version}/hall/{hall_id}',
		EventeeEndpointInputSchemas.hallDelete,
		EventeeEndpointOutputSchemas.hallDelete,
		{ path: ({ hall_id }) => ({ hall_id }) },
	),
};

export const Sessions = {
	create: operation(
		'session.post',
		'POST',
		'/public/api/{api-version}/lecture',
		EventeeEndpointInputSchemas.sessionCreate,
		EventeeEndpointOutputSchemas.sessionCreate,
		{
			body: (input) => ({
				name: input.name,
				description: input.description,
				start: input.start,
				end: input.end,
				type: input.type,
				hall_id: input.hall_id,
				speakers: input.speakers,
				tracks: input.tracks,
				discussion: input.discussion,
				moderating: input.moderating,
				polling: input.polling,
				checkin: input.checkin,
				capacity: input.capacity,
				stream: input.stream,
				virtual_meeting: input.virtual_meeting,
			}),
		},
	),
	update: operation(
		'session.patch',
		'PATCH',
		'/public/api/{api-version}/lecture/{lecture_id}',
		EventeeEndpointInputSchemas.sessionUpdate,
		EventeeEndpointOutputSchemas.sessionUpdate,
		{
			path: ({ lecture_id }) => ({ lecture_id }),
			body: (input) => ({
				name: input.name,
				description: input.description,
				start: input.start,
				end: input.end,
				type: input.type,
				hall_id: input.hall_id,
				speakers: input.speakers,
				tracks: input.tracks,
				discussion: input.discussion,
				moderating: input.moderating,
				polling: input.polling,
				capacity: input.capacity,
				stream: input.stream,
				virtual_meeting: input.virtual_meeting,
			}),
		},
	),
	delete: operation(
		'session.delete',
		'DELETE',
		'/public/api/{api-version}/lecture/{lecture_id}',
		EventeeEndpointInputSchemas.sessionDelete,
		EventeeEndpointOutputSchemas.sessionDelete,
		{ path: ({ lecture_id }) => ({ lecture_id }) },
	),
};

export const Breaks = {
	create: operation(
		'pause.post',
		'POST',
		'/public/api/{api-version}/pause',
		EventeeEndpointInputSchemas.breakCreate,
		EventeeEndpointOutputSchemas.breakCreate,
		{
			body: ({ name, description, start, end }) => ({
				name,
				description,
				start,
				end,
			}),
		},
	),
	update: operation(
		'pause.patch',
		'PATCH',
		'/public/api/{api-version}/pause/{pause_id}',
		EventeeEndpointInputSchemas.breakUpdate,
		EventeeEndpointOutputSchemas.breakUpdate,
		{
			path: ({ pause_id }) => ({ pause_id }),
			body: ({ name, description, start, end }) => ({
				name,
				description,
				start,
				end,
			}),
		},
	),
	delete: operation(
		'pause.delete',
		'DELETE',
		'/public/api/{api-version}/pause/{pause_id}',
		EventeeEndpointInputSchemas.breakDelete,
		EventeeEndpointOutputSchemas.breakDelete,
		{ path: ({ pause_id }) => ({ pause_id }) },
	),
};

export const Speakers = {
	create: operation(
		'speaker.post',
		'POST',
		'/public/api/{api-version}/speaker',
		EventeeEndpointInputSchemas.speakerCreate,
		EventeeEndpointOutputSchemas.speakerCreate,
		{
			body: (input) => ({
				name: input.name,
				email: input.email,
				photo: input.photo,
				bio: input.bio,
				position: input.position,
				company: input.company,
				phone: input.phone,
				web: input.web,
				linkedIn: input.linkedIn,
				twitter: input.twitter,
				facebook: input.facebook,
				instagram: input.instagram,
				country: input.country,
				language: input.language,
			}),
		},
	),
	update: operation(
		'speaker.patch',
		'PATCH',
		'/public/api/{api-version}/speaker/{speakerTmp_id}',
		EventeeEndpointInputSchemas.speakerUpdate,
		EventeeEndpointOutputSchemas.speakerUpdate,
		{
			path: ({ speakerTmp_id }) => ({ speakerTmp_id }),
			body: (input) => ({
				name: input.name,
				email: input.email,
				photo: input.photo,
				bio: input.bio,
				position: input.position,
				company: input.company,
				phone: input.phone,
				web: input.web,
				linkedIn: input.linkedIn,
				twitter: input.twitter,
				facebook: input.facebook,
				instagram: input.instagram,
				country: input.country,
				language: input.language,
			}),
		},
	),
	delete: operation(
		'speaker.delete',
		'DELETE',
		'/public/api/{api-version}/speaker/{speakerTmp_id}',
		EventeeEndpointInputSchemas.speakerDelete,
		EventeeEndpointOutputSchemas.speakerDelete,
		{ path: ({ speakerTmp_id }) => ({ speakerTmp_id }) },
	),
};

export const Labels = {
	create: operation(
		'label.post',
		'POST',
		'/public/api/{api-version}/label',
		EventeeEndpointInputSchemas.labelCreate,
		EventeeEndpointOutputSchemas.labelCreate,
		{ body: ({ name, color, order }) => ({ name, color, order }) },
	),
	update: operation(
		'label.patch',
		'PATCH',
		'/public/api/{api-version}/label/{track_id}',
		EventeeEndpointInputSchemas.labelUpdate,
		EventeeEndpointOutputSchemas.labelUpdate,
		{
			path: ({ track_id }) => ({ track_id }),
			body: ({ name, color, order }) => ({ name, color, order }),
		},
	),
	delete: operation(
		'label.delete',
		'DELETE',
		'/public/api/{api-version}/label/{track_id}',
		EventeeEndpointInputSchemas.labelDelete,
		EventeeEndpointOutputSchemas.labelDelete,
		{ path: ({ track_id }) => ({ track_id }) },
	),
};

export const Partners = {
	create: operation(
		'partner.post',
		'POST',
		'/public/api/{api-version}/partner',
		EventeeEndpointInputSchemas.partnerCreate,
		EventeeEndpointOutputSchemas.partnerCreate,
		{
			body: ({
				company,
				description,
				logo_url,
				photo_url,
				booth_number,
				web,
				email,
				phone,
				address,
			}) => ({
				company,
				description,
				logo_url,
				photo_url,
				booth_number,
				web,
				email,
				phone,
				address,
			}),
		},
	),
	update: operation(
		'partner.patch',
		'PATCH',
		'/public/api/{api-version}/partner/{partner_id}',
		EventeeEndpointInputSchemas.partnerUpdate,
		EventeeEndpointOutputSchemas.partnerUpdate,
		{
			path: ({ partner_id }) => ({ partner_id }),
			body: ({
				company,
				description,
				logo_url,
				photo_url,
				booth_number,
				web,
				email,
				phone,
				address,
			}) => ({
				company,
				description,
				logo_url,
				photo_url,
				booth_number,
				web,
				email,
				phone,
				address,
			}),
		},
	),
	delete: operation(
		'partner.delete',
		'DELETE',
		'/public/api/{api-version}/partner/{partner_id}',
		EventeeEndpointInputSchemas.partnerDelete,
		EventeeEndpointOutputSchemas.partnerDelete,
		{ path: ({ partner_id }) => ({ partner_id }) },
	),
	updateSections: operation(
		'partnerSections.patch',
		'PATCH',
		'/public/api/{api-version}/partner/{partner_id}/sections',
		EventeeEndpointInputSchemas.partnerUpdateSections,
		EventeeEndpointOutputSchemas.partnerUpdateSections,
		{
			path: ({ partner_id }) => ({ partner_id }),
			body: ({ sections }) => ({ sections }),
		},
	),
	list: operation(
		'partner.get',
		'GET',
		'/public/api/{api-version}/partners',
		EventeeEndpointInputSchemas.partnerList,
		EventeeEndpointOutputSchemas.partnerList,
	),
};

export const Attendees = {
	invite: operation(
		'attendeeInvite.put',
		'PUT',
		'/public/api/{api-version}/attendee/invite',
		EventeeEndpointInputSchemas.attendeeInvite,
		EventeeEndpointOutputSchemas.attendeeInvite,
		{ body: ({ users }) => ({ users }) },
	),
	checkIn: operation(
		'attendeeCheckIn.patch',
		'PATCH',
		'/public/api/{api-version}/attendee/{attendee_id}/checkin',
		EventeeEndpointInputSchemas.attendeeCheckIn,
		EventeeEndpointOutputSchemas.attendeeCheckIn,
		{
			path: ({ attendee_id }) => ({ attendee_id }),
			body: ({ checkin }) => ({ checkin }),
		},
	),
	list: operation(
		'attendees.get',
		'GET',
		'/public/api/{api-version}/participants',
		EventeeEndpointInputSchemas.attendeeList,
		EventeeEndpointOutputSchemas.attendeeList,
	),
	remove: operation(
		'attendees.delete',
		'DELETE',
		'/public/api/{api-version}/attendee',
		EventeeEndpointInputSchemas.attendeeRemove,
		EventeeEndpointOutputSchemas.attendeeRemove,
		// Eventee requires the email URL-encoded inside the query value (422 validation.encoded_email otherwise); the transport encodes it again.
		{ query: ({ email }) => ({ email: encodeURIComponent(email) }) },
	),
};

export const Registrations = {
	create: operation(
		'registrationInvite.put',
		'PUT',
		'/public/api/{api-version}/registration/invite',
		EventeeEndpointInputSchemas.registrationCreate,
		EventeeEndpointOutputSchemas.registrationCreate,
		{ body: ({ registrations }) => ({ registrations }) },
	),
	list: operation(
		'registrations.get',
		'GET',
		'/public/api/{api-version}/registrations',
		EventeeEndpointInputSchemas.registrationList,
		EventeeEndpointOutputSchemas.registrationList,
	),
	remove: operation(
		'registrations.delete',
		'DELETE',
		'/public/api/{api-version}/registration',
		EventeeEndpointInputSchemas.registrationRemove,
		EventeeEndpointOutputSchemas.registrationRemove,
		// Eventee requires the email URL-encoded inside the query value (422 validation.encoded_email otherwise); the transport encodes it again.
		{ query: ({ email }) => ({ email: encodeURIComponent(email) }) },
	),
};

export const Groups = {
	list: operation(
		'groups.get',
		'GET',
		'/public/api/{api-version}/groups',
		EventeeEndpointInputSchemas.groupList,
		EventeeEndpointOutputSchemas.groupList,
	),
};

export const Reviews = {
	list: operation(
		'reviews.get',
		'GET',
		'/public/api/{api-version}/reviews',
		EventeeEndpointInputSchemas.reviewList,
		EventeeEndpointOutputSchemas.reviewList,
	),
};
