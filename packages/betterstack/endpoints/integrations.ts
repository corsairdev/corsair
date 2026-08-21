import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const awsCloudWatch: BetterstackEndpoints['integrationsAwsCloudWatch'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['integrationsAwsCloudWatch']
		>('/api/v2/aws-cloudwatch-integrations', ctx.key, {
			method: 'GET',
			query: withPagination(input, {
				team_name: input.team_name,
			}),
		});

		await logEventFromContext(
			ctx,
			'betterstack.integrations.awsCloudWatch',
			auditPayload(input, []),
			'completed',
		);
		return result;
	};

export const azure: BetterstackEndpoints['integrationsAzure'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsAzure']
	>('/api/v2/azure-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.azure',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const datadog: BetterstackEndpoints['integrationsDatadog'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsDatadog']
	>('/api/v2/datadog-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.datadog',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const elastic: BetterstackEndpoints['integrationsElastic'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsElastic']
	>('/api/v2/elastic-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.elastic',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const email: BetterstackEndpoints['integrationsEmail'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsEmail']
	>('/api/v2/email-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.email',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const googleMonitoring: BetterstackEndpoints['integrationsGoogleMonitoring'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['integrationsGoogleMonitoring']
		>('/api/v2/google-monitoring-integrations', ctx.key, {
			method: 'GET',
			query: withPagination(input, {
				team_name: input.team_name,
			}),
		});

		await logEventFromContext(
			ctx,
			'betterstack.integrations.googleMonitoring',
			auditPayload(input, []),
			'completed',
		);
		return result;
	};

export const grafana: BetterstackEndpoints['integrationsGrafana'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsGrafana']
	>('/api/v2/grafana-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.grafana',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const jira: BetterstackEndpoints['integrationsJira'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsJira']
	>('/api/v2/jira-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.jira',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const newRelic: BetterstackEndpoints['integrationsNewRelic'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsNewRelic']
	>('/api/v2/new-relic-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.newRelic',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const pagerDuty: BetterstackEndpoints['integrationsPagerDuty'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsPagerDuty']
	>('/api/v2/pager-duty-webhooks', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.pagerDuty',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const prometheus: BetterstackEndpoints['integrationsPrometheus'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['integrationsPrometheus']
		>('/api/v2/prometheus-integrations', ctx.key, {
			method: 'GET',
			query: withPagination(input, {
				team_name: input.team_name,
			}),
		});

		await logEventFromContext(
			ctx,
			'betterstack.integrations.prometheus',
			auditPayload(input, []),
			'completed',
		);
		return result;
	};

export const slack: BetterstackEndpoints['integrationsSlack'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['integrationsSlack']
	>('/api/v2/slack-integrations', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.integrations.slack',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const splunkOnCall: BetterstackEndpoints['integrationsSplunkOnCall'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['integrationsSplunkOnCall']
		>('/api/v2/splunk-on-calls', ctx.key, {
			method: 'GET',
			query: withPagination(input, {
				team_name: input.team_name,
			}),
		});

		await logEventFromContext(
			ctx,
			'betterstack.integrations.splunkOnCall',
			auditPayload(input, []),
			'completed',
		);
		return result;
	};
