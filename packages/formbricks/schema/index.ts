import {
	FormbricksActionClassEntity,
	FormbricksContactAttributeKeyEntity,
	FormbricksSurveyEntity,
	FormbricksTeamEntity,
	FormbricksWebhookEntity,
} from './database';

/**
 * Five entities, all configuration.
 *
 * What is absent is the deliberate part. Responses, contacts, contact attributes and displays
 * are all reachable through this plugin and none is mirrored, because they are **collected
 * data from survey respondents** rather than account configuration. See `schema/responses.ts`
 * for the per-family reasoning.
 */
export const FormbricksSchema = {
	version: '1.0.0',
	entities: {
		surveys: FormbricksSurveyEntity,
		actionClasses: FormbricksActionClassEntity,
		webhooks: FormbricksWebhookEntity,
		contactAttributeKeys: FormbricksContactAttributeKeyEntity,
		teams: FormbricksTeamEntity,
	},
} as const;

export * from './database';
export * from './primitives';
export * from './responses';
