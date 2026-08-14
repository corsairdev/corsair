import { z } from 'zod';
import {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
} from '../schema/database';

/**
 * Input and output schemas for every BugSnag operation.
 *
 * Output schemas reuse the entity definitions in `schema/database.ts` rather than
 * restating them, so the persisted shape and the returned shape cannot drift apart.
 */

/* -------------------------------------------------------------------------- */
/*                                  Envelopes                                 */
/* -------------------------------------------------------------------------- */

/**
 * There is no envelope. A BugSnag list response is a **bare JSON array**, verified
 * live, with the paging state in the `Link` and `x-total-count` headers instead of
 * the body.
 *
 * That is why no `withEnvelope` helper appears here, unlike a provider that wraps
 * rows in `{ data, meta }`. See `endpoints/shared.ts` for why the headers cannot be
 * surfaced through the shared transport and how paging works instead.
 */
const listOf = <Item extends z.ZodType>(item: Item) => z.array(item);

/**
 * Paging parameters accepted by every list operation.
 *
 * `per_page` is bounded at 100 here as a deliberate client-side guard rather than
 * an API limit: `per_page=1000` was answered 200, so the API does not enforce a
 * ceiling and an unbounded value would let one call pull an arbitrarily large page.
 * `offset` is how a caller advances, since the `Link` header cannot be read.
 */
const ListQuery = {
	per_page: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
};

/**
 * BugSnag answers a successful DELETE with an empty body, so there is nothing to
 * parse. The operations report the outcome explicitly instead of returning an empty
 * object, which would be indistinguishable from a response that was swallowed.
 */
export const DeleteResultSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                                Input schemas                               */
/* -------------------------------------------------------------------------- */

const OrganizationId = z.object({ organization_id: z.string() });
const ProjectId = z.object({ project_id: z.string() });

/**
 * Project creation.
 *
 * `type` selects the notifier platform and is required - BugSnag uses it to decide
 * how to group and display errors, and there is no sensible default. The observed
 * project on the recon account was `android`; the full list is long and
 * platform-specific, so it is accepted as a string rather than an enum that would
 * reject a platform BugSnag adds later.
 */
const ProjectCreateInput = z.object({
	organization_id: z.string(),
	name: z.string().min(1),
	type: z.string().min(1),
});

/* -------------------------------------------------------------------------- */
/*                            Input schema registry                           */
/* -------------------------------------------------------------------------- */

export const BugsnagEndpointInputSchemas = {
	organizationsList: z.object(ListQuery),
	organizationsGet: OrganizationId,

	projectsList: z.object({ ...ListQuery, organization_id: z.string() }),
	projectsGet: ProjectId,
	projectsCreate: ProjectCreateInput,
	projectsDelete: ProjectId,

	collaboratorsList: z.object({ ...ListQuery, organization_id: z.string() }),
	collaboratorsGet: z.object({
		organization_id: z.string(),
		collaborator_id: z.string(),
	}),
} as const;

/* -------------------------------------------------------------------------- */
/*                           Output schema registry                           */
/* -------------------------------------------------------------------------- */

export const BugsnagEndpointOutputSchemas = {
	organizationsList: listOf(BugsnagOrganizationEntity),
	organizationsGet: BugsnagOrganizationEntity,

	projectsList: listOf(BugsnagProjectEntity),
	projectsGet: BugsnagProjectEntity,
	projectsCreate: BugsnagProjectEntity,
	projectsDelete: DeleteResultSchema,

	collaboratorsList: listOf(BugsnagCollaboratorEntity),
	collaboratorsGet: BugsnagCollaboratorEntity,
} as const;

export type BugsnagEndpointInputs = {
	[K in keyof typeof BugsnagEndpointInputSchemas]: z.infer<
		(typeof BugsnagEndpointInputSchemas)[K]
	>;
};

export type BugsnagEndpointOutputs = {
	[K in keyof typeof BugsnagEndpointOutputSchemas]: z.infer<
		(typeof BugsnagEndpointOutputSchemas)[K]
	>;
};
