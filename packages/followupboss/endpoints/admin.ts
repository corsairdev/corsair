import { asRecord } from 'corsair/core';
import type { FollowUpBossContext } from '..';
import { segment } from '../client';
import {
	AdminInputSchemas as Inputs,
	AdminOutputSchemas as Outputs,
} from './admin-types';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import type { FollowUpBossEndpointInputs } from './registry';

// ── users ──────────────────────────────────────────────────────────────────

export const Users = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['usersList'],
	) =>
		call(
			ctx,
			{
				event: 'users.list',
				input: Inputs.usersList,
				output: Outputs.usersList,
			},
			input,
			(query) => ({ method: 'GET', path: '/users', query }),
			{
				shape: (raw) => ({
					users: envelopeMany(raw, 'users'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.users.length }),
			},
		),

	get: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['usersGet'],
	) =>
		call(
			ctx,
			{
				event: 'users.get',
				input: Inputs.usersGet,
				output: Outputs.usersGet,
			},
			input,
			({ id }) => ({ method: 'GET', path: `/users/${segment(id)}` }),
			{
				// A single fetch arrives as `{ users: [user] }` or the bare user.
				shape: (raw) => envelopeOne(raw, 'users'),
				log: ({ id }) => ({ userId: id }),
			},
		),

	delete: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['usersDelete'],
	) =>
		call(
			ctx,
			{
				event: 'users.delete',
				input: Inputs.usersDelete,
				output: Outputs.usersDelete,
			},
			input,
			({ id, assignTo }) => ({
				method: 'DELETE',
				path: `/users/${segment(id)}`,
				// FUB requires the deleted user's leads to be reassigned.
				query: { assignTo },
			}),
			{
				// unknown: FUB may echo the deleted resource in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ userId: id }),
			},
		),
};

// ── teams ──────────────────────────────────────────────────────────────────

export const Teams = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['teamsList'],
	) =>
		call(
			ctx,
			{
				event: 'teams.list',
				input: Inputs.teamsList,
				output: Outputs.teamsList,
			},
			input,
			(query) => ({ method: 'GET', path: '/teams', query }),
			{
				shape: (raw) => ({
					teams: envelopeMany(raw, 'teams'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.teams.length }),
			},
		),

	create: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['teamsCreate'],
	) =>
		call(
			ctx,
			{
				event: 'teams.create',
				input: Inputs.teamsCreate,
				output: Outputs.teamsCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/teams', body }),
			{
				shape: (raw) => envelopeOne(raw, 'teams'),
				log: (_, result) => ({ teamId: result.id ?? undefined }),
			},
		),

	get: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['teamsGet'],
	) =>
		call(
			ctx,
			{
				event: 'teams.get',
				input: Inputs.teamsGet,
				output: Outputs.teamsGet,
			},
			input,
			({ id }) => ({ method: 'GET', path: `/teams/${segment(id)}` }),
			{
				shape: (raw) => envelopeOne(raw, 'teams'),
				log: ({ id }) => ({ teamId: id }),
			},
		),

	update: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['teamsUpdate'],
	) =>
		call(
			ctx,
			{
				event: 'teams.update',
				input: Inputs.teamsUpdate,
				output: Outputs.teamsUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/teams/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'teams'),
				log: ({ id }) => ({ teamId: id }),
			},
		),

	delete: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['teamsDelete'],
	) =>
		call(
			ctx,
			{
				event: 'teams.delete',
				input: Inputs.teamsDelete,
				output: Outputs.teamsDelete,
			},
			input,
			({ id, moveToTeamId }) => ({
				method: 'DELETE',
				path: `/teams/${segment(id)}`,
				query: { moveToTeamId },
			}),
			{
				// unknown: FUB may echo the deleted resource in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ teamId: id }),
			},
		),
};

// ── groups ─────────────────────────────────────────────────────────────────

