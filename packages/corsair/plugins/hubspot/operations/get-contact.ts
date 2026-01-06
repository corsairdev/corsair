import {
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
} from '../../base';
import type {
	GetContactResponse,
	HubSpotClient,
	HubSpotPlugin,
	HubSpotPluginContext,
} from '../types';

export const getContact = async ({
	config,
	client,
	contactId,
	properties,
	propertiesWithHistory,
	associations,
	archived,
	idProperty,
	ctx,
}: {
	config: HubSpotPlugin;
	client: HubSpotClient;
	contactId: string;
	properties?: string[];
	propertiesWithHistory?: string[];
	associations?: string[];
	archived?: boolean;
	idProperty?: string;
	ctx: HubSpotPluginContext;
}): Promise<GetContactResponse> => {
	const credentialCheck = validateCredentials(config, ['accessToken'], 'hubspot');
	if (!credentialCheck.valid) {
		return createErrorResponse(
			new Error(credentialCheck.error),
			credentialCheck.error,
		) as GetContactResponse;
	}

	try {
		const result = await client.getContact({
			contactId,
			properties,
			propertiesWithHistory,
			associations,
			archived,
			idProperty,
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
				tableName: 'contacts',
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

		return createSuccessResponse(responseData) as GetContactResponse;
	} catch (error) {
		return createErrorResponse(error) as GetContactResponse;
	}
};

