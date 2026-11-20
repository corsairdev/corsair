import type { ParseraEndpoints } from '..';
import { call } from './call';
import {
	ParseraEndpointInputSchemas as Inputs,
	ParseraEndpointOutputSchemas as Outputs,
} from './types';

export const extract: ParseraEndpoints['agentExtract'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'agent.extract',
			input: Inputs.agentExtract,
			output: Outputs.agentExtract,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/agent/extract',
			body,
		}),
		{ log: (_, task) => ({ taskId: task.task_id, status: task.status }) },
	);

export const getTask: ParseraEndpoints['agentGetTask'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'agent.getTask',
			input: Inputs.agentGetTask,
			output: Outputs.agentGetTask,
		},
		input,
		({ taskId }) => ({
			method: 'GET',
			path: `/v1/agent/extract/${encodeURIComponent(taskId)}`,
		}),
		{ log: (_, task) => ({ taskId: task.task_id, status: task.status }) },
	);

export const stopTask: ParseraEndpoints['agentStopTask'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'agent.stopTask',
			input: Inputs.agentStopTask,
			output: Outputs.agentStopTask,
		},
		input,
		({ taskId }) => ({
			method: 'POST',
			path: `/v1/agent/extract/${encodeURIComponent(taskId)}/stop`,
		}),
		{ log: (_, task) => ({ taskId: task.task_id, status: task.status }) },
	);

export const generateScraper: ParseraEndpoints['agentGenerateScraper'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'agent.generateScraper',
			input: Inputs.agentGenerateScraper,
			output: Outputs.agentGenerateScraper,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/agent/generate',
			body,
		}),
		{
			log: (_, result) => ({
				scraperId: result.template_id,
				status: result.status,
			}),
		},
	);

export const createScraper: ParseraEndpoints['agentCreateScraper'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'agent.createScraper',
			input: Inputs.agentCreateScraper,
			output: Outputs.agentCreateScraper,
		},
		input,
		() => ({
			method: 'POST',
			path: '/v1/agent/new',
		}),
		{ log: (_, scraper) => ({ scraperId: scraper.template_id }) },
	);

export const getScraper: ParseraEndpoints['agentGetScraper'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'agent.getScraper',
			input: Inputs.agentGetScraper,
			output: Outputs.agentGetScraper,
		},
		input,
		({ scraperId }) => ({
			method: 'GET',
			path: `/v1/agent/${encodeURIComponent(scraperId)}`,
		}),
		{
			log: (_, scraper) => ({
				scraperId: scraper.template_id,
				status: scraper.status,
			}),
		},
	);

export const deleteScraper: ParseraEndpoints['agentDeleteScraper'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'agent.deleteScraper',
			input: Inputs.agentDeleteScraper,
			output: Outputs.agentDeleteScraper,
		},
		input,
		({ scraperId }) => ({
			method: 'DELETE',
			path: `/v1/agent/${encodeURIComponent(scraperId)}`,
		}),
		{
			// The API answers a message string; validate it arrived rather than
			// fabricating a success from an empty body.
			shape: (raw) => {
				// unknown: raw is the untouched response body; only the message
				// field is expected, anything else is a failure.
				const record = raw as { message?: unknown } | undefined;
				if (
					typeof record?.message !== 'string' ||
					record.message.length === 0
				) {
					throw new Error(
						`Parsera agent.deleteScraper: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { message: record.message };
			},
			log: (_, result) => ({ message: result.message }),
		},
	);
