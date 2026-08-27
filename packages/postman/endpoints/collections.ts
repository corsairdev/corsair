import { z } from 'zod';
import { makePostmanRequest } from '../client';

const CreateCollectionInput = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionInput>;

export type CreateCollectionOutput = {
	collection: {
		id: string;
		name?: string;
		uid?: string;
	};
};

export const Collections = {
	create: {
		inputSchema: CreateCollectionInput,
		async execute(
			input: CreateCollectionInput,
			ctx: { key: string },
		): Promise<CreateCollectionOutput> {
			return makePostmanRequest<CreateCollectionOutput>(
				'/collections',
				ctx.key,
				{
					method: 'POST',
					body: {
						collection: {
							info: {
								name: input.name,
								...(input.description
									? { description: input.description }
									: {}),
								schema:
									'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
							},
							item: [],
						},
					},
				},
			);
		},
	},
} as const;
