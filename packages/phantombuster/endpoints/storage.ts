import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	DeleteLeadObjectsInput,
	DeleteLeadObjectsResponse,
	SaveCompanyObjectInput,
	SaveCompanyObjectResponse,
	SaveLeadObjectInput,
	SaveLeadObjectResponse,
	SaveManyCompanyObjectsInput,
	SaveManyCompanyObjectsResponse,
	SaveManyLeadObjectsInput,
	SaveManyLeadObjectsResponse,
	SearchCompanyObjectsInput,
	SearchCompanyObjectsResponse,
	SearchLeadObjectsInput,
	SearchLeadObjectsResponse,
} from './types';

export const saveLeadObject = async (
	ctx: PhantomBusterContext,
	input: SaveLeadObjectInput,
): Promise<SaveLeadObjectResponse> => {
	const response = await makePhantomBusterRequest<SaveLeadObjectResponse>(
		'/org-storage/leads-objects/save',
		ctx.key,
		{
			method: 'POST',
			body: { ...input, properties: { ...input.properties } },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.saveLeadObject',
		{},
		'completed',
	);

	return response;
};

export const saveManyLeadObjects = async (
	ctx: PhantomBusterContext,
	input: SaveManyLeadObjectsInput,
): Promise<SaveManyLeadObjectsResponse> => {
	const response = await makePhantomBusterRequest<SaveManyLeadObjectsResponse>(
		'/org-storage/leads-objects/save-many',
		ctx.key,
		{
			method: 'POST',
			body: {
				objects: input.objects.map((object) => ({
					...object,
					properties: { ...object.properties },
				})),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.saveManyLeadObjects',
		{ count: input.objects.length },
		'completed',
	);

	return response;
};

export const deleteLeadObjects = async (
	ctx: PhantomBusterContext,
	input: DeleteLeadObjectsInput,
): Promise<DeleteLeadObjectsResponse> => {
	const response = await makePhantomBusterRequest<DeleteLeadObjectsResponse>(
		'/org-storage/leads-objects/delete',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.deleteLeadObjects',
		{},
		'completed',
	);

	return response;
};

export const searchLeadObjects = async (
	ctx: PhantomBusterContext,
	input: SearchLeadObjectsInput,
): Promise<SearchLeadObjectsResponse> => {
	const response = await makePhantomBusterRequest<SearchLeadObjectsResponse>(
		'/org-storage/leads-objects/search',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.searchLeadObjects',
		{},
		'completed',
	);

	return response;
};

export const saveCompanyObject = async (
	ctx: PhantomBusterContext,
	input: SaveCompanyObjectInput,
): Promise<SaveCompanyObjectResponse> => {
	const response = await makePhantomBusterRequest<SaveCompanyObjectResponse>(
		'/org-storage/companies-objects/save',
		ctx.key,
		{
			method: 'POST',
			body: { ...input, properties: { ...input.properties } },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.saveCompanyObject',
		{},
		'completed',
	);

	return response;
};

export const saveManyCompanyObjects = async (
	ctx: PhantomBusterContext,
	input: SaveManyCompanyObjectsInput,
): Promise<SaveManyCompanyObjectsResponse> => {
	const response =
		await makePhantomBusterRequest<SaveManyCompanyObjectsResponse>(
			'/org-storage/companies-objects/save-many',
			ctx.key,
			{
				method: 'POST',
				body: {
					objects: input.objects.map((object) => ({
						...object,
						properties: { ...object.properties },
					})),
				},
			},
		);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.saveManyCompanyObjects',
		{ count: input.objects.length },
		'completed',
	);

	return response;
};

export const searchCompanyObjects = async (
	ctx: PhantomBusterContext,
	input: SearchCompanyObjectsInput,
): Promise<SearchCompanyObjectsResponse> => {
	const response = await makePhantomBusterRequest<SearchCompanyObjectsResponse>(
		'/org-storage/companies-objects/search',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.storage.searchCompanyObjects',
		{},
		'completed',
	);

	return response;
};
