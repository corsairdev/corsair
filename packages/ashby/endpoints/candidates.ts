import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	CandidateAddTagResponse,
	CandidateAnonymizeResponse,
	CandidateCreateNoteResponse,
	CandidateCreateResponse,
	CandidateInfoResponse,
	CandidateListNotesResponse,
	CandidateListResponse,
	CandidateRemoveTagResponse,
	CandidateSearchResponse,
	CandidateUpdateResponse,
} from './types';

export const info: AshbyEndpoints['candidate.info'] = async (ctx, input) => {
	return await ashbyCall<CandidateInfoResponse>(ctx, 'candidate.info', {
		candidateId: input.candidateId,
	});
};

export const list: AshbyEndpoints['candidate.list'] = async (ctx, input) => {
	return await ashbyCall<CandidateListResponse>(ctx, 'candidate.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		createdAfter: input.createdAfter,
		updatedAfter: input.updatedAfter,
	});
};

export const search: AshbyEndpoints['candidate.search'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateSearchResponse>(ctx, 'candidate.search', {
		email: input.email,
		name: input.name,
		phone: input.phone,
	});
};

export const create: AshbyEndpoints['candidate.create'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateCreateResponse>(ctx, 'candidate.create', {
		name: input.name,
		email: input.email,
		phoneNumber: input.phoneNumber,
		socialLinks: input.socialLinks,
		tags: input.tags,
		customFields: input.customFields,
		notes: input.notes,
	});
};

export const update: AshbyEndpoints['candidate.update'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateUpdateResponse>(ctx, 'candidate.update', {
		candidateId: input.candidateId,
		name: input.name,
		primaryEmailAddress: input.primaryEmailAddress,
		primaryPhoneNumber: input.primaryPhoneNumber,
		tags: input.tags,
		customFields: input.customFields,
	});
};

export const addTag: AshbyEndpoints['candidate.addTag'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateAddTagResponse>(ctx, 'candidate.addTag', {
		candidateId: input.candidateId,
		tag: input.tag,
	});
};

export const removeTag: AshbyEndpoints['candidate.removeTag'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateRemoveTagResponse>(
		ctx,
		'candidate.removeTag',
		{
			candidateId: input.candidateId,
			tag: input.tag,
		},
	);
};

export const createNote: AshbyEndpoints['candidate.createNote'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateCreateNoteResponse>(
		ctx,
		'candidate.createNote',
		{
			candidateId: input.candidateId,
			note: input.note,
		},
	);
};

export const listNotes: AshbyEndpoints['candidate.listNotes'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateListNotesResponse>(
		ctx,
		'candidate.listNotes',
		{
			candidateId: input.candidateId,
		},
	);
};

export const anonymize: AshbyEndpoints['candidate.anonymize'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CandidateAnonymizeResponse>(
		ctx,
		'candidate.anonymize',
		{
			candidateId: input.candidateId,
		},
	);
};
