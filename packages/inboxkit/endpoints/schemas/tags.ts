import { z } from 'zod';
import { bool, num, str, WorkspaceId } from '../schema-helpers';

export const TagsInputSchemas = {
	tagsList: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	tagsCreate: z
		.object({
			workspaceId: WorkspaceId,
			name: z.string().describe('Tag name'),
			hexColor: z
				.string()
				.optional()
				.describe('Hex color code. Default "#3B82F6".'),
		})
		.strict(),
	tagsAssign: z
		.object({
			workspaceId: WorkspaceId,
			entityType: z
				.enum(['domains', 'mailboxes'])
				.describe('Type of entities to assign tags to'),
			entityUids: z.array(z.string()).describe('Array of entity UIDs'),
			tagUids: z
				.array(z.string())
				.optional()
				.describe('Array of tag UIDs to assign'),
			action: z
				.enum(['add', 'remove', 'set'])
				.describe(
					'Action to perform - add tags to existing, remove specific tags, or set/replace all tags. Default "add".',
				),
			createMissingTags: z
				.boolean()
				.optional()
				.describe("Whether to create tags if they don't exist. Default false."),
			newTags: z
				.array(
					z
						.object({
							name: z.string().optional().describe('Tag name'),
							hexColor: z
								.string()
								.optional()
								.describe('Hex color code. Default "#3B82F6".'),
						})
						.strict(),
				)
				.optional()
				.describe('New tags to create (if createMissingTags is true)'),
		})
		.strict(),
	tagsDelete: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Tag UID to delete'),
		})
		.strict(),
} as const;

export const TagsOutputSchemas = {
	tagsList: z
		.object({
			error: bool,
			message: str,
			tags: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							hexColor: str,
							usageCount: num,
							usedBy: z
								.object({
									domains: num,
									mailboxes: num,
								})
								.loose()
								.nullish(),
							createdAt: str,
							updatedAt: str,
						})
						.loose(),
				)
				.nullish(),
			total: num.describe('Total number of tags'),
		})
		.loose(),
	tagsCreate: z
		.object({
			error: bool,
			message: str,
			tag: z
				.object({
					uid: str.describe('Unique identifier for the tag'),
					name: str.describe('Tag name'),
					hexColor: str.describe('Hex color code for the tag'),
					usageCount: num.describe('Total number of entities using this tag'),
					usedBy: z
						.object({
							domains: num,
							mailboxes: num,
						})
						.loose()
						.nullish()
						.describe('Breakdown of usage by entity type'),
					createdAt: str.describe('Timestamp when the tag was created'),
					updatedAt: str.describe('Timestamp when the tag was last updated'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	tagsAssign: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					entitiesUpdated: num.describe('Number of entities updated'),
					totalEntities: num.describe('Total number of entities provided'),
					tags: z.array(str).nullish().describe('Tag UIDs that were assigned'),
					action: str.describe('Action performed'),
					createdTags: z
						.array(
							z
								.object({
									uid: str,
									name: str,
									hexColor: str,
								})
								.loose(),
						)
						.nullish()
						.describe('New tags created (if any)'),
					updatedEntities: z
						.array(
							z
								.object({
									uid: str,
									tags: z.array(str).nullish(),
								})
								.loose(),
						)
						.nullish()
						.describe('Updated entities with their current tags'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	tagsDelete: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
} as const;
