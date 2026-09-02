import { z } from 'zod';

/**
 * Query.currentUser — User
 * https://sourcegraph.com/docs/api/graphql
 */
export const SourcegraphUser = z
	.object({
		id: z.string(),
		username: z.string().optional(),
		displayName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		siteAdmin: z.boolean().optional(),
		viewerCanAdminister: z.boolean().optional(),
		avatarURL: z.string().nullable().optional(),
		url: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.loose();

/**
 * Query.repository / Query.repositories — Repository
 * https://sourcegraph.com/docs/api/graphql
 */
export const SourcegraphRepository = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		description: z.string().nullable().optional(),
		url: z.string().optional(),
		language: z.string().nullable().optional(),
	})
	.loose();

/**
 * Repository.commit — GitCommit
 * https://sourcegraph.com/docs/api/graphql
 */
export const SourcegraphCommit = z
	.object({
		id: z.string().optional(),
		oid: z.string(),
		abbreviatedOID: z.string().optional(),
		message: z.string().optional(),
		subject: z.string().optional(),
		url: z.string().optional(),
	})
	.loose();

/**
 * GitCommit.file — File
 * https://sourcegraph.com/docs/api/graphql
 */
export const SourcegraphFile = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		path: z.string(),
		content: z.string().optional(),
		binary: z.boolean().optional(),
	})
	.loose();

/**
 * Query.site — Site
 * https://sourcegraph.com/docs/api/graphql
 */
export const SourcegraphSite = z
	.object({
		id: z.string(),
		siteID: z.string().optional(),
		canReloadSite: z.boolean().optional(),
		viewerCanAdminister: z.boolean().optional(),
	})
	.loose();

export type SourcegraphUser = z.infer<typeof SourcegraphUser>;
export type SourcegraphRepository = z.infer<typeof SourcegraphRepository>;
export type SourcegraphCommit = z.infer<typeof SourcegraphCommit>;
export type SourcegraphFile = z.infer<typeof SourcegraphFile>;
export type SourcegraphSite = z.infer<typeof SourcegraphSite>;
