import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheMonitors, cacheMonitorsList, evictMonitors } from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['monitorsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorsCreate']
	>('/api/v2/monitors', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			monitor_type: input.monitor_type,
			url: input.url,
			pronounceable_name: input.pronounceable_name,
			email: input.email ?? false,
			sms: input.sms ?? false,
			call: input.call ?? false,
			push: input.push ?? false,
			critical_alert: input.critical_alert ?? false,
			check_frequency: input.check_frequency,
			request_headers: input.request_headers,
			expected_status_codes: input.expected_status_codes,
			domain_expiration: input.domain_expiration,
			ssl_expiration: input.ssl_expiration,
			policy_id: input.policy_id,
			expiration_policy_id: input.expiration_policy_id,
			follow_redirects: input.follow_redirects,
			required_keyword: input.required_keyword,
			team_wait: input.team_wait,
			paused: input.paused,
			port: input.port,
			ip_version: input.ip_version,
			regions: input.regions,
			monitor_group_id: input.monitor_group_id,
			recovery_period: input.recovery_period,
			verify_ssl: input.verify_ssl,
			confirmation_period: input.confirmation_period,
			http_method: input.http_method,
			request_timeout: input.request_timeout,
			request_body: input.request_body,
			auth_username: input.auth_username,
			auth_password: input.auth_password,
			maintenance_days: input.maintenance_days,
			maintenance_from: input.maintenance_from,
			maintenance_to: input.maintenance_to,
			maintenance_timezone: input.maintenance_timezone,
			remember_cookies: input.remember_cookies,
			playwright_script: input.playwright_script,
			scenario_name: input.scenario_name,
			environment_variables: input.environment_variables,
			proxy_host: input.proxy_host,
			proxy_port: input.proxy_port,
		},
		idempotent: false,
	});

	await cacheMonitors(ctx.db.monitors, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitors.create',
		auditPayload(input, ['policy_id', 'monitor_group_id']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['monitorsGet'] = async (ctx, input) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorsGet']
	>(
		buildPath('/api/v2/monitors/{monitor_id}', {
			monitor_id: input.monitor_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheMonitors(ctx.db.monitors, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitors.get',
		auditPayload(input, ['monitor_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['monitorsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorsList']
	>('/api/v2/monitors', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
			url: input.url,
			pronounceable_name: input.pronounceable_name,
		}),
	});

	await cacheMonitorsList(ctx.db.monitors, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitors.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['monitorsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorsUpdate']
	>(
		buildPath('/api/v2/monitors/{monitor_id}', {
			monitor_id: input.monitor_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				monitor_type: input.monitor_type,
				url: input.url,
				pronounceable_name: input.pronounceable_name,
				// No `?? false` here, unlike create: this is a partial update, so an
				// omitted channel must stay omitted. Defaulting it would turn an
				// unrelated edit into a silent "stop alerting me" on a live monitor.
				email: input.email,
				sms: input.sms,
				call: input.call,
				push: input.push,
				critical_alert: input.critical_alert,
				check_frequency: input.check_frequency,
				request_headers: input.request_headers,
				expected_status_codes: input.expected_status_codes,
				domain_expiration: input.domain_expiration,
				ssl_expiration: input.ssl_expiration,
				policy_id: input.policy_id,
				expiration_policy_id: input.expiration_policy_id,
				follow_redirects: input.follow_redirects,
				required_keyword: input.required_keyword,
				team_wait: input.team_wait,
				paused: input.paused,
				port: input.port,
				ip_version: input.ip_version,
				regions: input.regions,
				monitor_group_id: input.monitor_group_id,
				recovery_period: input.recovery_period,
				verify_ssl: input.verify_ssl,
				confirmation_period: input.confirmation_period,
				http_method: input.http_method,
				request_timeout: input.request_timeout,
				request_body: input.request_body,
				auth_username: input.auth_username,
				auth_password: input.auth_password,
				maintenance_days: input.maintenance_days,
				maintenance_from: input.maintenance_from,
				maintenance_to: input.maintenance_to,
				maintenance_timezone: input.maintenance_timezone,
				remember_cookies: input.remember_cookies,
				playwright_script: input.playwright_script,
				scenario_name: input.scenario_name,
				environment_variables: input.environment_variables,
				proxy_host: input.proxy_host,
				proxy_port: input.proxy_port,
			},
		},
	);

	await cacheMonitors(ctx.db.monitors, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitors.update',
		auditPayload(input, ['monitor_id', 'policy_id', 'monitor_group_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['monitorsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorsRemove']
	>(
		buildPath('/api/v2/monitors/{monitor_id}', {
			monitor_id: input.monitor_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictMonitors(ctx.db.monitors, input.monitor_id);

	await logEventFromContext(
		ctx,
		'betterstack.monitors.remove',
		auditPayload(input, ['monitor_id']),
		'completed',
	);
	return result;
};

export const availability: BetterstackEndpoints['monitorsAvailability'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['monitorsAvailability']
		>(
			buildPath('/api/v2/monitors/{monitor_id}/sla', {
				monitor_id: input.monitor_id,
			}),
			ctx.key,
			{
				method: 'GET',
				query: {
					from: input.from,
					to: input.to,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'betterstack.monitors.availability',
			auditPayload(input, ['monitor_id']),
			'completed',
		);
		return result;
	};

export const responseTimes: BetterstackEndpoints['monitorsResponseTimes'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['monitorsResponseTimes']
		>(
			buildPath('/api/v2/monitors/{monitor_id}/response-times', {
				monitor_id: input.monitor_id,
			}),
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'betterstack.monitors.responseTimes',
			auditPayload(input, ['monitor_id']),
			'completed',
		);
		return result;
	};
