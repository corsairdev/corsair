import { logEventFromContext } from 'corsair/core';
import { makeSanityRequest } from '../client';
import type { SanityEndpoints } from '../index';
import { resolveTarget } from './shared';
import {
	SanityEndpointInputSchemas as Inputs,
	SanityEndpointOutputSchemas as Outputs,
} from './types';

type DeployedSchema = {
	_id?: string;
	_updatedAt?: string;
	workspace?: { name?: string; title?: string };
	schema?: string;
};

// unknown: one type or field of a deployed schema, any JSON.
type SchemaNode = Record<string, unknown>;

const text = (value: unknown) => (typeof value === 'string' ? value : null);

// unknown: reads a schema node's top-level fields for the summary.
function summarizeType(node: SchemaNode) {
	const fields = Array.isArray(node.fields)
		? (node.fields as SchemaNode[])
				.filter((field) => typeof field?.name === 'string')
				.map((field) => ({
					name: field.name as string,
					type: text(field.type),
					title: text(field.title),
					of: Array.isArray(field.of) ? field.of : null,
					to: Array.isArray(field.to) ? field.to : null,
				}))
		: null;
	return {
		name: String(node.name),
		type: text(node.type),
		title: text(node.title),
		fields,
	};
}

// unknown: the deployed schema is a JSON string of type definitions.
function parseTypes(raw: string | undefined): SchemaNode[] {
	if (!raw) return [];
	try {
		// unknown: JSON.parse output, narrowed to an array of type definitions just below.
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed)
			? (parsed as SchemaNode[]).filter(
					(node) => node && typeof node.name === 'string',
				)
			: [];
	} catch {
		return [];
	}
}

/**
 * Reads the schemas deployed to a dataset (`sanity schema deploy`), the same
 * route `sanity schemas list` uses; Sanity's HTTP reference doesn't cover it
 * yet. Their ids are what Agent Actions take as schemaId.
 */
export const list: SanityEndpoints['schemasList'] = async (ctx, rawInput) => {
	const input = Inputs.schemasList.parse(rawInput ?? {});
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const deployed = await makeSanityRequest<DeployedSchema[]>(
		ctx.key,
		{ projectId },
		`/projects/${projectId}/datasets/${dataset}/schemas`,
	);
	const schemas = (Array.isArray(deployed) ? deployed : [])
		.filter((entry) => typeof entry?._id === 'string')
		.map((entry) => {
			const types = parseTypes(entry.schema);
			const definition = input.type
				? types.find((node) => node.name === input.type)
				: undefined;
			return {
				schemaId: entry._id as string,
				workspace: entry.workspace?.name ?? null,
				title: entry.workspace?.title ?? null,
				deployedAt: entry._updatedAt ?? null,
				types: types.map(summarizeType),
				...(definition ? { definition } : {}),
			};
		});
	const response = Outputs.schemasList.parse({ schemas });
	await logEventFromContext(
		ctx,
		'sanity.schemas.list',
		{ dataset, count: schemas.length },
		'completed',
	);
	return response;
};
