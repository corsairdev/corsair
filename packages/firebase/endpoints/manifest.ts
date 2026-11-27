import { z } from 'zod';
import firebaseManifestJson from '../firebase-manifest.json';

/**
 * firebase-manifest.json is Google's discovery documents for the Firebase
 * APIs (Firestore, Identity Toolkit v1 and v2, Hosting, Remote Config, FCM,
 * App Distribution, Security Rules, App Check, the Management API, Realtime
 * Database and Storage management, and Cloud Storage objects and buckets)
 * cut down to what this plugin uses, plus the Realtime Database's REST data
 * API, which has no discovery document. One entry per method with a flat
 * input schema (path, query and body fields in one object, each non-body
 * property marked with `x-corsair-in`), the request and response kind and
 * the response schema, plus the definitions they reference. Each
 * operation's `id` is its Corsair name (`firestore.databases.documents.get`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `FirebaseManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because JSON Schema documents carry arbitrary keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const ApiSchema = z
	.object({
		/** The operation group the API's methods live under (`firestore`). */
		group: z.string(),
		/** rootUrl + servicePath: where the method paths start. */
		baseUrl: z.string(),
		/** rootUrl alone: where upload paths start. */
		rootUrl: z.string(),
		version: z.string(),
		revision: z.string(),
	})
	.strict();

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		/** The discovery document the method comes from (`firestore_v1`), or `rtdb`. */
		api: z.string(),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		/** The method path; `{+name}` keeps the slashes of a full resource name. */
		path: z.string(),
		summary: z.string(),
		/** `json`: a JSON body. `none`: no body. */
		request: z.enum(['json', 'none']),
		/** `file`: the bytes as a Files output. `empty`: no body (or `{}`). */
		response: z.enum(['json', 'empty', 'file']),
		/** Media upload path: with `file` given, the bytes go there. */
		uploadPath: z.string().optional(),
		/** A list paged with pageToken / nextPageToken. */
		paged: z.literal(true).optional(),
		/** Query values always sent (`alt=media` for a download). */
		forcedQuery: z.record(z.string(), z.string()).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const FirebaseManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		apis: z.record(z.string(), ApiSchema),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type FirebaseOperationDefinition = z.infer<typeof OperationSchema>;
export type FirebaseApiDefinition = z.infer<typeof ApiSchema>;
export type FirebaseOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type FirebaseManifest = z.infer<typeof FirebaseManifestSchema>;

// Typed by FirebaseManifestSchema; schema.test.ts parses the file with it.
export const firebaseManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with FirebaseManifestSchema.
	firebaseManifestJson as unknown as FirebaseManifest;

export const firebaseOperations: readonly FirebaseOperationDefinition[] =
	firebaseManifest.operations;

export const firebaseApis: Record<string, FirebaseApiDefinition> =
	firebaseManifest.apis;

export const firebaseDefinitions: Record<string, FirebaseOpenApiSchema> =
	firebaseManifest.definitions;
