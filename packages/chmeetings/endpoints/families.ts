import { logEventFromContext } from 'corsair/core';
import {
	makeChMeetingsRequest,
	unwrapData,
	unwrapEmpty,
	unwrapList,
} from '../client';
import type { ChMeetingsEndpoints } from '../index';
import {
	FamiliesListInputSchema,
	FamilyCreateInputSchema,
	FamilyIdInputSchema,
	FamilySchema,
	NoteSchema,
	NotesListInputSchema,
	SuccessSchema,
} from './types';

function sid(id: string | number): string {
	return String(id);
}

export const list: ChMeetingsEndpoints['familiesList'] = async (ctx, input) => {
	const query = FamiliesListInputSchema.parse(input ?? {});
	const raw = await makeChMeetingsRequest('families', ctx.key, {
		query: {
			search_text: query.search_text,
			page: query.page ?? 1,
			page_size: query.page_size ?? 100,
		},
	});
	const output = unwrapList(raw, FamilySchema);
	await logEventFromContext(
		ctx,
		'chmeetings.families.list',
		query,
		'completed',
	);
	return output;
};

export const get: ChMeetingsEndpoints['familiesGet'] = async (ctx, input) => {
	const { id } = FamilyIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`families/${sid(id)}`, ctx.key);
	const output = unwrapData(raw, FamilySchema, `Family ${id}`);
	await logEventFromContext(
		ctx,
		'chmeetings.families.get',
		{ id },
		'completed',
	);
	return output;
};

export const create: ChMeetingsEndpoints['familiesCreate'] = async (
	ctx,
	input,
) => {
	const body = FamilyCreateInputSchema.parse(input);
	const raw = await makeChMeetingsRequest('families', ctx.key, {
		method: 'POST',
		body,
	});
	const output = unwrapData(raw, FamilySchema, 'Family');
	await logEventFromContext(
		ctx,
		'chmeetings.families.create',
		{ members: body.members.length },
		'completed',
	);
	return output;
};

export const remove: ChMeetingsEndpoints['familiesDelete'] = async (
	ctx,
	input,
) => {
	const { id } = FamilyIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`families/${sid(id)}`, ctx.key, {
		method: 'DELETE',
		responseType: 'empty',
	});
	const output = SuccessSchema.parse(unwrapEmpty(raw));
	await logEventFromContext(
		ctx,
		'chmeetings.families.delete',
		{ id },
		'completed',
	);
	return output;
};

export const listNotes: ChMeetingsEndpoints['notesList'] = async (
	ctx,
	input,
) => {
	const query = NotesListInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(
		`people/${sid(query.person_id)}/notes`,
		ctx.key,
		{
			query: {
				page: query.page ?? 1,
				page_size: query.page_size ?? 100,
			},
		},
	);
	const output = unwrapList(raw, NoteSchema);
	await logEventFromContext(ctx, 'chmeetings.notes.list', query, 'completed');
	return output;
};
