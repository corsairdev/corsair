import type { GoogleAdminEndpoints } from '..';
import { orgUnitSegment, segment } from '../client';
import { call, pageCount } from './call';
import {
	GoogleAdminEndpointInputSchemas as Inputs,
	GoogleAdminEndpointOutputSchemas as Outputs,
} from './types';

export const list: GoogleAdminEndpoints['orgUnitsList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'orgunits.list',
			input: Inputs.orgUnitsList,
			output: Outputs.orgUnitsList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/customer/${segment(input.customerId)}/orgunits`,
			query: {
				orgUnitPath: input.orgUnitPath ?? undefined,
				type: input.type ?? undefined,
			},
		}),
		(result) => pageCount(result.organizationUnits),
	);

export const get: GoogleAdminEndpoints['orgUnitsGet'] = async (ctx, rawInput) =>
	call(
		ctx,
		{
			event: 'orgunits.get',
			input: Inputs.orgUnitsGet,
			output: Outputs.orgUnitsGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/customer/${segment(input.customerId)}/orgunits/${orgUnitSegment(input.orgUnitPath)}`,
		}),
	);

export const insert: GoogleAdminEndpoints['orgUnitsInsert'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'orgunits.insert',
			input: Inputs.orgUnitsInsert,
			output: Outputs.orgUnitsInsert,
		},
		rawInput,
		(input) => {
			const { customerId, ...body } = input;
			return {
				method: 'POST',
				path: `/customer/${segment(customerId)}/orgunits`,
				body,
			};
		},
	);

/** orgunits.patch is the documented patch-semantics method; see groups.update. */
export const update: GoogleAdminEndpoints['orgUnitsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'orgunits.update',
			input: Inputs.orgUnitsUpdate,
			output: Outputs.orgUnitsUpdate,
		},
		rawInput,
		(input) => {
			const { customerId, orgUnitPath, ...body } = input;
			return {
				method: 'PATCH',
				path: `/customer/${segment(customerId)}/orgunits/${orgUnitSegment(orgUnitPath)}`,
				body,
			};
		},
	);

export const remove: GoogleAdminEndpoints['orgUnitsDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'orgunits.delete',
			input: Inputs.orgUnitsDelete,
			output: Outputs.orgUnitsDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/customer/${segment(input.customerId)}/orgunits/${orgUnitSegment(input.orgUnitPath)}`,
		}),
	);
