import {
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
} from '../../base';
import type {
	CreateDealResponse,
	HubSpotClient,
	HubSpotPlugin,
	HubSpotPluginContext,
} from '../types';

export const createDeal = async ({
	config,
	client,
	properties,
	associations,
	ctx,
}: {
	config: HubSpotPlugin;
	client: HubSpotClient;
	properties?: Record<string, unknown>;
	associations?: Array<{
		to: { id: string };
		types: Array<{
			associationCategory: string;
			associationTypeId: number;
		}>;
	}>;
	ctx: HubSpotPluginContext;
}): Promise<CreateDealResponse> => {
	const credentialCheck = validateCredentials(config, ['accessToken'], 'hubspot');
	if (!credentialCheck.valid) {
		return createErrorResponse(
			new Error(credentialCheck.error),
			credentialCheck.error,
		) as CreateDealResponse;
	}

	try {
		const result = await client.createDeal({
			properties,
			associations,
		});

		const responseData = {
			id: result.id,
			properties: result.properties,
			createdAt: result.createdAt,
			updatedAt: result.updatedAt,
			archived: result.archived,
		};

		await executeDatabaseHook(
			ctx,
			{
				tableName: 'deals',
				transform: () => ({
					id: result.id,
					properties: JSON.stringify(result.properties),
					created_at: result.createdAt,
					updated_at: result.updatedAt,
					archived: result.archived || false,
				}),
			},
			responseData,
		);

		return createSuccessResponse(responseData) as CreateDealResponse;
	} catch (error) {
		return createErrorResponse(error) as CreateDealResponse;
	}
};

