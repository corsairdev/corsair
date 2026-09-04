import {
	ConvoloAiEndpointInputSchemas,
	ConvoloAiEndpointOutputSchemas,
} from './endpoints/types';
import { ConvoloAiSchema } from './schema';

const VALID_INPUTS: Record<string, Record<string, unknown>> = {
	agentList: { page: 1 },
	agentListV2: {},
	agentGet: { id: 'a' },
	agentCreate: { body: { name: 'x' } },
	agentUpdate: { id: 'a', body: {} },
	agentDelete: { id: 'a' },
	agentUpdateSchedule: { id: 'a', body: {} },
	callList: { page: 0 },
	callListV5: {},
	callListWithTags: { filter_s2l_has_tag: true },
	callGetDetails: { callId: 'c' },
	callGetLog: { callId: 'c' },
	callGetEndWebhookPayload: { callId: 'c' },
	callListPayloadData: {},
	callSetS2lTag: { callId: 'c', body: {} },
	callSetRating: { callId: 'c', type: 'positive' },
	callTrigger: { api_key: 'k', widget_key: 'w', lc_number: '+15551234567' },
	leadList: { page: 1 },
	leadListByPost: { body: {} },
	leadGetOutcomeTags: { id: 'l' },
	widgetList: { page: 1 },
	widgetCreate: { body: {} },
	widgetGet: { id: 'w' },
	widgetUpdate: { id: 'w', body: {} },
	widgetUpdateV2: { widgetId: 'w', body: {} },
	widgetDelete: { id: 'w' },
	widgetToggle: { id: 3, new_state: 1 },
	widgetGetHtmlSiteCode: { id: 'w' },
	widgetUpdateSettings: { widget_key: 'k', api_key: 'k' },
	getCustomWidgetParams: { widget_key: 'k', api_key: 'k' },
	getOpenApiDocument: {},
};

describe('convoloai plugin schemas', () => {
	it('defines database entities', () => {
		expect(Object.keys(ConvoloAiSchema.entities)).toEqual([
			'agents',
			'calls',
			'leads',
			'widgets',
		]);
		for (const entity of Object.values(ConvoloAiSchema.entities)) {
			const parsed = (
				entity as { safeParse: (v: unknown) => { success: boolean } }
			)?.safeParse({ id: '1' });
			expect(parsed.success).toBe(true);
		}
	});

	it('covers every endpoint input schema with a valid fixture', () => {
		const keys = Object.keys(ConvoloAiEndpointInputSchemas);
		expect(keys).toHaveLength(31);
		expect(Object.keys(VALID_INPUTS).sort()).toEqual(keys.sort());
		for (const key of keys) {
			const result = ConvoloAiEndpointInputSchemas[
				key as keyof typeof ConvoloAiEndpointInputSchemas
			].safeParse(VALID_INPUTS[key]);
			expect(result.success).toBe(true);
		}
	});

	it('rejects invalid enum values and wrong types', () => {
		expect(
			ConvoloAiEndpointInputSchemas.callSetRating.safeParse({
				callId: 'c',
				type: 'great',
			}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.callList.safeParse({
				status: 'CallStatusType.NONSENSE',
			}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.callList.safeParse({ page: 'one' }).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.widgetList.safeParse({ sortBy: 'nope' })
				.success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.agentGet.safeParse({ id: '' }).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.widgetToggle.safeParse({
				id: '3',
				new_state: 1,
			}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.getCustomWidgetParams.safeParse({}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.callTrigger.safeParse({
				api_key: 'k',
				widget_key: 'w',
			}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.callTrigger.safeParse({
				api_key: 'k',
				widget_key: 'w',
				lc_number: '',
			}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.widgetToggle.safeParse({
				id: 3,
				new_state: 2,
			}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.agentCreate.safeParse({}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.widgetCreate.safeParse({}).success,
		).toBe(false);
		expect(
			ConvoloAiEndpointInputSchemas.callSetS2lTag.safeParse({ callId: 'c' })
				.success,
		).toBe(false);
	});

	it('output schemas accept objects and pass through provider fields', () => {
		const objectOutputs = Object.entries(ConvoloAiEndpointOutputSchemas).filter(
			([key]) => key !== 'agentDelete' && key !== 'widgetDelete',
		);
		for (const [key, schema] of objectOutputs) {
			const parsed = (
				schema as { safeParse: (v: unknown) => { success: boolean } }
			).safeParse({
				id: '1',
				extraProviderField: true,
			});
			expect(parsed.success).toBe(true);
		}
	});
});
