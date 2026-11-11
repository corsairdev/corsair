import type { OnedeskEndpoints } from '..';
import { call } from './call';
import { updateCode, withNextOffset } from './shape';
import {
	OnedeskEndpointInputSchemas as Inputs,
	OnedeskEndpointOutputSchemas as Outputs,
} from './types';

/**
 * OneDesk has no single list endpoint: every resource is filtered through a
 * POST with a comparison body, and the id variant returns only external ids.
 * `filter` and `filterDetails` therefore share their input shape and differ
 * only in the response, which is why they are generated together here.
 */

// ── items ─────────────────────────────────────────────────────────────────

export const itemsFilter: OnedeskEndpoints['itemsFilter'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.filter',
			input: Inputs.itemsFilter,
			output: Outputs.itemsFilter,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/items/filter',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const itemsFilterDetails: OnedeskEndpoints['itemsFilterDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'items.filterDetails',
			input: Inputs.itemsFilterDetails,
			output: Outputs.itemsFilterDetails,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/items/filter/details',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const itemsGet: OnedeskEndpoints['itemsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.get',
			input: Inputs.itemsGet,
			output: Outputs.itemsGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/items/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: {
						method: 'GET',
						path: `/items/id/${parsed.id}`,
					},
	);

export const itemsCreate: OnedeskEndpoints['itemsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.create',
			input: Inputs.itemsCreate,
			output: Outputs.itemsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/items/', body: parsed }),
		{
			log: (_, result) => ({
				externalId: result.data ?? undefined,
			}),
		},
	);

export const itemsUpdate: OnedeskEndpoints['itemsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.update',
			input: Inputs.itemsUpdate,
			output: Outputs.itemsUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/items/externalId/${encodeURIComponent(externalId)}`
				: `/items/id/${id}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);

// ── users ─────────────────────────────────────────────────────────────────

export const usersFilter: OnedeskEndpoints['usersFilter'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.filter',
			input: Inputs.usersFilter,
			output: Outputs.usersFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/users/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const usersFilterDetails: OnedeskEndpoints['usersFilterDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.filterDetails',
			input: Inputs.usersFilterDetails,
			output: Outputs.usersFilterDetails,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/users/filter/details',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const usersGet: OnedeskEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/users/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: { method: 'GET', path: `/users/id/${parsed.id}` },
	);

export const usersCreate: OnedeskEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/users/', body: parsed }),
		{
			log: (_, result) => ({
				externalId: result.data ?? undefined,
			}),
		},
	);

export const usersUpdate: OnedeskEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/users/externalId/${encodeURIComponent(externalId)}`
				: `/users/id/${id}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);

// ── projects ──────────────────────────────────────────────────────────────

export const projectsFilter: OnedeskEndpoints['projectsFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.filter',
			input: Inputs.projectsFilter,
			output: Outputs.projectsFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/projects/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const projectsFilterDetails: OnedeskEndpoints['projectsFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'projects.filterDetails',
				input: Inputs.projectsFilterDetails,
				output: Outputs.projectsFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/projects/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const projectsGet: OnedeskEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/projects/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: { method: 'GET', path: `/projects/id/${parsed.id}` },
	);

export const projectsCreate: OnedeskEndpoints['projectsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/projects/', body: parsed }),
		{
			// The submitted name is the customer's own text and does not belong in
			// the event log; the new record's id is what identifies it.
			log: (_, result) => ({
				externalId: result.data ?? undefined,
			}),
		},
	);

