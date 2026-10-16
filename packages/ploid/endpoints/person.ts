import type { PloidEndpoints } from '../index';
import { rememberPerson } from './cache';
import { callPloid } from './call';
import {
	PersonInputSchema,
	PersonOrRunResponseSchema,
	PersonRunInputSchema,
	PersonRunSchema,
	ResolveInputSchema,
	ResolveResponseSchema,
} from './types';

export const resolve: PloidEndpoints['resolve'] = async (ctx, input) => {
	return callPloid(
		ctx,
		'ploid.person.resolve',
		ResolveInputSchema,
		ResolveResponseSchema,
		input,
		(validated) => ({ method: 'POST', url: '/v1/resolve', body: validated }),
		(_validated, response) => ({
			found: response.data.found,
			confidence: response.data.confidence,
		}),
		async (_validated, response) => {
			const person = response.data.person;
			if (!response.data.found || person === null) return;
			await rememberPerson(ctx, {
				providerId: person.person_id,
				name: person.name,
				headline: person.headline,
				company: person.company,
				location: person.location,
				linkedinUrl: person.profiles?.linkedin ?? undefined,
				githubUrl: person.profiles?.github ?? undefined,
				xUrl: person.profiles?.x ?? undefined,
				identityVerified: person.identity_verified,
				sources: response.data.sources,
			});
		},
	);
};

export const person: PloidEndpoints['person'] = async (ctx, input) => {
	return callPloid(
		ctx,
		'ploid.person.get',
		PersonInputSchema,
		PersonOrRunResponseSchema,
		input,
		(validated) => ({ method: 'POST', url: '/v1/person', body: validated }),
		(_validated, response) => ({
			mode:
				response.data !== null && 'run_id' in response.data ? 'run' : 'profile',
			status:
				response.data !== null && 'run_id' in response.data
					? response.data.status
					: undefined,
			person_id:
				response.data === null || 'run_id' in response.data
					? undefined
					: response.data.person_id,
		}),
		async (_validated, response) => {
			if (response.data === null) return;
			if ('run_id' in response.data) return;
			const providerId = response.data.person_id;
			if (providerId === undefined) return;
			const identity = response.data.identity;
			await rememberPerson(ctx, {
				providerId,
				name: identity?.name,
				headline: identity?.headline,
				company: identity?.company,
				location: identity?.location,
				linkedinUrl: identity?.linkedin_url,
				confidence: identity?.confidence,
				summary: response.data.summary,
			});
		},
	);
};

export const getRun: PloidEndpoints['personRun'] = async (ctx, input) => {
	// The poll answers queued/running state OR the completed reviewed
	// profile; persist the profile so the finished result is cached too.
	return callPloid(
		ctx,
		'ploid.person.getRun',
		PersonRunInputSchema,
		PersonOrRunResponseSchema,
		input,
		(validated) => ({
			method: 'GET',
			url: '/v1/person/runs/{id}',
			path: { id: validated.id },
		}),
		(_validated, response) => ({
			mode:
				response.data !== null && 'run_id' in response.data ? 'run' : 'profile',
			status:
				response.data !== null && 'run_id' in response.data
					? response.data.status
					: undefined,
		}),
		async (_validated, response) => {
			if (response.data === null) return;
			if ('run_id' in response.data) return;
			const providerId = response.data.person_id;
			if (providerId === undefined) return;
			const identity = response.data.identity;
			await rememberPerson(ctx, {
				providerId,
				name: identity?.name,
				headline: identity?.headline,
				company: identity?.company,
				location: identity?.location,
				linkedinUrl: identity?.linkedin_url,
				confidence: identity?.confidence,
				summary: response.data.summary,
			});
		},
	);
};

export const cancelRun: PloidEndpoints['cancelPersonRun'] = async (
	ctx,
	input,
) => {
	return callPloid(
		ctx,
		'ploid.person.cancelRun',
		PersonRunInputSchema,
		PersonRunSchema,
		input,
		(validated) => ({
			method: 'DELETE',
			url: '/v1/person/runs/{id}',
			path: { id: validated.id },
		}),
		(_validated, response) => ({
			run_id: response.data.run_id,
			status: response.data.status,
		}),
	);
};
