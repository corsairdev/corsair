import { z } from 'zod';
import openseoManifestJson from '../openseo-manifest.json';

/**
 * openseo-manifest.json is OpenSEO's MCP tool list (`tools/list` on
 * https://app.openseo.so/mcp) cut down to what this plugin uses: one entry per
 * tool with its Corsair name (`keywords.research`), the MCP tool name
 * (`research_keywords`), and its published input and output JSON Schemas.
 *
 * The manifest is not run through zod at import: that would copy ~300 KB of
 * JSON into a second object graph on every load. `OpenseoManifestSchema`
 * checks the file in schema.test.ts instead.
 */

// `unknown` is necessary because JSON Schema documents contain provider-defined keywords.
const JsonSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*\.[a-z][A-Za-z0-9]*$/),
		tool: z.string().regex(/^[a-z][a-z0-9_]*$/),
		title: z.string(),
		description: z.string(),
		input: JsonSchemaDocument,
		output: JsonSchemaDocument,
	})
	.strict();

export const OpenseoManifestSchema = z
	.object({
		source: z.string().url(),
		operations: z.array(OperationSchema),
	})
	.strict();

export type OpenseoOperationDefinition = z.infer<typeof OperationSchema>;
export type OpenseoJsonSchema = z.infer<typeof JsonSchemaDocument>;
type OpenseoManifest = z.infer<typeof OpenseoManifestSchema>;

// Typed by OpenseoManifestSchema; schema.test.ts parses the file with it.
export const openseoManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with OpenseoManifestSchema.
	openseoManifestJson as unknown as OpenseoManifest;

export const openseoOperations: readonly OpenseoOperationDefinition[] =
	openseoManifest.operations;
