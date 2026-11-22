import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	CreateCampaignInput,
	CreateCampaignOutput,
	DeleteCampaignInput,
	DeleteCampaignOutput,
	GetCampaignContentInput,
	GetCampaignContentOutput,
	GetCampaignHistoryInput,
	GetCampaignHistoryOutput,
	GetCampaignInput,
	GetCampaignOutput,
	GetCampaignsInput,
	GetCampaignsOutput,
	ScheduleCampaignInput,
	ScheduleCampaignOutput,
	SendCampaignInput,
	SendCampaignOutput,
	SendTestCampaignInput,
	SendTestCampaignOutput,
	UpdateCampaignContentInput,
	UpdateCampaignContentOutput,
	UpdateCampaignInput,
	UpdateCampaignOutput,
} from './types';
import {
	CreateCampaignOutputSchema,
	DeleteCampaignOutputSchema,
	GetCampaignContentOutputSchema,
	GetCampaignHistoryOutputSchema,
	GetCampaignOutputSchema,
	GetCampaignsOutputSchema,
	LapostaEndpointInputSchemas,
	ScheduleCampaignOutputSchema,
	SendCampaignOutputSchema,
	SendTestCampaignOutputSchema,
	UpdateCampaignContentOutputSchema,
	UpdateCampaignOutputSchema,
} from './types';

export const campaigns = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetCampaignsInput,
	): Promise<GetCampaignsOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/campaign', ctx.key, {
			method: 'GET',
			query: parsedInput,
		});
		return GetCampaignsOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetCampaignInput,
	): Promise<GetCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.get'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(parsedInput.campaign_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		return GetCampaignOutputSchema.parse(raw);
	},

	create: async (
		ctx: LapostaPluginContext,
		input: CreateCampaignInput,
	): Promise<CreateCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.create'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/campaign', ctx.key, {
			method: 'POST',
			body: withCampaignListIds(parsedInput),
		});
		return CreateCampaignOutputSchema.parse(raw);
	},

	update: async (
		ctx: LapostaPluginContext,
		input: UpdateCampaignInput,
	): Promise<UpdateCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.update'].parse(input);
		const { campaign_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(campaign_id)}`,
			ctx.key,
			{ method: 'POST', body: withCampaignListIds(body) },
		);
		return UpdateCampaignOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LapostaPluginContext,
		input: DeleteCampaignInput,
	): Promise<DeleteCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.delete'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(parsedInput.campaign_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		return DeleteCampaignOutputSchema.parse(raw);
	},

	history: async (
		ctx: LapostaPluginContext,
		input: GetCampaignHistoryInput,
	): Promise<GetCampaignHistoryOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.history'].parse(input);
		const { campaign_id, ...query } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(campaign_id)}/history`,
			ctx.key,
			{ method: 'GET', query },
		);
		return GetCampaignHistoryOutputSchema.parse(raw);
	},

	get_content: async (
		ctx: LapostaPluginContext,
		input: GetCampaignContentInput,
	): Promise<GetCampaignContentOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.get_content'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(parsedInput.campaign_id)}/content`,
			ctx.key,
			{ method: 'GET' },
		);
		return GetCampaignContentOutputSchema.parse(raw);
	},

	update_content: async (
		ctx: LapostaPluginContext,
		input: UpdateCampaignContentInput,
	): Promise<UpdateCampaignContentOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.update_content'].parse(input);
		const { campaign_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(campaign_id)}/content`,
			ctx.key,
			{ method: 'POST', body },
		);
		return UpdateCampaignContentOutputSchema.parse(raw);
	},

	send: async (
		ctx: LapostaPluginContext,
		input: SendCampaignInput,
	): Promise<SendCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.send'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(parsedInput.campaign_id)}/action/send`,
			ctx.key,
			{ method: 'POST' },
		);
		return SendCampaignOutputSchema.parse(raw);
	},

	schedule: async (
		ctx: LapostaPluginContext,
		input: ScheduleCampaignInput,
	): Promise<ScheduleCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.schedule'].parse(input);
		const { campaign_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(campaign_id)}/action/schedule`,
			ctx.key,
			{ method: 'POST', body },
		);
		return ScheduleCampaignOutputSchema.parse(raw);
	},

	send_test: async (
		ctx: LapostaPluginContext,
		input: SendTestCampaignInput,
	): Promise<SendTestCampaignOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['campaigns.send_test'].parse(input);
		const { campaign_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(campaign_id)}/action/testmail`,
			ctx.key,
			{ method: 'POST', body },
		);
		return SendTestCampaignOutputSchema.parse(raw);
	},
};

/**
 * Whole lists stay `list_ids[]=<id>`. With segments, Laposta takes a keyed form:
 * `list_ids[0]=<list>` for a whole list and `list_ids[<list>][]=<segment>` per segment
 * (checked against the live API on 11-21).
 */
function withCampaignListIds<
	T extends { list_ids?: (string | Record<string, string[]>)[] },
>(
	body: T,
): Omit<T, 'list_ids'> & {
	list_ids?:
		| (string | Record<string, string[]>)[]
		| Record<string, string | string[]>;
} {
	const { list_ids } = body;
	if (!list_ids || list_ids.every((entry) => typeof entry === 'string')) {
		return body;
	}
	const keyed: Record<string, string | string[]> = {};
	list_ids.forEach((entry, index) => {
		if (typeof entry === 'string') {
			keyed[String(index)] = entry;
			return;
		}
		for (const [listId, segments] of Object.entries(entry)) {
			// The same list in two entries keeps every segment from both.
			const earlier = keyed[listId];
			keyed[listId] = Array.isArray(earlier)
				? [...new Set([...earlier, ...segments])]
				: segments;
		}
	});
	return { ...body, list_ids: keyed };
}
