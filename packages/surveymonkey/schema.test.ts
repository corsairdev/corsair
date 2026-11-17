import { SurveymonkeySchema } from './schema';

describe('surveymonkey schema', () => {
	it('declares a version and no entities', () => {
		// The plugin stores nothing: surveys and responses live in SurveyMonkey,
		// and syncing them would duplicate the account.
		expect(SurveymonkeySchema.version).toBe('1.0.0');
		expect(SurveymonkeySchema.entities).toEqual({});
	});

	it('declares a schema for every documented webhook event', () => {
		expect(Object.keys(SurveymonkeySchema.webhooks).sort()).toEqual([
			'collector_created',
			'collector_deleted',
			'collector_updated',
			'response_completed',
			'response_created',
			'response_deleted',
			'response_disqualified',
			'response_overquota',
			'response_updated',
			'survey_created',
			'survey_deleted',
			'survey_updated',
		]);
	});

	it('parses a delivery body and keeps the extra fields', () => {
		const parsed = SurveymonkeySchema.webhooks.response_completed.parse({
			event_type: 'response_completed',
			event_id: 'a1',
			object_type: 'response',
			object_id: '123456',
			// The documented callback: resources is an object of ids.
			resources: {
				respondent_id: '123456789',
				collector_id: '123456789',
				survey_id: '123456789',
			},
			// A field the vendor adds later must not fail the parse.
			something_new: true,
		});

		expect(parsed.event_type).toBe('response_completed');
		expect(parsed.resources?.survey_id).toBe('123456789');
	});

	it('rejects a body with no event type', () => {
		expect(
			SurveymonkeySchema.webhooks.survey_updated.safeParse({}).success,
		).toBe(false);
	});
});
