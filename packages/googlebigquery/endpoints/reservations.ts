import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const list: GoogleBigqueryEndpoints['reservationsList'] = async (
	ctx,
	input,
) => {
	const { projectId, location, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['reservationsList']
	>(`/projects/${projectId}/locations/${location}/reservations`, ctx, {
		method: 'GET',
		host: 'reservation',
		query,
	});

	await logEventFromContext(
		ctx,
		'googlebigquery.reservations.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GoogleBigqueryEndpoints['reservationsCreate'] = async (
	ctx,
	input,
) => {
	const { projectId, location, reservationId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['reservationsCreate']
	>(`/projects/${projectId}/locations/${location}/reservations`, ctx, {
		method: 'POST',
		host: 'reservation',
		query: { reservationId },
		body,
	});

	await logEventFromContext(
		ctx,
		'googlebigquery.reservations.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const listGroups: GoogleBigqueryEndpoints['reservationsListGroups'] =
	async (ctx, input) => {
		const { projectId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['reservationsListGroups']
		>(`/projects/${projectId}/locations/${location}/reservationGroups`, ctx, {
			method: 'GET',
			host: 'reservation',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.reservations.listGroups',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listAssignments: GoogleBigqueryEndpoints['reservationsListAssignments'] =
	async (ctx, input) => {
		const { projectId, location, reservationId, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['reservationsListAssignments']
		>(
			`/projects/${projectId}/locations/${location}/reservations/${reservationId}/assignments`,
			ctx,
			{ method: 'GET', host: 'reservation', query },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.reservations.listAssignments',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createAssignment: GoogleBigqueryEndpoints['reservationsCreateAssignment'] =
	async (ctx, input) => {
		const { projectId, location, reservationId, ...body } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['reservationsCreateAssignment']
		>(
			`/projects/${projectId}/locations/${location}/reservations/${reservationId}/assignments`,
			ctx,
			{ method: 'POST', host: 'reservation', body },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.reservations.createAssignment',
			{ ...input },
			'completed',
		);
		return result;
	};

export const searchAllAssignments: GoogleBigqueryEndpoints['reservationsSearchAllAssignments'] =
	async (ctx, input) => {
		const { projectId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['reservationsSearchAllAssignments']
		>(`/projects/${projectId}/locations/${location}/assignments:search`, ctx, {
			method: 'GET',
			host: 'reservation',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.reservations.searchAllAssignments',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listCapacityCommitments: GoogleBigqueryEndpoints['reservationsListCapacityCommitments'] =
	async (ctx, input) => {
		const { projectId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['reservationsListCapacityCommitments']
		>(`/projects/${projectId}/locations/${location}/capacityCommitments`, ctx, {
			method: 'GET',
			host: 'reservation',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.reservations.listCapacityCommitments',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createCapacityCommitment: GoogleBigqueryEndpoints['reservationsCreateCapacityCommitment'] =
	async (ctx, input) => {
		const { projectId, location, enforceSingleAdminProjectPerOrg, ...body } =
			input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['reservationsCreateCapacityCommitment']
		>(`/projects/${projectId}/locations/${location}/capacityCommitments`, ctx, {
			method: 'POST',
			host: 'reservation',
			query: { enforceSingleAdminProjectPerOrg },
			body,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.reservations.createCapacityCommitment',
			{ ...input },
			'completed',
		);
		return result;
	};
