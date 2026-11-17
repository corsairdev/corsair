import { asRecord } from 'corsair/core';
import type { NewrelicEndpoints } from '..';
import { call } from './call';
import {
	NewrelicEndpointInputSchemas as Inputs,
	NEWRELIC_ACCOUNTS_DOCUMENT,
	NEWRELIC_DEPLOYMENT_DOCUMENT,
	NEWRELIC_ENTITIES_DOCUMENT,
	NEWRELIC_ENTITY_SEARCH_DOCUMENT,
	NEWRELIC_ISSUES_DOCUMENT,
	NewrelicEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Walks a NerdGraph answer down `data.<path>`. A missing step means New Relic
 * answered something other than the document asked for, so it throws rather
 * than hand back an empty result.
 */
// unknown: raw is the parsed GraphQL body; the caller's output schema checks
// what this returns.
function dig(raw: unknown, path: string[]): unknown {
	let node: unknown = asRecord(raw)?.data;
	for (const step of path) {
		const record = asRecord(node);
		if (!record || !(step in record)) {
			throw new Error(`NerdGraph answer has no data.${path.join('.')}`);
		}
		node = record[step];
	}
	return node;
}

/** The accounts this user key can reach, with their ids for NRQL and issues. */
export const accounts: NewrelicEndpoints['accountsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.list',
			input: Inputs.accountsList,
			output: Outputs.accountsList,
		},
		input,
		() => ({
			method: 'POST',
			graphql: { query: NEWRELIC_ACCOUNTS_DOCUMENT },
		}),
		{
			shape: (raw) => ({ accounts: dig(raw, ['actor', 'accounts']) ?? [] }),
			log: (_, result) => ({ count: result.accounts.length }),
		},
	);

/**
 * Searches every entity the key can see: services, hosts, browser apps,
 * dashboards, monitors, alert conditions. One page per call.
 */
export const search: NewrelicEndpoints['entitiesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'entities.search',
			input: Inputs.entitiesSearch,
			output: Outputs.entitiesSearch,
		},
		input,
		({ query, cursor }) => ({
			method: 'POST',
			graphql: {
				query: NEWRELIC_ENTITY_SEARCH_DOCUMENT,
				variables: { query, cursor },
			},
		}),
		{
			shape: (raw) => {
				const found = asRecord(dig(raw, ['actor', 'entitySearch']));
				const results = asRecord(found?.results);
				return {
					count: found?.count,
					entities: results?.entities ?? [],
					nextCursor: results?.nextCursor,
				};
			},
			log: (_, result) => ({
				count: result.count ?? undefined,
				page: result.entities.length,
			}),
		},
	);

/** Reads up to 25 entities by GUID, with their tags. */
export const get: NewrelicEndpoints['entitiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'entities.get',
			input: Inputs.entitiesGet,
			output: Outputs.entitiesGet,
		},
		input,
		({ guids }) => ({
			method: 'POST',
			graphql: { query: NEWRELIC_ENTITIES_DOCUMENT, variables: { guids } },
		}),
		{
			shape: (raw) => ({
				// An unknown GUID is left out of the list rather than an error.
				entities: dig(raw, ['actor', 'entities']) ?? [],
			}),
			log: (_, result) => ({ count: result.entities.length }),
		},
	);

/** Lists alert issues (the current incident model) for one account. */
export const issues: NewrelicEndpoints['issuesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'issues.list',
			input: Inputs.issuesList,
			output: Outputs.issuesList,
		},
		input,
		({
			accountId,
			states,
			priority,
			entityGuids,
			startTime,
			endTime,
			cursor,
		}) => {
			const filter = {
				...(states ? { states } : {}),
				...(priority ? { priority } : {}),
				...(entityGuids ? { entityGuids } : {}),
			};
			return {
				method: 'POST',
				graphql: {
					query: NEWRELIC_ISSUES_DOCUMENT,
					variables: {
						accountId,
						cursor,
						filter: Object.keys(filter).length > 0 ? filter : undefined,
						timeWindow:
							startTime !== undefined && endTime !== undefined
								? { startTime, endTime }
								: undefined,
					},
				},
			};
		},
		{
			shape: (raw) => {
				const page = asRecord(
					dig(raw, ['actor', 'account', 'aiIssues', 'issues']),
				);
				return {
					issues: page?.issues ?? [],
					nextCursor: page?.nextCursor,
				};
			},
			log: ({ accountId }, result) => ({
				accountId,
				count: result.issues.length,
			}),
		},
	);

/**
 * Records a deployment marker on an entity, which New Relic draws on its
 * charts. Markers cannot be deleted afterwards.
 */
export const createDeployment: NewrelicEndpoints['deploymentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'changeTracking.createDeployment',
			input: Inputs.deploymentsCreate,
			output: Outputs.deploymentsCreate,
		},
		input,
		({ region: _region, ...deployment }) => ({
			method: 'POST',
			graphql: {
				query: NEWRELIC_DEPLOYMENT_DOCUMENT,
				variables: { deployment },
			},
		}),
		{
			shape: (raw) => dig(raw, ['changeTrackingCreateDeployment']),
			log: (_, result) => ({
				deploymentId: result.deploymentId ?? undefined,
			}),
		},
	);