export const Groups = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['groupsList'],
	) =>
		call(
			ctx,
			{
				event: 'groups.list',
				input: Inputs.groupsList,
				output: Outputs.groupsList,
			},
			input,
			(query) => ({ method: 'GET', path: '/groups', query }),
			{
				shape: (raw) => ({
					groups: envelopeMany(raw, 'groups'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.groups.length }),
			},
		),

	create: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['groupsCreate'],
	) =>
		call(
			ctx,
			{
				event: 'groups.create',
				input: Inputs.groupsCreate,
				output: Outputs.groupsCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/groups', body }),
			{
				shape: (raw) => envelopeOne(raw, 'groups'),
				log: (_, result) => ({ groupId: result.id ?? undefined }),
			},
		),

	get: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['groupsGet'],
	) =>
		call(
			ctx,
			{
				event: 'groups.get',
				input: Inputs.groupsGet,
				output: Outputs.groupsGet,
			},
			input,
			({ id }) => ({ method: 'GET', path: `/groups/${segment(id)}` }),
			{
				shape: (raw) => envelopeOne(raw, 'groups'),
				log: ({ id }) => ({ groupId: id }),
			},
		),

	update: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['groupsUpdate'],
	) =>
		call(
			ctx,
			{
				event: 'groups.update',
				input: Inputs.groupsUpdate,
				output: Outputs.groupsUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/groups/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'groups'),
				log: ({ id }) => ({ groupId: id }),
			},
		),

	delete: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['groupsDelete'],
	) =>
		call(
			ctx,
			{
				event: 'groups.delete',
				input: Inputs.groupsDelete,
				output: Outputs.groupsDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/groups/${segment(id)}`,
			}),
			{
				// unknown: FUB may echo the deleted resource in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ groupId: id }),
			},
		),

	// The round-robin view answers with the same groups envelope behind its
	// own path.
	roundRobin: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['groupsRoundRobin'],
	) =>
		call(
			ctx,
			{
				event: 'groups.roundRobin',
				input: Inputs.groupsRoundRobin,
				output: Outputs.groupsRoundRobin,
			},
			input,
			(query) => ({ method: 'GET', path: '/groups/roundRobin', query }),
			{
				shape: (raw) => ({
					groups: envelopeMany(raw, 'groups'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.groups.length }),
			},
		),
};

// ── ponds ──────────────────────────────────────────────────────────────────

export const Ponds = {
	list: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['pondsList'],
	) =>
		call(
			ctx,
			{
				event: 'ponds.list',
				input: Inputs.pondsList,
				output: Outputs.pondsList,
			},
			input,
			(query) => ({ method: 'GET', path: '/ponds', query }),
			{
				shape: (raw) => ({
					ponds: envelopeMany(raw, 'ponds'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.ponds.length }),
			},
		),

	create: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['pondsCreate'],
	) =>
		call(
			ctx,
			{
				event: 'ponds.create',
				input: Inputs.pondsCreate,
				output: Outputs.pondsCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/ponds', body }),
			{
				shape: (raw) => envelopeOne(raw, 'ponds'),
				log: (_, result) => ({ pondId: result.id ?? undefined }),
			},
		),

	get: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['pondsGet'],
	) =>
		call(
			ctx,
			{
				event: 'ponds.get',
				input: Inputs.pondsGet,
				output: Outputs.pondsGet,
			},
			input,
			({ id }) => ({ method: 'GET', path: `/ponds/${segment(id)}` }),
			{
				shape: (raw) => envelopeOne(raw, 'ponds'),
				log: ({ id }) => ({ pondId: id }),
			},
		),

	update: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['pondsUpdate'],
	) =>
		call(
			ctx,
			{
				event: 'ponds.update',
				input: Inputs.pondsUpdate,
				output: Outputs.pondsUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/ponds/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'ponds'),
				log: ({ id }) => ({ pondId: id }),
			},
		),

	delete: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['pondsDelete'],
	) =>
		call(
			ctx,
			{
				event: 'ponds.delete',
				input: Inputs.pondsDelete,
				output: Outputs.pondsDelete,
			},
			input,
			({ id, assignTo }) => ({
				method: 'DELETE',
				path: `/ponds/${segment(id)}`,
				// FUB requires a receiver for the contacts left in the pond.
				query: { assignTo },
			}),
			{
				// unknown: FUB may echo the deleted resource in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ pondId: id }),
			},
		),
};

// ── rate limit ─────────────────────────────────────────────────────────────

// The published spec shows these paths as '/v1/rateLimit/...', but the client
// base URL already includes /v1, so the published prefix is dropped here to
// avoid doubling it on the wire.
export const RateLimit = {
	limits: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['rateLimitLimits'],
	) =>
		call(
			ctx,
			{
				event: 'rateLimit.limits',
				input: Inputs.rateLimitLimits,
				output: Outputs.rateLimitLimits,
			},
			input,
			() => ({ method: 'GET', path: '/rateLimit/limits' }),
		),

	usage: (
		ctx: FollowUpBossContext,
		input: FollowUpBossEndpointInputs['rateLimitUsage'],
	) =>
		call(
			ctx,
			{
				event: 'rateLimit.usage',
				input: Inputs.rateLimitUsage,
				output: Outputs.rateLimitUsage,
			},
			input,
			() => ({ method: 'GET', path: '/rateLimit/usage' }),
		),
};
