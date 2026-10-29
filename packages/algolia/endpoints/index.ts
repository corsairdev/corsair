import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AbTestsEndpoints } from './ab-tests';
import { AnalyticsEndpoints } from './analytics';
import { ApiKeysEndpoints } from './api-keys';
import { AuthenticationsEndpoints } from './authentications';
import { DestinationsEndpoints } from './destinations';
import { DictionariesEndpoints } from './dictionaries';
import { IndicesEndpoints } from './indices';
import { InsightsEndpoints } from './insights';
import { LogsEndpoints } from './logs';
import { PersonalizationEndpoints } from './personalization';
import { QuerySuggestionsEndpoints } from './query-suggestions';
import { algoliaRoutes } from './routes';
import { RulesEndpoints } from './rules';
import { RunsEndpoints } from './runs';
import { SearchEndpoints } from './search';
import { SourcesEndpoints } from './sources';
import { SynonymsEndpoints } from './synonyms';
import { TasksEndpoints } from './tasks';
import { TransformationsEndpoints } from './transformations';
import {
	AlgoliaEndpointInputSchemas,
	AlgoliaEndpointOutputSchemas,
} from './types';
import { UsageEndpoints } from './usage';

export const algoliaEndpointsNested = {
	abTests: AbTestsEndpoints,
	analytics: AnalyticsEndpoints,
	apiKeys: ApiKeysEndpoints,
	authentications: AuthenticationsEndpoints,
	destinations: DestinationsEndpoints,
	dictionaries: DictionariesEndpoints,
	indices: IndicesEndpoints,
	insights: InsightsEndpoints,
	logs: LogsEndpoints,
	personalization: PersonalizationEndpoints,
	querySuggestions: QuerySuggestionsEndpoints,
	rules: RulesEndpoints,
	runs: RunsEndpoints,
	search: SearchEndpoints,
	sources: SourcesEndpoints,
	synonyms: SynonymsEndpoints,
	tasks: TasksEndpoints,
	transformations: TransformationsEndpoints,
	usage: UsageEndpoints,
} as const;

export const algoliaEndpointMeta = Object.fromEntries(
	algoliaRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof algoliaEndpointsNested>;

export const algoliaEndpointSchemas = Object.fromEntries(
	algoliaRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: AlgoliaEndpointInputSchemas[route.key],
			output: AlgoliaEndpointOutputSchemas[route.key],
		},
	]),
);

export { AlgoliaEndpointInputSchemas, AlgoliaEndpointOutputSchemas };
export * from './routes';
export * from './types';