export const projectsUpdate: OnedeskEndpoints['projectsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/projects/externalId/${encodeURIComponent(externalId)}`
				: `/projects/id/${id}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);

// ── portfolios ────────────────────────────────────────────────────────────

export const portfoliosFilter: OnedeskEndpoints['portfoliosFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'portfolios.filter',
			input: Inputs.portfoliosFilter,
			output: Outputs.portfoliosFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/portfolios/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const portfoliosFilterDetails: OnedeskEndpoints['portfoliosFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'portfolios.filterDetails',
				input: Inputs.portfoliosFilterDetails,
				output: Outputs.portfoliosFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/portfolios/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const portfoliosGet: OnedeskEndpoints['portfoliosGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'portfolios.get',
			input: Inputs.portfoliosGet,
			output: Outputs.portfoliosGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/portfolios/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

export const portfoliosCreate: OnedeskEndpoints['portfoliosCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'portfolios.create',
			input: Inputs.portfoliosCreate,
			output: Outputs.portfoliosCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/portfolios/', body: parsed }),
		{
			// The submitted name is the customer's own text and does not belong in
			// the event log; the new record's id is what identifies it.
			log: (_, result) => ({
				externalId: result.data ?? undefined,
			}),
		},
	);

export const portfoliosUpdate: OnedeskEndpoints['portfoliosUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'portfolios.update',
			input: Inputs.portfoliosUpdate,
			output: Outputs.portfoliosUpdate,
		},
		input,
		({ externalId, ...body }) => ({
			method: 'POST',
			path: `/portfolios/externalId/${encodeURIComponent(externalId)}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({ externalId: parsed.externalId }),
		},
	);

// ── teams ─────────────────────────────────────────────────────────────────

export const teamsFilter: OnedeskEndpoints['teamsFilter'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.filter',
			input: Inputs.teamsFilter,
			output: Outputs.teamsFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/teams/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const teamsFilterDetails: OnedeskEndpoints['teamsFilterDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'teams.filterDetails',
			input: Inputs.teamsFilterDetails,
			output: Outputs.teamsFilterDetails,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/teams/filter/details',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const teamsGet: OnedeskEndpoints['teamsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.get',
			input: Inputs.teamsGet,
			output: Outputs.teamsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/teams/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

export const teamsCreate: OnedeskEndpoints['teamsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.create',
			input: Inputs.teamsCreate,
			output: Outputs.teamsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/teams/', body: parsed }),
		{
			// The submitted name is the customer's own text and does not belong in
			// the event log; the new record's id is what identifies it.
			log: (_, result) => ({
				externalId: result.data ?? undefined,
			}),
		},
	);

export const teamsUpdate: OnedeskEndpoints['teamsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.update',
			input: Inputs.teamsUpdate,
			output: Outputs.teamsUpdate,
		},
		input,
		({ externalId, ...body }) => ({
			method: 'POST',
			path: `/teams/externalId/${encodeURIComponent(externalId)}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({ externalId: parsed.externalId }),
		},
	);

// ── invoices ──────────────────────────────────────────────────────────────

export const invoicesFilter: OnedeskEndpoints['invoicesFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'invoices.filter',
			input: Inputs.invoicesFilter,
			output: Outputs.invoicesFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/invoices/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const invoicesFilterDetails: OnedeskEndpoints['invoicesFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'invoices.filterDetails',
				input: Inputs.invoicesFilterDetails,
				output: Outputs.invoicesFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/invoices/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const invoicesGet: OnedeskEndpoints['invoicesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/invoices/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: { method: 'GET', path: `/invoices/id/${parsed.id}` },
	);

export const invoicesUpdate: OnedeskEndpoints['invoicesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'invoices.update',
			input: Inputs.invoicesUpdate,
			output: Outputs.invoicesUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/invoices/externalId/${encodeURIComponent(externalId)}`
				: `/invoices/id/${id}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);

// ── quotes ────────────────────────────────────────────────────────────────

export const quotesFilter: OnedeskEndpoints['quotesFilter'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'quotes.filter',
			input: Inputs.quotesFilter,
			output: Outputs.quotesFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/quotes/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const quotesFilterDetails: OnedeskEndpoints['quotesFilterDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'quotes.filterDetails',
			input: Inputs.quotesFilterDetails,
			output: Outputs.quotesFilterDetails,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/quotes/filter/details',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const quotesGet: OnedeskEndpoints['quotesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'quotes.get',
			input: Inputs.quotesGet,
			output: Outputs.quotesGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/quotes/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: { method: 'GET', path: `/quotes/id/${encodeURIComponent(String(parsed.id))}` },
	);

export const quotesUpdate: OnedeskEndpoints['quotesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'quotes.update',
			input: Inputs.quotesUpdate,
			output: Outputs.quotesUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/quotes/externalId/${encodeURIComponent(externalId)}`
				: `/quotes/id/${encodeURIComponent(String(id))}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);
