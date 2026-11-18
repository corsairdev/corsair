import type {
	KyselyPlugin,
	PluginTransformQueryArgs,
	PluginTransformResultArgs,
	QueryResult,
	RootOperationNode,
	SchemableIdentifierNode,
	TableNode,
	UnknownRow,
} from 'kysely';
import { OperationNodeTransformer } from 'kysely';

export const CORSAIR_CORE_TABLE_NAMES = [
	'corsair_integrations',
	'corsair_accounts',
	'corsair_entities',
	'corsair_events',
	'corsair_permissions',
] as const;

export type CorsairCoreTableName = (typeof CORSAIR_CORE_TABLE_NAMES)[number];

/** Maps Corsair logical table keys to physical table names in your database. */
export type CorsairDbTables = Partial<Record<CorsairCoreTableName, string>>;

export type CorsairResolvedTableNames = Record<CorsairCoreTableName, string>;

function identifierName(node: SchemableIdentifierNode): string {
	return node.identifier.name;
}

function withIdentifierName(
	node: SchemableIdentifierNode,
	name: string,
): SchemableIdentifierNode {
	if (identifierName(node) === name) return node;
	return {
		...node,
		identifier: { ...node.identifier, name },
	};
}

export function resolveCorsairDbTables(
	overrides?: CorsairDbTables,
): CorsairResolvedTableNames {
	return {
		corsair_integrations:
			overrides?.corsair_integrations ?? 'corsair_integrations',
		corsair_accounts: overrides?.corsair_accounts ?? 'corsair_accounts',
		corsair_entities: overrides?.corsair_entities ?? 'corsair_entities',
		corsair_events: overrides?.corsair_events ?? 'corsair_events',
		corsair_permissions:
			overrides?.corsair_permissions ?? 'corsair_permissions',
	};
}

/** Postgres truncates an identifier past this, silently. */
const MAX_IDENTIFIER_BYTES = 63;

const utf8 = new TextEncoder();

export function validateCorsairDbTables(overrides?: CorsairDbTables): void {
	if (!overrides) return;

	for (const key of Object.keys(overrides)) {
		if (!CORSAIR_CORE_TABLE_NAMES.includes(key as CorsairCoreTableName)) {
			throw new Error(
				`dbTables.${key} is not a Corsair table. Expected one of: ${CORSAIR_CORE_TABLE_NAMES.join(', ')}`,
			);
		}
	}

	for (const key of CORSAIR_CORE_TABLE_NAMES) {
		const physical = overrides[key];
		if (physical === undefined) continue;
		if (typeof physical !== 'string' || physical.trim() === '') {
			throw new Error(
				`dbTables.${key} must be a non-empty string (got ${JSON.stringify(physical)})`,
			);
		}
		// Two names agreeing up to the limit would become one table.
		if (utf8.encode(physical).length > MAX_IDENTIFIER_BYTES) {
			throw new Error(
				`dbTables.${key} must be at most ${MAX_IDENTIFIER_BYTES} bytes (got "${physical}")`,
			);
		}
	}

	// Over the resolved set, so an override onto a table left at its default
	// collides too. Scoped to one client: two instances picking the same name
	// is the caller's to prevent.
	const resolved = resolveCorsairDbTables(overrides);
	const owners = new Map<string, CorsairCoreTableName>();
	for (const key of CORSAIR_CORE_TABLE_NAMES) {
		const physical = resolved[key];
		const owner = owners.get(physical);
		if (owner) {
			throw new Error(
				`dbTables: duplicate physical table name "${physical}" (${owner} and ${key}). Each logical Corsair table must map to a unique name.`,
			);
		}
		owners.set(physical, key);
	}
}

export function tableNamesAreCustomized(
	tableNames: CorsairResolvedTableNames,
): boolean {
	return CORSAIR_CORE_TABLE_NAMES.some((key) => tableNames[key] !== key);
}

function createLogicalToPhysicalMap(
	tableNames: CorsairResolvedTableNames,
): Map<string, string> {
	const map = new Map<string, string>();
	for (const key of CORSAIR_CORE_TABLE_NAMES) {
		const physical = tableNames[key];
		if (physical !== key) {
			map.set(key, physical);
		}
	}
	return map;
}

class TableNameMapTransformer extends OperationNodeTransformer {
	constructor(private readonly logicalToPhysical: Map<string, string>) {
		super();
	}

	protected override transformTable(node: TableNode): TableNode {
		const transformed = super.transformTable(node);
		const logical = identifierName(transformed.table);
		const physical = this.logicalToPhysical.get(logical);
		if (!physical) return transformed;
		return {
			...transformed,
			table: withIdentifierName(transformed.table, physical),
		};
	}
}

export function createTableNameMapPlugin(
	tableNames: CorsairResolvedTableNames,
): KyselyPlugin {
	const logicalToPhysical = createLogicalToPhysicalMap(tableNames);
	const transformer = new TableNameMapTransformer(logicalToPhysical);

	return {
		transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
			if (logicalToPhysical.size === 0) return args.node;
			return transformer.transformNode(args.node);
		},
		async transformResult(
			args: PluginTransformResultArgs,
		): Promise<QueryResult<UnknownRow>> {
			return args.result;
		},
	};
}

export function applyCorsairTableNameMap<DB>(
	db: import('kysely').Kysely<DB>,
	tableNames: CorsairResolvedTableNames,
): import('kysely').Kysely<DB> {
	if (!tableNamesAreCustomized(tableNames)) return db;
	return db.withPlugin(createTableNameMapPlugin(tableNames));
}
