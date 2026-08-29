import { z } from 'zod';
import type { PostmanClient } from '../client';

const CreateCollectionOutput = z.object({
	collection: z.object({
		id: z.string(),
		name: z.string().optional(),
		uid: z.string().optional(),
	}),
});

export const POSTMAN_CREATE_A_COLLECTION = {
	name: 'Create a Collection',
	description: 'Create a new Postman collection in a workspace.',

	inputSchema: z.object({
		workspaceId: z.string().optional(),
		name: z.string().min(1),
		description: z.string().optional(),
	}),

	outputSchema: CreateCollectionOutput,

	execute: async (
		client: PostmanClient,
		input: {
			workspaceId?: string;
			name: string;
			description?: string;
		},
	) => {
		return client.post('/collections', {
			workspace: input.workspaceId ? { id: input.workspaceId } : undefined,
			collection: {
				info: {
					name: input.name,
					description: input.description,
					schema:
						'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
				},
				item: [],
			},
		});
	},
};
