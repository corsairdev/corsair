import type { z } from 'zod';
import * as Ai from './schemas/ai';
import * as Amazon from './schemas/amazon';
import * as AppStore from './schemas/app-store';
import * as Backlinks from './schemas/backlinks';
import * as Keywords from './schemas/keywords';
import * as Serp from './schemas/serp';
import { taskEnvelope } from './schemas/shared';
import * as Utility from './schemas/utility';

export type { AmazonProduct } from './schemas/amazon';
export type { Backlink } from './schemas/backlinks';
export type { KeywordData } from './schemas/keywords';
export type { SerpItem } from './schemas/serp';
export type { Filter } from './schemas/shared';

/**
 * Every DataForSEO request is an array of tasks; the plugin sends one task per
 * call and returns the full response envelope, so `cost`, task status, and
 * the task `id` (needed for task-based App Store data) stay available.
 */
export const DataForSeoEndpointInputSchemas = {
	serpGoogleOrganic: Serp.GoogleOrganicInput,
	serpGoogleNews: Serp.GoogleNewsInput,
	serpLocations: Utility.SerpLocationsInput,
	serpLanguages: Utility.EmptyInput,
	keywordsSearchVolume: Keywords.SearchVolumeInput,
	keywordsSuggestions: Keywords.KeywordSuggestionsInput,
	keywordsIdeas: Keywords.KeywordIdeasInput,
	keywordsLocations: Utility.EmptyInput,
	backlinksSummary: Backlinks.BacklinksSummaryInput,
	backlinksList: Backlinks.BacklinksListInput,
	backlinksReferringDomains: Backlinks.ReferringDomainsInput,
	backlinksAnchors: Backlinks.AnchorsInput,
	backlinksCompetitors: Backlinks.CompetitorsInput,
	backlinksBulkRanks: Backlinks.BulkRanksInput,
	aiChatgptResponse: Ai.ChatGptResponseInput,
	aiPerplexityResponse: Ai.PerplexityResponseInput,
	aiGeminiResponse: Ai.GeminiResponseInput,
	aiMentionsSearch: Ai.MentionsSearchInput,
	aiMentionsTopDomains: Ai.MentionsTopDomainsInput,
	amazonProducts: Amazon.AmazonProductsInput,
	amazonAsin: Amazon.AmazonAsinInput,
	appStoreSearchTask: AppStore.AppSearchTaskInput,
	appStoreSearchResult: AppStore.TaskIdInput,
	appStoreInfoTask: AppStore.AppInfoTaskInput,
	appStoreInfoResult: AppStore.TaskIdInput,
	appStoreReviewsTask: AppStore.AppReviewsTaskInput,
	appStoreReviewsResult: AppStore.TaskIdInput,
	accountUserData: Utility.EmptyInput,
} as const;

export const DataForSeoEndpointOutputSchemas = {
	serpGoogleOrganic: taskEnvelope(Serp.GoogleOrganicResult),
	serpGoogleNews: taskEnvelope(Serp.GoogleNewsResult),
	serpLocations: taskEnvelope(Utility.SerpLocation),
	serpLanguages: taskEnvelope(Utility.SerpLanguage),
	keywordsSearchVolume: taskEnvelope(Keywords.SearchVolumeResult),
	keywordsSuggestions: taskEnvelope(Keywords.KeywordSuggestionsResult),
	keywordsIdeas: taskEnvelope(Keywords.KeywordIdeasResult),
	keywordsLocations: taskEnvelope(Utility.LabsLocation),
	backlinksSummary: taskEnvelope(Backlinks.BacklinksSummaryResult),
	backlinksList: taskEnvelope(Backlinks.BacklinksListResult),
	backlinksReferringDomains: taskEnvelope(Backlinks.ReferringDomainsResult),
	backlinksAnchors: taskEnvelope(Backlinks.AnchorsResult),
	backlinksCompetitors: taskEnvelope(Backlinks.CompetitorsResult),
	backlinksBulkRanks: taskEnvelope(Backlinks.BulkRanksResult),
	aiChatgptResponse: taskEnvelope(Ai.LlmResponseResult),
	aiPerplexityResponse: taskEnvelope(Ai.LlmResponseResult),
	aiGeminiResponse: taskEnvelope(Ai.LlmResponseResult),
	aiMentionsSearch: taskEnvelope(Ai.MentionsSearchResult),
	aiMentionsTopDomains: taskEnvelope(Ai.MentionsTopDomainsResult),
	amazonProducts: taskEnvelope(Amazon.AmazonProductsResult),
	amazonAsin: taskEnvelope(Amazon.AmazonAsinResult),
	appStoreSearchTask: taskEnvelope(AppStore.TaskPostResult),
	appStoreSearchResult: taskEnvelope(AppStore.AppSearchResult),
	appStoreInfoTask: taskEnvelope(AppStore.TaskPostResult),
	appStoreInfoResult: taskEnvelope(AppStore.AppInfoResult),
	appStoreReviewsTask: taskEnvelope(AppStore.TaskPostResult),
	appStoreReviewsResult: taskEnvelope(AppStore.AppReviewsResult),
	accountUserData: taskEnvelope(Utility.UserData),
} as const;

type Schemas<T extends Record<string, z.ZodType>> = {
	[K in keyof T]: z.infer<T[K]>;
};

export type DataForSeoEndpointInputs = Schemas<
	typeof DataForSeoEndpointInputSchemas
>;
export type DataForSeoEndpointOutputs = Schemas<
	typeof DataForSeoEndpointOutputSchemas
>;
