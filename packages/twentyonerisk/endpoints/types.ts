import { z } from 'zod';

/**
 * 21RISK exposes a read-only OData v5 service. Query options follow the OData
 * specification, and responses are standard OData collection payloads.
 */

/**
 * OData boolean literals are the strings `true` and `false`.
 *
 * `z.coerce.boolean()` must not be used here: it applies `Boolean(value)`, so
 * the string `"false"` becomes `true` and `$count=false` would be sent as
 * `$count=true`.
 */
const ODataBoolean = z.union([
	z.boolean(),
	z.literal('true').transform(() => true),
	z.literal('false').transform(() => false),
]);

/** System query options accepted by the 21RISK OData endpoints. */
const ODataQuerySchema = z.object({
	/** OData filter expression, e.g. `Name eq 'Acme'`. */
	$filter: z.string().optional(),
	/** Maximum number of rows to return. */
	$top: z.coerce.number().int().positive().optional(),
	/** Number of rows to skip, for paging. */
	$skip: z.coerce.number().int().nonnegative().optional(),
	/** Comma-separated projection, e.g. `Id,Name`. */
	$select: z.string().optional(),
	/** Sort expression, e.g. `Name desc`. */
	$orderby: z.string().optional(),
	/** Ask the service to include the total row count in the response. */
	$count: ODataBoolean.optional(),
	/** Related entities to inline, e.g. `Site`. */
	$expand: z.string().optional(),
	/**
	 * Server-driven paging cursor.
	 *
	 * This is the value of the `$skiptoken` query parameter, not the whole
	 * `@odata.nextLink` URI. Continue a result set by parsing that link and
	 * passing the parameter it carries, e.g.
	 * `new URL(res['@odata.nextLink']).searchParams.get('$skiptoken')`.
	 */
	$skiptoken: z.string().optional(),
	/**
	 * Caps the size of a single response page, in megabytes. A 21RISK extension
	 * rather than an OData system option, so it carries no `$` prefix.
	 */
	maxPageSizeInMb: z.coerce.number().positive().optional(),
});

export type ODataQuery = z.infer<typeof ODataQuerySchema>;

/**
 * A standard OData collection response.
 *
 * Rows are left as open records: the field set of each entity is defined by the
 * service's `$metadata` document, which requires an authenticated request, so
 * it is not restated here. `.loose()` keeps every annotation the service sends
 * (`@odata.context`, `@odata.nextLink`, …) rather than dropping them.
 */
const ODataCollectionSchema = z
	.object({
		value: z.array(z.record(z.string(), z.unknown())),
		'@odata.count': z.number().optional(),
		'@odata.nextLink': z.string().optional(),
		'@odata.context': z.string().optional(),
	})
	.loose();

const OrganizationsGetInputSchema = ODataQuerySchema;

export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

const OrganizationsGetResponseSchema = ODataCollectionSchema;

export type OrganizationsGetResponse = z.infer<
	typeof OrganizationsGetResponseSchema
>;

export type TwentyOneRiskEndpointInputs = {
	organizationsGet: OrganizationsGetInput;
};

export type TwentyOneRiskEndpointOutputs = {
	organizationsGet: OrganizationsGetResponse;
};

export const TwentyOneRiskEndpointInputSchemas = {
	organizationsGet: OrganizationsGetInputSchema,
} as const;

export const TwentyOneRiskEndpointOutputSchemas = {
	organizationsGet: OrganizationsGetResponseSchema,
} as const;
