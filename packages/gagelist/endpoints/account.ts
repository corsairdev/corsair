import type { GagelistEndpoints } from '..';
import { segment } from '../client';
import { call, listShape } from './call';
import {
	GagelistEndpointInputSchemas as Inputs,
	GagelistEndpointOutputSchemas as Outputs,
} from './types';

const DEFAULT_PAGE = 50;

export const manufacturers: GagelistEndpoints['manufacturersList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'manufacturers.list',
			input: Inputs.manufacturersList,
			output: Outputs.manufacturersList,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Manufacturer/List',
			// A read, even though it is a POST.
			replayable: true,
			body: {
				start: parsed.start ?? 0,
				record_number: parsed.record_number ?? DEFAULT_PAGE,
			},
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed, DEFAULT_PAGE),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const manufacturersCreate: GagelistEndpoints['manufacturersCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'manufacturers.create',
			input: Inputs.manufacturersCreate,
			output: Outputs.manufacturersCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Manufacturer/Create',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ manufacturerId: result.data }) },
	);

export const manufacturersUpdate: GagelistEndpoints['manufacturersUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'manufacturers.update',
			input: Inputs.manufacturersUpdate,
			output: Outputs.manufacturersUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Manufacturer/Update',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: ({ Id }) => ({ manufacturerId: Id }) },
	);

export const manufacturersRemove: GagelistEndpoints['manufacturersRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'manufacturers.delete',
			input: Inputs.manufacturersRemove,
			output: Outputs.manufacturersRemove,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/GageList/api/Manufacturer/Delete/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ manufacturerId: id }) },
	);

export const customFields: GagelistEndpoints['customFieldsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customFields.list',
			input: Inputs.customFieldsList,
			output: Outputs.customFieldsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/GageList/api/CustomField/GetCustomFields',
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

// This route takes a bare JSON array, not the `{ data: ... }` object every
// other write uses, so the body is the array itself.
export const customFieldValues: GagelistEndpoints['customFieldValuesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customFields.updateValues',
			input: Inputs.customFieldValuesUpdate,
			output: Outputs.customFieldValuesUpdate,
		},
		input,
		({ values }) => ({
			method: 'POST',
			path: '/GageList/api/CustomField/UpdateCustomValues',
			body: values,
		}),
		{
			log: (parsed, result) => ({
				submitted: parsed.values.length,
				updated: result.data?.length ?? 0,
			}),
		},
	);

export const accountStatus: GagelistEndpoints['accountStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.status',
			input: Inputs.accountStatus,
			output: Outputs.accountStatus,
		},
		input,
		() => ({ method: 'GET', path: '/GageList/api/Account/Status' }),
		{
			log: (_, result) => ({
				totalGages: result.data.TotalGages ?? undefined,
				maxGages: result.data.MaxGages ?? undefined,
				pastDue: result.data.GagesPastDue ?? undefined,
			}),
		},
	);
