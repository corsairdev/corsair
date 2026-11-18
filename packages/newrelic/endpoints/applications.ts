import type { NewrelicEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	NewrelicEndpointInputSchemas as Inputs,
	NewrelicEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Lists applications with their health and reporting status. `health_status` is
 * a colour, `reporting` goes false after ten quiet minutes, and `links.alert_policy`
 * is the policy covering the app.
 */
export const list: NewrelicEndpoints['applicationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'applications.list',
			input: Inputs.applicationsList,
			output: Outputs.applicationsList,
		},
		input,
		({ name, host, ids, page }) => ({
			method: 'GET',
			path: '/applications.json',
			query: {
				'filter[name]': name,
				'filter[host]': host,
				'filter[ids]': ids?.join(','),
				page,
			},
		}),
		{
			log: (_, result) => ({ count: result.applications.length }),
		},
	);

export const get: NewrelicEndpoints['applicationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'applications.get',
			input: Inputs.applicationsGet,
			output: Outputs.applicationsGet,
		},
		input,
		({ applicationId }) => ({
			method: 'GET',
			path: `/applications/${segment(applicationId)}.json`,
		}),
		{
			log: ({ applicationId }, result) => ({
				applicationId,
				health: result.application.health_status ?? undefined,
			}),
		},
	);

/**
 * Reads metric timeslices. Without `from`, New Relic returns the last 30
 * minutes; `summarize` collapses the window into one value per metric. Metric
 * names go out as repeated `names[]` parameters, which is what the REST API
 * reads.
 */
export const data: NewrelicEndpoints['metricsData'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.data',
			input: Inputs.metricsData,
			output: Outputs.metricsData,
		},
		input,
		({ applicationId, names, from, to, period, summarize, values }) => ({
			method: 'GET',
			path: `/applications/${segment(applicationId)}/metrics/data.json`,
			query: {
				'names[]': names,
				'values[]': values,
				from,
				to,
				period,
				summarize,
			},
		}),
		{
			log: (_, result) => ({
				series: result.metric_data.metrics?.length ?? 0,
				from: result.metric_data.from ?? undefined,
			}),
		},
	);

export const policies: NewrelicEndpoints['policiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'alerts.policies',
			input: Inputs.policiesList,
			output: Outputs.policiesList,
		},
		input,
		({ name, page }) => ({
			method: 'GET',
			path: '/alerts_policies.json',
			query: { 'filter[name]': name, page },
		}),
		{
			log: (_, result) => ({ count: result.policies.length }),
		},
	);

/**
 * Creates an alert policy. `incident_preference` decides whether alerts roll up
 * per policy, per condition, or per condition and signal.
 */
export const createPolicy: NewrelicEndpoints['policiesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'alerts.policiesCreate',
			input: Inputs.policiesCreate,
			output: Outputs.policiesCreate,
		},
		input,
		({ name, incident_preference }) => ({
			method: 'POST',
			path: '/alerts_policies.json',
			body: {
				policy: {
					name,
					...(incident_preference ? { incident_preference } : {}),
				},
			},
		}),
		{
			log: (_, result) => ({ policyId: result.policy.id ?? undefined }),
		},
	);

/** Deletes a policy. New Relic answers the deleted policy, not a bare ack. */
export const deletePolicy: NewrelicEndpoints['policiesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'alerts.policiesDelete',
			input: Inputs.policiesDelete,
			output: Outputs.policiesDelete,
		},
		input,
		({ policyId }) => ({
			method: 'DELETE',
			path: `/alerts_policies/${segment(policyId)}.json`,
		}),
		{ log: ({ policyId }) => ({ policyId }) },
	);

/**
 * Lists the conditions attached to one policy. Only APM, browser and mobile
 * conditions appear here; external services, synthetics and NRQL conditions
 * live behind their own endpoints.
 */
export const conditions: NewrelicEndpoints['conditionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'alerts.conditions',
			input: Inputs.conditionsList,
			output: Outputs.conditionsList,
		},
		input,
		({ policyId, page }) => ({
			method: 'GET',
			path: '/alerts_conditions.json',
			query: { policy_id: policyId, page },
		}),
		{
			log: ({ policyId }, result) => ({
				policyId,
				count: result.conditions.length,
			}),
		},
	);

/** Renames a policy or changes how its incidents roll up. */
export const updatePolicy: NewrelicEndpoints['policiesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'alerts.policiesUpdate',
			input: Inputs.policiesUpdate,
			output: Outputs.policiesUpdate,
		},
		input,
		({ policyId, name, incident_preference }) => ({
			method: 'PUT',
			path: `/alerts_policies/${segment(policyId)}.json`,
			body: {
				policy: { name, incident_preference },
			},
		}),
		{ log: ({ policyId }) => ({ policyId }) },
	);

/**
 * Lists the static NRQL conditions in one policy. These are the conditions
 * most accounts use, and `alerts.conditions` does not return them.
 */
export const nrqlConditions: NewrelicEndpoints['nrqlConditionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'alerts.nrqlConditions',
			input: Inputs.nrqlConditionsList,
			output: Outputs.nrqlConditionsList,
		},
		input,
		({ policyId, page }) => ({
			method: 'GET',
			path: '/alerts_nrql_conditions.json',
			query: { policy_id: policyId, page },
		}),
		{
			log: ({ policyId }, result) => ({
				policyId,
				count: result.nrql_conditions.length,
			}),
		},
	);

/** Adds a static NRQL condition to a policy. */
export const createNrqlCondition: NewrelicEndpoints['nrqlConditionsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'alerts.createNrqlCondition',
			input: Inputs.nrqlConditionsCreate,
			output: Outputs.nrqlConditionsCreate,
		},
		input,
		({ policyId, condition }) => ({
			method: 'POST',
			path: `/alerts_nrql_conditions/policies/${segment(policyId)}.json`,
			body: { nrql_condition: condition },
		}),
		{
			log: ({ policyId }, result) => ({
				policyId,
				conditionId: result.nrql_condition.id ?? undefined,
			}),
		},
	);

/** Replaces a NRQL condition with the whole body given. */
export const updateNrqlCondition: NewrelicEndpoints['nrqlConditionsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'alerts.updateNrqlCondition',
			input: Inputs.nrqlConditionsUpdate,
			output: Outputs.nrqlConditionsUpdate,
		},
		input,
		({ conditionId, condition }) => ({
			method: 'PUT',
			path: `/alerts_nrql_conditions/${segment(conditionId)}.json`,
			body: { nrql_condition: condition },
		}),
		{ log: ({ conditionId }) => ({ conditionId }) },
	);

/** Deletes a NRQL condition. New Relic answers the deleted condition. */
export const deleteNrqlCondition: NewrelicEndpoints['nrqlConditionsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'alerts.deleteNrqlCondition',
			input: Inputs.nrqlConditionsDelete,
			output: Outputs.nrqlConditionsDelete,
		},
		input,
		({ conditionId }) => ({
			method: 'DELETE',
			path: `/alerts_nrql_conditions/${segment(conditionId)}.json`,
		}),
		{ log: ({ conditionId }) => ({ conditionId }) },
	);
