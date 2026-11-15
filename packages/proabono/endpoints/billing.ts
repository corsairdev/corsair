import type { ProabonoEndpoints } from '..';
import { asList, call } from './call';
import {
	ProabonoEndpointInputSchemas as Inputs,
	ProabonoEndpointOutputSchemas as Outputs,
} from './types';

export const listUsages: ProabonoEndpoints['usagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usages.list',
			input: Inputs.usagesList,
			output: Outputs.usagesList,
			emptyValue: () => ({ usages: [] }),
		},
		input,
		({
			ReferenceCustomer,
			ReferenceFeature,
			IdSubscription,
			Page,
			SizePage,
		}) => ({
			method: 'GET',
			path: '/v1/Usages',
			query: {
				ReferenceCustomer,
				ReferenceFeature,
				IdSubscription,
				Page,
				SizePage,
			},
		}),
		{
			shape: asList('usages'),
			log: (_, result) => ({ count: result.usages.length }),
		},
	);

export const getUsage: ProabonoEndpoints['usagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usages.get',
			input: Inputs.usagesGet,
			output: Outputs.usagesGet,
			emptyValue: () => ({}),
		},
		input,
		// A usage has no id: the customer and the feature identify it.
		({ ReferenceCustomer, ReferenceFeature, IdSubscription }) => ({
			method: 'GET',
			path: '/v1/Usage',
			query: { ReferenceCustomer, ReferenceFeature, IdSubscription },
		}),
		{
			log: (parsed) => ({ feature: parsed.ReferenceFeature }),
		},
	);

export const incrementUsage: ProabonoEndpoints['usagesIncrement'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'usages.increment',
			input: Inputs.usagesIncrement,
			output: Outputs.usagesIncrement,
		},
		input,
		({ EnsureBillable, ...body }) => ({
			method: 'POST',
			path: '/v1/Usage',
			// EnsureBillable is a query parameter; the rest is the usage row.
			query: { EnsureBillable },
			body,
		}),
		{
			log: (parsed, result) => ({
				feature: parsed.ReferenceFeature,
				quantity: result.QuantityCurrent ?? undefined,
			}),
		},
	);

export const updateUsages: ProabonoEndpoints['usagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usages.update',
			input: Inputs.usagesUpdate,
			output: Outputs.usagesUpdate,
		},
		input,
		({ usages }) => ({ method: 'POST', path: '/v1/Usages', body: usages }),
		{
			shape: asList('usages'),
			log: (_, result) => ({ count: result.usages.length }),
		},
	);

export const createBalanceLine: ProabonoEndpoints['balanceLinesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'balanceLines.create',
			input: Inputs.balanceLinesCreate,
			output: Outputs.balanceLinesCreate,
		},
		input,
		({ EnsureBillable, ...body }) => ({
			method: 'POST',
			path: '/v1/BalanceLine',
			// EnsureBillable is a query parameter; the rest is the line.
			query: { EnsureBillable },
			body,
		}),
		{
			log: (_, result) => ({
				amountSubtotal: result.AmountSubtotal ?? undefined,
			}),
		},
	);

export const listBalanceLines: ProabonoEndpoints['balanceLinesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'balanceLines.list',
			input: Inputs.balanceLinesList,
			output: Outputs.balanceLinesList,
			emptyValue: () => ({ balanceLines: [] }),
		},
		input,
		({
			ReferenceCustomer,
			ReferenceSegment,
			ReferenceFeature,
			IdSubscription,
			Page,
			SizePage,
		}) => ({
			method: 'GET',
			path: '/v1/BalanceLines',
			query: {
				ReferenceCustomer,
				ReferenceSegment,
				ReferenceFeature,
				IdSubscription,
				Page,
				SizePage,
			},
		}),
		{
			shape: asList('balanceLines'),
			log: (_, result) => ({ count: result.balanceLines.length }),
		},
	);

export const listInvoices: ProabonoEndpoints['invoicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
			emptyValue: () => ({ invoices: [] }),
		},
		input,
		({ ReferenceCustomer, IdSubscription, Page, SizePage }) => ({
			method: 'GET',
			path: '/v1/Invoices',
			query: { ReferenceCustomer, IdSubscription, Page, SizePage },
		}),
		{
			shape: asList('invoices'),
			log: (_, result) => ({ count: result.invoices.length }),
		},
	);

export const getInvoice: ProabonoEndpoints['invoicesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
			emptyValue: () => ({}),
		},
		input,
		({ IdInvoice }) => ({ method: 'GET', path: `/v1/Invoice/${IdInvoice}` }),
		{ log: (_, result) => ({ invoiceId: result.Id ?? undefined }) },
	);
