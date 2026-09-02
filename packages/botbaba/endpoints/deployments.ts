import { logEventFromContext } from 'corsair/core';
import type { BotbabaEndpoints } from '../index';
import { auditPayload } from './logging';
import { botbabaCall } from './shared';
import type { BotbabaDeployment } from './types';

/** Deploys a bot to a specific channel (e.g. WhatsApp). */
export const deploy: BotbabaEndpoints['deploymentsDeploy'] = async (
	ctx,
	input,
) => {
	const result = await botbabaCall<{ deployment: BotbabaDeployment }>(
		ctx,
		`/v1/bots/${encodeURIComponent(input.botId)}/deploy`,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);

	await logEventFromContext(
		ctx,
		'botbaba.deployments.deploy',
		auditPayload(input, ['botId', 'channel']),
		'completed',
	);
	return result.deployment;
};

/** Gets the deployment status for a bot. */
export const getStatus: BotbabaEndpoints['deploymentsGetStatus'] = async (
	ctx,
	input,
) => {
	const path = input.deploymentId
		? `/v1/bots/${encodeURIComponent(input.botId)}/deployments/${encodeURIComponent(input.deploymentId)}`
		: `/v1/bots/${encodeURIComponent(input.botId)}/deployments/latest`;

	const result = await botbabaCall<{ deployment: BotbabaDeployment }>(
		ctx,
		path,
	);

	await logEventFromContext(
		ctx,
		'botbaba.deployments.getStatus',
		auditPayload(input, ['botId']),
		'completed',
	);
	return result.deployment;
};
