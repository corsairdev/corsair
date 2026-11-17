import type { TalentHREndpoints } from '..';
import { call } from './call';
import {
	DeletedResponseSchema,
	ListInputSchema,
	NamedObjectCreateInputSchema,
	NamedObjectIdInputSchema,
	NamedObjectListResponseSchema,
	NamedObjectResponseSchema,
	NamedObjectUpdateInputSchema,
} from './types';

// Divisions, departments, locations and job titles all answer the same
// `{ id, name, object_type }` record, so one set of handlers serves all four
// collections and only the path differs.

export const divisionsList: TalentHREndpoints['divisionsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'divisions.list',
			input: ListInputSchema,
			output: NamedObjectListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/divisions' }),
	);
};

export const divisionsGet: TalentHREndpoints['divisionsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'divisions.get',
			input: NamedObjectIdInputSchema,
			output: NamedObjectResponseSchema,
		},
		input,
		(parsed) => ({ method: 'GET', path: `/divisions/${parsed.id}` }),
	);
};

export const divisionsCreate: TalentHREndpoints['divisionsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'divisions.create',
			input: NamedObjectCreateInputSchema,
			output: NamedObjectResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/divisions',
			body: { name: parsed.name },
		}),
	);
};

export const divisionsUpdate: TalentHREndpoints['divisionsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'divisions.update',
			input: NamedObjectUpdateInputSchema,
			output: NamedObjectResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/divisions/${parsed.id}`,
			body: { name: parsed.name },
		}),
	);
};

export const divisionsRemove: TalentHREndpoints['divisionsRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'divisions.remove',
			input: NamedObjectIdInputSchema,
			output: DeletedResponseSchema,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: `/divisions/${parsed.id}` }),
	);
};

export const departmentsList: TalentHREndpoints['departmentsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'departments.list',
			input: ListInputSchema,
			output: NamedObjectListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/departments' }),
	);
};

export const departmentsCreate: TalentHREndpoints['departmentsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'departments.create',
			input: NamedObjectCreateInputSchema,
			output: NamedObjectResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/departments',
			body: { name: parsed.name },
		}),
	);
};

export const departmentsRemove: TalentHREndpoints['departmentsRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'departments.remove',
			input: NamedObjectIdInputSchema,
			output: DeletedResponseSchema,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: `/departments/${parsed.id}` }),
	);
};

export const locationsList: TalentHREndpoints['locationsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'locations.list',
			input: ListInputSchema,
			output: NamedObjectListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/locations' }),
	);
};

export const jobTitlesList: TalentHREndpoints['jobTitlesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'jobTitles.list',
			input: ListInputSchema,
			output: NamedObjectListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/job-titles' }),
	);
};
