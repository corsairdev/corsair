import type { FollowUpBossContext } from '..';
import type { FollowUpBossQuery } from '../client';
import { segment } from '../client';
import {
	AutomationsInputSchemas as Inputs,
	AutomationsOutputSchemas as Outputs,
} from './automations-types';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import type { FollowUpBossEndpointInputs } from './registry';

// ── automations ────────────────────────────────────────────────────────────

export const Automations = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['automationsList'],
	) =>
		call(
			ctx,
			{
				event: 'automations.list',
				input: Inputs.automationsList,
				output: Outputs.automationsList,
			},
			input,
			(query) => ({ method: 'GET', path: '/automations', query }),
			{
				shape: (raw) => ({
					automations: envelopeMany(raw, 'automations'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.automations.length }),
			},
		),

	get: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['automationsGet'],
	) =>
		call(
			ctx,
			{
				event: 'automations.get',
				input: Inputs.automationsGet,
				output: Outputs.automationsGet,
			},
			input,
			({ id }) => ({ method: 'GET', path: `/automations/${segment(id)}` }),
			{
				// A single fetch arrives as `{ automations: [automation] }` or the
				// bare automation.
				shape: (raw) => envelopeOne(raw, 'automations'),
				log: ({ id }) => ({ automationId: id }),
			},
		),
};

// ── automations people ─────────────────────────────────────────────────────

export const AutomationsPeople = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['automationsPeopleList'],
	) =>
		call(
			ctx,
			{
				event: 'automationsPeople.list',
				input: Inputs.automationsPeopleList,
				output: Outputs.automationsPeopleList,
			},
			input,
			(query) => ({ method: 'GET', path: '/automationsPeople', query }),
			{
				shape: (raw) => ({
					automationsPeople: envelopeMany(raw, 'automationsPeople'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.automationsPeople.length }),
			},
		),

	create: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['automationsPeopleCreate'],
	) =>
		call(
			ctx,
			{
				event: 'automationsPeople.create',
				input: Inputs.automationsPeopleCreate,
				output: Outputs.automationsPeopleCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/automationsPeople', body }),
			{
				shape: (raw) => envelopeOne(raw, 'automationsPeople') ?? {},
				log: (_, result) => ({
					automationPersonId: result.id ?? undefined,
				}),
			},
		),

	update: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['automationsPeopleUpdate'],
	) =>
		call(
			ctx,
			{
				event: 'automationsPeople.update',
				input: Inputs.automationsPeopleUpdate,
				output: Outputs.automationsPeopleUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/automationsPeople/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'automationsPeople') ?? {},
				log: ({ id }) => ({ automationPersonId: id }),
			},
		),

	get: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['automationsPeopleGet'],
	) =>
		call(
			ctx,
			{
				event: 'automationsPeople.get',
				input: Inputs.automationsPeopleGet,
				output: Outputs.automationsPeopleGet,
			},
			input,
			({ id }) => ({
				method: 'GET',
				path: `/automationsPeople/${segment(id)}`,
			}),
			{
				// A single fetch arrives bare or as the one-element envelope.
				shape: (raw) => envelopeOne(raw, 'automationsPeople') ?? {},
				log: ({ id }) => ({ automationPersonId: id }),
			},
		),
};

// ── action plans ───────────────────────────────────────────────────────────

export const ActionPlans = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['actionPlansList'],
	) =>
		call(
			ctx,
			{
				event: 'actionPlans.list',
				input: Inputs.actionPlansList,
				output: Outputs.actionPlansList,
			},
			input,
			({ names, ...query }) => ({
				method: 'GET',
				path: '/actionPlans',
				// FUB documents the `names` filter in array format (repeated
				// `names[]=` params), which the http layer produces by repeating
				// array values. The shared query type only declares scalar
				// values, so the array rides through one narrowed cast.
				query: {
					...query,
					...(names ? { 'names[]': names } : {}),
				} as unknown as FollowUpBossQuery,
			}),
			{
				shape: (raw) => ({
					actionPlans: envelopeMany(raw, 'actionPlans'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.actionPlans.length }),
			},
		),
};

// ── action plans people ────────────────────────────────────────────────────

export const ActionPlansPeople = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['actionPlansPeopleList'],
	) =>
		call(
			ctx,
			{
				event: 'actionPlansPeople.list',
				input: Inputs.actionPlansPeopleList,
				output: Outputs.actionPlansPeopleList,
			},
			input,
			(query) => ({ method: 'GET', path: '/actionPlansPeople', query }),
			{
				shape: (raw) => ({
					actionPlansPeople: envelopeMany(raw, 'actionPlansPeople'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.actionPlansPeople.length }),
			},
		),

	create: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['actionPlansPeopleCreate'],
	) =>
		call(
			ctx,
			{
				event: 'actionPlansPeople.create',
				input: Inputs.actionPlansPeopleCreate,
				output: Outputs.actionPlansPeopleCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/actionPlansPeople', body }),
			{
				// unknown: the published example answers 200 with an empty body,
				// while the live API may echo the created pairing; envelopeOne
				// accepts either.
				shape: (raw) => envelopeOne(raw, 'actionPlansPeople') ?? {},
				log: (_, result) => ({
					actionPlanPersonId: result.id ?? undefined,
				}),
			},
		),

	update: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['actionPlansPeopleUpdate'],
	) =>
		call(
			ctx,
			{
				event: 'actionPlansPeople.update',
				input: Inputs.actionPlansPeopleUpdate,
				output: Outputs.actionPlansPeopleUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/actionPlansPeople/${segment(id)}`,
				body,
			}),
			{
				// unknown: same open 200 body as create.
				shape: (raw) => envelopeOne(raw, 'actionPlansPeople') ?? {},
				log: ({ id }) => ({ actionPlanPersonId: id }),
			},
		),
};
