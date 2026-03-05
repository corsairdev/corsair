import {
	OperationNodeTransformer,
	type KyselyPlugin,
	type PluginTransformQueryArgs,
	type PluginTransformResultArgs,
	type PrimitiveValueListNode,
	type QueryResult,
	type RootOperationNode,
	type UnknownRow,
	type ValueNode,
} from 'kysely';

function serializeValue(v: unknown): unknown {
	if (v instanceof Date) return v.toISOString();
	if (v !== null && typeof v === 'object' && !Buffer.isBuffer(v))
		return JSON.stringify(v);
	return v;
}

/**
 * Kysely plugin for SQLite (better-sqlite3) that serializes JavaScript values
 * that the driver cannot bind natively:
 *
 * - Date → ISO 8601 string   (better-sqlite3 rejects Date objects)
 * - plain object / array → JSON string  (stored as TEXT, read back via parseJsonLike)
 *
 * Handles both ValueNode (WHERE clauses, complex expressions) and
 * PrimitiveValueListNode (INSERT/UPDATE with all-primitive rows — Kysely's
 * performance fast-path that bypasses ValueNode entirely).
 *
 * Applied only to the SQLite Kysely instance in createCorsairDatabase, so it
 * has no effect on Postgres connections.
 */
class SqliteSerializingTransformer extends OperationNodeTransformer {
	protected override transformValue(node: ValueNode): ValueNode {
		const serialized = serializeValue(node.value);
		return serialized === node.value ? node : { ...node, value: serialized };
	}

	protected override transformPrimitiveValueList(
		node: PrimitiveValueListNode,
	): PrimitiveValueListNode {
		const serialized = node.values.map(serializeValue);
		const changed = serialized.some((v, i) => v !== node.values[i]);
		return changed ? { ...node, values: serialized } : node;
	}
}

const transformer = new SqliteSerializingTransformer();

export class SqliteDatePlugin implements KyselyPlugin {
	transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
		return transformer.transformNode(args.node);
	}

	async transformResult(
		args: PluginTransformResultArgs,
	): Promise<QueryResult<UnknownRow>> {
		return args.result;
	}
}
