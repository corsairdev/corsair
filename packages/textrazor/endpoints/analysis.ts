import { logEventFromContext } from 'corsair/core';
import { assertTextrazorOk, makeTextrazorRequest } from '../client';
import type { TextrazorContext, TextrazorEndpoints } from '../index';
import { analysisForm } from './call';
import type { AnalysisResponse } from './types';
import {
	AnalyzeContentInputSchema,
	AnalyzeContentOutputSchema,
	ClassifyTextInputSchema,
	ClassifyTextOutputSchema,
	ExtractEntitiesInputSchema,
	ExtractEntitiesOutputSchema,
} from './types';

type AnalysisIn = {
	text?: string;
	url?: string;
	extractors?: string[];
	minRelevanceScore?: number;
	minConfidenceScore?: number;
};

async function runAnalysis(
	ctx: TextrazorContext,
	event: string,
	form: Record<string, unknown>,
	input: AnalysisIn,
	parse: (raw: unknown) => AnalysisResponse,
): Promise<AnalysisResponse> {
	const raw = await makeTextrazorRequest<AnalysisResponse>('/', ctx.key, {
		method: 'POST',
		form,
	});
	const result = parse(assertTextrazorOk(raw));

	if (result.response?.entities) {
		const minRel = input.minRelevanceScore;
		const minConf = input.minConfidenceScore;
		if (minRel !== undefined || minConf !== undefined) {
			result.response.entities = result.response.entities.filter((entity) => {
				if (minRel !== undefined && (entity.relevanceScore ?? 0) < minRel) {
					return false;
				}
				if (minConf !== undefined && (entity.confidenceScore ?? 0) < minConf) {
					return false;
				}
				return true;
			});
		}

		for (const entity of result.response.entities) {
			const entityId = entity.entityId ?? entity.matchedText;
			if (!entityId) continue;
			try {
				await ctx.db.entities.upsertByEntityId(entityId, {
					id: entityId,
					entityId: entity.entityId ?? null,
					matchedText: entity.matchedText,
					confidenceScore: entity.confidenceScore,
					relevanceScore: entity.relevanceScore,
					wikiLink: entity.wikiLink ?? null,
					wikidataId: entity.wikidataId ?? null,
					fetchedAt: new Date(),
				});
			} catch (error) {
				console.warn('[textrazor] Failed to cache entity:', error);
			}
		}
	}

	await logEventFromContext(ctx, event, input, 'completed');
	return result;
}

export const analyzeContent: TextrazorEndpoints['analyzeContent'] = async (
	ctx,
	input,
) => {
	const parsed = AnalyzeContentInputSchema.parse(input);
	return runAnalysis(
		ctx,
		'textrazor.analysis.analyzeContent',
		analysisForm(parsed),
		parsed,
		(raw) => AnalyzeContentOutputSchema.parse(raw),
	);
};

export const classifyText: TextrazorEndpoints['classifyText'] = async (
	ctx,
	input,
) => {
	const parsed = ClassifyTextInputSchema.parse(input);
	return runAnalysis(
		ctx,
		'textrazor.analysis.classifyText',
		analysisForm({
			...parsed,
			extractors: parsed.extractors ?? ['entities'],
		}),
		parsed,
		(raw) => ClassifyTextOutputSchema.parse(raw),
	);
};

export const extractEntities: TextrazorEndpoints['extractEntities'] = async (
	ctx,
	input,
) => {
	const parsed = ExtractEntitiesInputSchema.parse(input);
	return runAnalysis(
		ctx,
		'textrazor.analysis.extractEntities',
		analysisForm({
			...parsed,
			extractors: parsed.extractors ?? ['entities'],
		}),
		parsed,
		(raw) => ExtractEntitiesOutputSchema.parse(raw),
	);
};
