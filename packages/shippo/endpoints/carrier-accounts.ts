import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['carrierAccountsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'carrierAccounts.list',
			input: Inputs.carrierAccountsList,
			output: Outputs.carrierAccountsList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/carrier_accounts',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['carrierAccountsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'carrierAccounts.get',
			input: Inputs.carrierAccountsGet,
			output: Outputs.carrierAccountsGet,
		},
		input,
		({ carrier_account_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/carrier_accounts/${segment(carrier_account_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ carrier_account_id }, result) => ({
				carrierAccountId: carrier_account_id,
				carrier: result.carrier ?? undefined,
				active: result.active ?? undefined,
			}),
		},
	);

/**
 * `parameters` carries the carrier's credentials. This plugin never logs them
 * and the caller supplies them; Shippo echoes them back, so the response keeps
 * whatever it sends.
 */
export const create: ShippoEndpoints['carrierAccountsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'carrierAccounts.create',
			input: Inputs.carrierAccountsCreate,
			output: Outputs.carrierAccountsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/carrier_accounts',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				carrierAccountId: result.object_id ?? undefined,
				carrier: parsed.carrier,
				active: result.active ?? undefined,
			}),
		},
	);

export const update: ShippoEndpoints['carrierAccountsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'carrierAccounts.update',
			input: Inputs.carrierAccountsUpdate,
			output: Outputs.carrierAccountsUpdate,
		},
		input,
		({ carrier_account_id, shippo_account_id, ...body }) => ({
			method: 'PUT',
			path: `/carrier_accounts/${segment(carrier_account_id)}`,
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ carrier_account_id }, result) => ({
				carrierAccountId: carrier_account_id,
				active: result.active ?? undefined,
			}),
		},
	);

/** Enrols a Shippo-supplied carrier rather than the caller's own account. */
export const register: ShippoEndpoints['carrierAccountsRegister'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'carrierAccounts.register',
			input: Inputs.carrierAccountsRegister,
			output: Outputs.carrierAccountsRegister,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/carrier_accounts/register/new',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				carrierAccountId: result.object_id ?? undefined,
				carrier: parsed.carrier,
			}),
		},
	);

export const registrationStatus: ShippoEndpoints['carrierAccountsRegistrationStatus'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'carrierAccounts.registrationStatus',
				input: Inputs.carrierAccountsRegistrationStatus,
				output: Outputs.carrierAccountsRegistrationStatus,
			},
			input,
			({ carrier, shippo_account_id }) => ({
				method: 'GET',
				path: '/carrier_accounts/reg-status',
				query: { carrier },
				shippoAccountId: shippo_account_id,
			}),
			{
				log: ({ carrier }, result) => ({
					carrier,
					status: result.status ?? result.registration_status ?? undefined,
				}),
			},
		);
