import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const listCarrierTemplates: ShippoEndpoints['carrierParcelTemplatesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'parcelTemplates.listCarrier',
				input: Inputs.carrierParcelTemplatesList,
				output: Outputs.carrierParcelTemplatesList,
			},
			input,
			({ shippo_account_id }) => ({
				method: 'GET',
				path: '/parcel-templates',
				shippoAccountId: shippo_account_id,
			}),
			{
				log: (_, result) => ({ count: result.results.length }),
			},
		);

export const getCarrierTemplate: ShippoEndpoints['carrierParcelTemplatesGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'parcelTemplates.getCarrier',
				input: Inputs.carrierParcelTemplatesGet,
				output: Outputs.carrierParcelTemplatesGet,
			},
			input,
			({ carrier_parcel_template_token, shippo_account_id }) => ({
				method: 'GET',
				path: `/parcel-templates/${segment(carrier_parcel_template_token)}`,
				shippoAccountId: shippo_account_id,
			}),
			{
				log: ({ carrier_parcel_template_token }) => ({
					template: carrier_parcel_template_token,
				}),
			},
		);

export const list: ShippoEndpoints['userParcelTemplatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'parcelTemplates.list',
			input: Inputs.userParcelTemplatesList,
			output: Outputs.userParcelTemplatesList,
		},
		input,
		({ shippo_account_id }) => ({
			method: 'GET',
			path: '/user-parcel-templates',
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['userParcelTemplatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'parcelTemplates.get',
			input: Inputs.userParcelTemplatesGet,
			output: Outputs.userParcelTemplatesGet,
		},
		input,
		({ user_parcel_template_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/user-parcel-templates/${segment(user_parcel_template_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ user_parcel_template_id }) => ({
				templateId: user_parcel_template_id,
			}),
		},
	);

export const create: ShippoEndpoints['userParcelTemplatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'parcelTemplates.create',
			input: Inputs.userParcelTemplatesCreate,
			output: Outputs.userParcelTemplatesCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/user-parcel-templates',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ templateId: result.object_id ?? undefined }),
		},
	);

export const update: ShippoEndpoints['userParcelTemplatesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'parcelTemplates.update',
			input: Inputs.userParcelTemplatesUpdate,
			output: Outputs.userParcelTemplatesUpdate,
		},
		input,
		({ user_parcel_template_id, shippo_account_id, ...body }) => ({
			method: 'PUT',
			path: `/user-parcel-templates/${segment(user_parcel_template_id)}`,
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ user_parcel_template_id }) => ({
				templateId: user_parcel_template_id,
			}),
		},
	);

/** `remove` because `delete` is reserved; registered under `delete`. */
export const remove: ShippoEndpoints['userParcelTemplatesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'parcelTemplates.delete',
			input: Inputs.userParcelTemplatesDelete,
			output: Outputs.userParcelTemplatesDelete,
		},
		input,
		({ user_parcel_template_id, shippo_account_id }) => ({
			method: 'DELETE',
			path: `/user-parcel-templates/${segment(user_parcel_template_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ user_parcel_template_id }) => ({
				templateId: user_parcel_template_id,
			}),
		},
	);
