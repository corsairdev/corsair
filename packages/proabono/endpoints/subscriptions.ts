import type { ProabonoEndpoints } from '..';
import { asList, call } from './call';
import {
	ProabonoEndpointInputSchemas as Inputs,
	ProabonoEndpointOutputSchemas as Outputs,
} from './types';

export const create: ProabonoEndpoints['subscriptionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.create',
			input: Inputs.subscriptionsCreate,
			output: Outputs.subscriptionsCreate,
		},
		input,
		({
			ReferenceOffer,
			ReferenceCustomer,
			ReferenceCustomerBuyer,
			Metadata,
			EnsureBillable,
			TryStart,
			BillNow,
		}) => ({
			method: 'POST',
			path: '/v1/Subscription',
			// The three switches are query-string parameters, not body fields.
			query: { EnsureBillable, TryStart, BillNow },
			body: {
				ReferenceOffer,
				ReferenceCustomer,
				ReferenceCustomerBuyer,
				Metadata,
			},
		}),
		{
			log: (parsed, result) => ({
				subscriptionId: result.Id ?? undefined,
				state: result.StateSubscription ?? undefined,
				offer: parsed.ReferenceOffer,
			}),
		},
	);

export const get: ProabonoEndpoints['subscriptionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.get',
			input: Inputs.subscriptionsGet,
			output: Outputs.subscriptionsGet,
			emptyValue: () => ({}),
		},
		input,
		({ IdSubscription }) => ({
			method: 'GET',
			path: `/v1/Subscription/${IdSubscription}`,
		}),
		{
			log: (_, result) => ({
				subscriptionId: result.Id ?? undefined,
				state: result.StateSubscription ?? undefined,
			}),
		},
	);

export const list: ProabonoEndpoints['subscriptionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.list',
			input: Inputs.subscriptionsList,
			output: Outputs.subscriptionsList,
			emptyValue: () => ({ subscriptions: [] }),
		},
		input,
		({
			ReferenceCustomer,
			ReferenceOffer,
			ReferenceSegment,
			Page,
			SizePage,
		}) => ({
			method: 'GET',
			path: '/v1/Subscriptions',
			query: {
				ReferenceCustomer,
				ReferenceOffer,
				ReferenceSegment,
				Page,
				SizePage,
			},
		}),
		{
			shape: asList('subscriptions'),
			log: (_, result) => ({ count: result.subscriptions.length }),
		},
	);

/** Each lifecycle action is a POST on its own sub-path and answers the subscription. */
function lifecycle(
	ctx: Parameters<ProabonoEndpoints['subscriptionsStart']>[0],
	action: 'Start' | 'Suspension' | 'Termination',
	// unknown: raw caller input, parsed by the schema call() applies.
	input: unknown, // unknown: see the line above.
) {
	return call(
		ctx,
		{
			event: `subscriptions.${action.toLowerCase()}`,
			input: Inputs.subscriptionsStart,
			output: Outputs.subscriptionsStart,
		},
		input,
		({ IdSubscription }) => ({
			method: 'POST',
			path: `/v1/Subscription/${IdSubscription}/${action}`,
		}),
		{
			log: (parsed, result) => ({
				subscriptionId: parsed.IdSubscription,
				state: result.StateSubscription ?? undefined,
			}),
		},
	);
}

export const start: ProabonoEndpoints['subscriptionsStart'] = (ctx, input) =>
	lifecycle(ctx, 'Start', input);

export const suspend: ProabonoEndpoints['subscriptionsSuspend'] = (
	ctx,
	input,
) => lifecycle(ctx, 'Suspension', input);

export const terminate: ProabonoEndpoints['subscriptionsTerminate'] = (
	ctx,
	input,
) => lifecycle(ctx, 'Termination', input);

export const upgrade: ProabonoEndpoints['subscriptionsUpgrade'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscriptions.upgrade',
			input: Inputs.subscriptionsUpgrade,
			output: Outputs.subscriptionsUpgrade,
		},
		input,
		({ IdSubscription, ReferenceOffer }) => ({
			method: 'POST',
			path: `/v1/Subscription/${IdSubscription}/Upgrade`,
			body: { ReferenceOffer },
		}),
		{
			log: (parsed, result) => ({
				subscriptionId: parsed.IdSubscription,
				state: result.StateSubscription ?? undefined,
			}),
		},
	);

export const updateTerm: ProabonoEndpoints['subscriptionsUpdateTerm'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscriptions.updateTerm',
			input: Inputs.subscriptionsUpdateTerm,
			output: Outputs.subscriptionsUpdateTerm,
		},
		input,
		({ IdSubscription, DateTerm }) => ({
			method: 'POST',
			path: `/v1/Subscription/${IdSubscription}/DateTerm`,
			body: { DateTerm },
		}),
		{
			log: (parsed, result) => ({
				subscriptionId: parsed.IdSubscription,
				state: result.StateSubscription ?? undefined,
			}),
		},
	);
