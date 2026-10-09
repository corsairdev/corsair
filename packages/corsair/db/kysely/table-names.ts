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

export function validateCorsairDbTables(overrides?: CorsairDbTables): void {
	if (!overrides) return;

	for (const key of CORSAIR_CORE_TABLE_NAMES) {
		const physical = overrides[key];
		if (physical === undefined) continue;
		if (typeof physical !== 'string' || physical.trim() === '') {
			throw new Error(
				`dbTables.${key} must be a non-empty string (got ${JSON.stringify(physical)})`,
			);
		}
	}

	const physicalNames = new Set<string>();
	for (const key of CORSAIR_CORE_TABLE_NAMES) {
		const physical = overrides[key];
		if (physical === undefined) continue;
		if (physicalNames.has(physical)) {
			throw new Error(
				`dbTables: duplicate physical table name "${physical}". Each logical Corsair table must map to a unique name.`,
			);
		}
		physicalNames.add(physical);
	}
}

export function corsairDbTablesHasOverrides(
	overrides?: CorsairDbTables,
): boolean {
	if (!overrides) return false;
	return CORSAIR_CORE_TABLE_NAMES.some((key) => {
		const physical = overrides[key];
		return physical !== undefined && physical !== key;
	});
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
	if (!corsairDbTablesHasOverrides(tableNames)) return db;
	return db.withPlugin(createTableNameMapPlugin(tableNames));
}
