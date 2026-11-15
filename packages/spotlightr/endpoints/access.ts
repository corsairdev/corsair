import type { SpotlightrEndpoints } from '..';
import { call, flag } from './call';
import {
	SpotlightrEndpointInputSchemas,
	SpotlightrEndpointOutputSchemas,
} from './types';

export const listDomains: SpotlightrEndpoints['domainsList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: SpotlightrEndpointInputSchemas.listDomains,
			output: SpotlightrEndpointOutputSchemas.listDomains,
		},
		input,
		() => ({ method: 'GET', path: 'api/user/domain' }),
		{ log: (_parsed, result) => ({ domains: result.length }) },
	);

export const addDomain: SpotlightrEndpoints['domainsAdd'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.add',
			input: SpotlightrEndpointInputSchemas.addDomain,
			output: SpotlightrEndpointOutputSchemas.addDomain,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'api/user/domain',
			formData: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);

export const createStudent: SpotlightrEndpoints['studentsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'students.create',
			input: SpotlightrEndpointInputSchemas.createStudent,
			output: SpotlightrEndpointOutputSchemas.createStudent,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'spotlight/students',
			formData: {
				email: parsed.email,
				password: parsed.password,
				id: String(parsed.course_id),
				never: String(flag(parsed.never)),
				unlocks: String(parsed.unlocks),
				time: String(parsed.time),
				expires: parsed.expires,
			},
		}),
		{
			log: (parsed) => ({
				course_id: parsed.course_id,
				never: parsed.never,
			}),
		},
	);

export const getAccess: SpotlightrEndpoints['accessGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'access.get',
			input: SpotlightrEndpointInputSchemas.getAccess,
			output: SpotlightrEndpointOutputSchemas.getAccess,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'access',
			query: { email: parsed.email, 'Course ID': parsed.course_id },
		}),
		{ log: (parsed) => ({ course_id: parsed.course_id }) },
	);

export const updateAccess: SpotlightrEndpoints['accessUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'access.update',
			input: SpotlightrEndpointInputSchemas.updateAccess,
			output: SpotlightrEndpointOutputSchemas.updateAccess,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'access',
			formData: {
				id: String(parsed.access_id),
				expire: String(flag(parsed.expire)),
			},
		}),
		{ log: (parsed) => ({ access_id: parsed.access_id }) },
	);

export const updateAccessCode: SpotlightrEndpoints['accessUpdateCode'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'access.updateCode',
			input: SpotlightrEndpointInputSchemas.updateAccessCode,
			output: SpotlightrEndpointOutputSchemas.updateAccessCode,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'spotlight/updateCode',
			formData: {
				id: String(parsed.code_id),
				expires: String(flag(parsed.expires)),
			},
		}),
		{ log: (parsed) => ({ code_id: parsed.code_id }) },
	);
