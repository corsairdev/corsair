import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

// The access-control guide fetches rentals both singly
// (sg.get('unit-rentals', unitRentalId, { include: 'owner,unit,customFields' }))
// and in batch (sg.get('unit-rentals', { ids, include: 'unit,customFields' })).
export const list: StoreganiseEndpoints['unitRentalsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'unitRentals.list',
			input: Inputs.unitRentalsList,
			output: Outputs.unitRentalsList,
		},
		input,
		({ ids, include }, base) => ({
			method: 'GET',
			base,
			path: '/admin/unit-rentals',
			query: { ids: ids?.join(','), include },
		}),
		{
			log: (_, rentals) => ({ count: rentals.length }),
		},
	);

export const get: StoreganiseEndpoints['unitRentalsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'unitRentals.get',
			input: Inputs.unitRentalsGet,
			output: Outputs.unitRentalsGet,
		},
		input,
		({ unitRentalId, include }, base) => ({
			method: 'GET',
			base,
			path: `/admin/unit-rentals/${encodeURIComponent(unitRentalId)}`,
			query: { include },
		}),
		{
			log: (_, rental) => ({ unitRentalId: rental.id }),
		},
	);

// The documented write: sg.put('unit-rentals', rental.id,
// { customFields: { myAC_accessCode: value } }). Access-control
// integrations store access codes and overlock flags under prefixed keys.
export const update: StoreganiseEndpoints['unitRentalsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'unitRentals.update',
			input: Inputs.unitRentalsUpdate,
			output: Outputs.unitRentalsUpdate,
		},
		input,
		({ unitRentalId, customFields }, base) => ({
			method: 'PUT',
			base,
			path: `/admin/unit-rentals/${encodeURIComponent(unitRentalId)}`,
			body: { customFields },
		}),
		{
			log: (_, rental) => ({ unitRentalId: rental.id }),
		},
	);
