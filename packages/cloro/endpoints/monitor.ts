import { logEventFromContext } from 'corsair/core';
import type { CloroContext, CloroEndpoints } from '..';
import { makeCloroRequest } from '../client';
import type { CloroSnapshot } from '../schema';
import { CloroEndpointInputSchemas, CloroEndpointOutputSchemas } from './types';

type Engine = CloroSnapshot['engine'];

type Snapshot = Pick<CloroSnapshot, 'text' | 'model' | 'sourceUrls'>;

function urls(items: readonly { url?: string; link?: string }[] | undefined) {
	return (items ?? []).flatMap((item) => {
		const url = item.url ?? item.link;
		return url ? [url] : [];
	});
}

async function saveSnapshot(
	ctx: CloroContext,
	engine: Engine,
	prompt: string,
	geo: { country?: string; area?: string },
	snapshot: Snapshot,
) {
	if (!ctx.db.snapshots) return;
	const country = geo.country?.toUpperCase();
	const id = [engine, country ?? 'any', geo.area ?? 'any', prompt].join(':');
	try {
		await ctx.db.snapshots.upsertByEntityId(id, {
			id,
			engine,
			prompt,
			country,
			area: geo.area,
			...snapshot,
			checkedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save cloro snapshot to database:', error);
	}
}

async function logRun(ctx: CloroContext, engine: Engine, snapshot: Snapshot) {
	await logEventFromContext(
		ctx,
		`cloro.monitor.${engine}`,
		{ sourceCount: snapshot.sourceUrls.length },
		'completed',
	);
}

export const chatgpt: CloroEndpoints['monitorChatgpt'] = async (ctx, input) => {
	const parsed = CloroEndpointInputSchemas.monitorChatgpt.parse(input);
	const response = CloroEndpointOutputSchemas.monitorChatgpt.parse(
		await makeCloroRequest('v1/monitor/chatgpt', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	// A multi-turn request answers each prompt in order; the last one is the
	// answer to monitor.
	const answers = Array.isArray(response.result)
		? response.result
		: [response.result];
	const last = answers[answers.length - 1];
	const prompts = Array.isArray(parsed.prompt)
		? parsed.prompt
		: [parsed.prompt];
	const snapshot = {
		text: last?.text,
		model: last?.model ?? undefined,
		sourceUrls: urls(last?.sources),
	};
	await saveSnapshot(
		ctx,
		'chatgpt',
		prompts.join('\n'),
		{ country: parsed.country, area: parsed.state },
		snapshot,
	);
	await logRun(ctx, 'chatgpt', snapshot);
	return response;
};

export const perplexity: CloroEndpoints['monitorPerplexity'] = async (
	ctx,
	input,
) => {
	const parsed = CloroEndpointInputSchemas.monitorPerplexity.parse(input);
	const response = CloroEndpointOutputSchemas.monitorPerplexity.parse(
		await makeCloroRequest('v1/monitor/perplexity', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	const snapshot = {
		text: response.result.text,
		sourceUrls: urls(response.result.sources),
	};
	await saveSnapshot(
		ctx,
		'perplexity',
		parsed.prompt,
		{ country: parsed.country, area: parsed.state },
		snapshot,
	);
	await logRun(ctx, 'perplexity', snapshot);
	return response;
};

export const gemini: CloroEndpoints['monitorGemini'] = async (ctx, input) => {
	const parsed = CloroEndpointInputSchemas.monitorGemini.parse(input);
	const response = CloroEndpointOutputSchemas.monitorGemini.parse(
		await makeCloroRequest('v1/monitor/gemini', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	const snapshot = {
		text: response.result.text,
		sourceUrls: urls(response.result.sources),
	};
	await saveSnapshot(
		ctx,
		'gemini',
		parsed.prompt,
		{ country: parsed.country, area: parsed.state },
		snapshot,
	);
	await logRun(ctx, 'gemini', snapshot);
	return response;
};

export const copilot: CloroEndpoints['monitorCopilot'] = async (ctx, input) => {
	const parsed = CloroEndpointInputSchemas.monitorCopilot.parse(input);
	const response = CloroEndpointOutputSchemas.monitorCopilot.parse(
		await makeCloroRequest('v1/monitor/copilot', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	const snapshot = {
		text: response.result.text,
		sourceUrls: urls(response.result.sources),
	};
	await saveSnapshot(
		ctx,
		'copilot',
		parsed.prompt,
		{ country: parsed.country, area: parsed.state },
		snapshot,
	);
	await logRun(ctx, 'copilot', snapshot);
	return response;
};

export const googleAiMode: CloroEndpoints['monitorGoogleAiMode'] = async (
	ctx,
	input,
) => {
	const parsed = CloroEndpointInputSchemas.monitorGoogleAiMode.parse(input);
	const response = CloroEndpointOutputSchemas.monitorGoogleAiMode.parse(
		await makeCloroRequest('v1/monitor/aimode', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	const snapshot = {
		text: response.result.text,
		sourceUrls: urls(response.result.sources),
	};
	await saveSnapshot(
		ctx,
		'aimode',
		parsed.prompt,
		{
			country: parsed.country ?? parsed.gl,
			area: parsed.location ?? parsed.uule,
		},
		snapshot,
	);
	await logRun(ctx, 'aimode', snapshot);
	return response;
};

export const googleSearch: CloroEndpoints['monitorGoogleSearch'] = async (
	ctx,
	input,
) => {
	const parsed = CloroEndpointInputSchemas.monitorGoogleSearch.parse(input);
	const response = CloroEndpointOutputSchemas.monitorGoogleSearch.parse(
		await makeCloroRequest('v1/monitor/google', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	const snapshot = {
		text: response.result.aioverview?.text,
		sourceUrls: urls(response.result.organicResults),
	};
	await saveSnapshot(
		ctx,
		'google',
		parsed.query ?? parsed.url ?? '',
		{
			country: parsed.country ?? parsed.gl,
			area: parsed.location ?? parsed.uule,
		},
		snapshot,
	);
	await logRun(ctx, 'google', snapshot);
	return response;
};

export const googleNews: CloroEndpoints['monitorGoogleNews'] = async (
	ctx,
	input,
) => {
	const parsed = CloroEndpointInputSchemas.monitorGoogleNews.parse(input);
	const response = CloroEndpointOutputSchemas.monitorGoogleNews.parse(
		await makeCloroRequest('v1/monitor/google/news', ctx.key, {
			method: 'POST',
			body: parsed,
		}),
	);

	const snapshot = { sourceUrls: urls(response.result.newsResults) };
	await saveSnapshot(
		ctx,
		'googleNews',
		parsed.query,
		{ country: parsed.country ?? parsed.gl },
		snapshot,
	);
	await logRun(ctx, 'googleNews', snapshot);
	return response;
};
