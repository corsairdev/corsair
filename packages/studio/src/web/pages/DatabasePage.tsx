import { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, EmptyState, Input, JsonView } from '../components/Primitives';

const PAGE_SIZE = 30;

export function DatabasePage() {
	const [tenants, setTenants] = useState<string[]>([]);
	const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
	const [dbTree, setDbTree] = useState<Record<string, EntityPaths[]> | null>(
		null,
	);
	const [selectedIntegration, setSelectedIntegration] = useState<string | null>(
		null,
	);
	const [selectedEntity, setSelectedEntity] = useState<EntityPaths | null>(
		null,
	);
	const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [sortField, setSortField] = useState<'created_at' | 'updated_at'>(
		'updated_at',
	);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
	const [offset, setOffset] = useState(0);
	const [total, setTotal] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setError(null);
		Promise.all([api.listTenants(), api.listOperations({ type: 'db' })])
			.then(([tenantResp, operationResp]) => {
				setTenants(tenantResp.tenants);
				setSelectedTenant(
					(current) => current ?? tenantResp.tenants[0] ?? null,
				);
				const tree = toDbTree(operationResp);
				setDbTree(tree);
				const firstIntegration = Object.keys(tree).sort()[0] ?? null;
				setSelectedIntegration((current) => current ?? firstIntegration);
			})
			.catch((e) => setError(e.message));
	}, []);

	useEffect(() => {
		const integrationEntities = selectedIntegration
			? dbTree?.[selectedIntegration]
			: undefined;
		if (!integrationEntities?.length) {
			setSelectedEntity(null);
			return;
		}
		setSelectedEntity((current) => {
			if (
				current &&
				integrationEntities.some((entity) => entity.entity === current.entity)
			) {
				return current;
			}
			return integrationEntities[0] ?? null;
		});
	}, [selectedIntegration, dbTree]);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedSearch(search.trim());
		}, 250);
		return () => window.clearTimeout(timer);
	}, [search]);

	useEffect(() => {
		setOffset(0);
	}, [
		selectedTenant,
		selectedIntegration,
		selectedEntity?.entity,
		debouncedSearch,
		sortField,
		sortDirection,
	]);

	useEffect(() => {
		const activeEntity = selectedEntity;
		if (!selectedTenant || !selectedIntegration || !activeEntity) return;
		setLoading(true);
		setRows([]);
		setError(null);
		api
			.dbEntityRows({
				tenant: selectedTenant,
				integration: selectedIntegration,
				entity: activeEntity.entity,
				search: debouncedSearch || undefined,
				limit: PAGE_SIZE,
				offset,
				sortField,
				sortDirection,
			})
			.then((result) => {
				setRows(toRows(result.rows));
				setTotal(result.total);
				setHasMore(result.hasMore);
			})
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, [
		selectedTenant,
		selectedIntegration,
		selectedEntity,
		debouncedSearch,
		offset,
		sortField,
		sortDirection,
	]);

	if (error && !dbTree)
		return <EmptyState title="Data unavailable" hint={error} />;
	if (!dbTree) return <EmptyState title="Loading data browser…" />;

	const integrations = Object.keys(dbTree).sort();
	const entities = selectedIntegration
		? (dbTree[selectedIntegration] ?? [])
		: [];

	return (
		<div className="h-full min-h-0 flex flex-col gap-4">
			<Card className="p-3">
				<div className="flex items-center gap-3">
					<label className="text-[11px] uppercase tracking-wide text-[var(--color-text-subtle)]">
						Tenant
					</label>
					<select
						value={selectedTenant ?? ''}
						onChange={(e) => setSelectedTenant(e.target.value)}
						className="h-8 min-w-[220px] px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
					>
						{tenants.map((tenantId) => (
							<option key={tenantId} value={tenantId}>
								{tenantId}
							</option>
						))}
					</select>
					<div className="text-xs text-[var(--color-text-subtle)] truncate">
						{selectedTenant && selectedIntegration && selectedEntity
							? `${selectedTenant} / ${selectedIntegration} / ${selectedEntity.entity}`
							: 'Select integration and entity to inspect records'}
					</div>
					<div className="ml-auto w-[260px]">
						<Input
							placeholder="Search all payload fields…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={sortField}
							onChange={(e) =>
								setSortField(e.target.value as 'created_at' | 'updated_at')
							}
							className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
						>
							<option value="updated_at">Updated At</option>
							<option value="created_at">Created At</option>
						</select>
						<button
							type="button"
							onClick={() =>
								setSortDirection((current) =>
									current === 'asc' ? 'desc' : 'asc',
								)
							}
							className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]"
						>
							{sortDirection.toUpperCase()}
						</button>
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-[220px_240px_1fr] gap-4 h-full min-h-0">
				<BrowserPanel
					title="Integration"
					items={integrations}
					selected={selectedIntegration}
					onSelect={(integration) => setSelectedIntegration(integration)}
				/>
				<BrowserPanel
					title="Entity"
					items={entities.map((e) => e.entity)}
					selected={selectedEntity?.entity ?? null}
					onSelect={(entity) => {
						const next =
							entities.find((item) => item.entity === entity) ?? null;
						setSelectedEntity(next);
					}}
					extraHint={(entity) => {
						const candidate = entities.find((item) => item.entity === entity);
						if (candidate?.listPath && !candidate.searchPath)
							return 'list only';
						if (!candidate?.listPath && candidate?.searchPath)
							return 'search only';
						return null;
					}}
				/>

				<section className="flex flex-col gap-3 min-h-0 min-w-0">
					{error ? (
						<div className="text-xs text-[var(--color-err)] border border-[var(--color-err)]/40 rounded p-2 bg-[var(--color-err)]/5">
							{error}
						</div>
					) : null}

					{!selectedTenant ? (
						<EmptyState title="Pick a tenant" />
					) : !selectedIntegration ? (
						<EmptyState title="Pick an integration" />
					) : !selectedEntity ? (
						<EmptyState title="Pick an entity" />
					) : loading ? (
						<EmptyState title="Loading records…" />
					) : rows.length === 0 ? (
						<EmptyState title="No records found" />
					) : (
						<>
							<div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)]">
								<div>
									Showing {offset + 1}-{offset + rows.length} of {total}
								</div>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() =>
											setOffset((current) => Math.max(0, current - PAGE_SIZE))
										}
										disabled={offset === 0}
										className="h-7 px-2 rounded border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-bg-hover)]"
									>
										Prev
									</button>
									<button
										type="button"
										onClick={() => {
											if (hasMore) setOffset((current) => current + PAGE_SIZE);
										}}
										disabled={!hasMore}
										className="h-7 px-2 rounded border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-bg-hover)]"
									>
										Next
									</button>
								</div>
							</div>
							<Card className="overflow-auto min-w-0">
								<RowsTable rows={rows} />
							</Card>
						</>
					)}
				</section>
			</div>
		</div>
	);
}

function BrowserPanel({
	title,
	items,
	selected,
	onSelect,
	extraHint,
}: {
	title: string;
	items: string[];
	selected: string | null;
	onSelect: (value: string) => void;
	extraHint?: (value: string) => string | null;
}) {
	return (
		<div className="min-h-0">
			<div className="text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] mb-2">
				{title}
			</div>
			<Card className="h-full overflow-auto">
				<div className="flex flex-col p-1">
					{items.length === 0 ? (
						<div className="text-xs text-[var(--color-text-subtle)] px-2 py-1">
							No items
						</div>
					) : (
						items.map((name) => (
							<PanelButton
								key={name}
								name={name}
								selected={selected === name}
								hint={extraHint?.(name) ?? null}
								onClick={() => onSelect(name)}
							/>
						))
					)}
				</div>
			</Card>
		</div>
	);
}

function PanelButton({
	name,
	selected,
	hint,
	onClick,
}: {
	name: string;
	selected: boolean;
	hint?: string | null;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`text-left text-xs font-mono px-2 py-1.5 rounded truncate ${
				selected
					? 'bg-[var(--color-bg-hover)] text-[var(--color-accent)]'
					: 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text)]'
			}`}
		>
			<div className="truncate">{name}</div>
			{hint ? (
				<div className="text-[10px] text-[var(--color-text-subtle)] normal-case font-sans">
					{hint}
				</div>
			) : null}
		</button>
	);
}

function RowsTable({ rows }: { rows: Array<Record<string, unknown>> }) {
	return (
		<div className="divide-y divide-[var(--color-border)]/70">
			{rows.map((row, i) => (
				<div
					key={i}
					className="px-4 py-3 hover:bg-[var(--color-bg-hover)]/30 transition-colors"
				>
					<div className="flex flex-wrap items-start gap-x-6 gap-y-2 mb-2">
						<div className="min-w-[220px]">
							<div className="text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] mb-0.5">
								ID
							</div>
							<div className="font-mono text-[11px] text-[var(--color-text-subtle)] break-all">
								<Cell value={row.id} />
							</div>
						</div>
						<div className="min-w-[220px]">
							<div className="text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] mb-0.5">
								Entity ID
							</div>
							<div className="font-mono text-[11px] break-all">
								<Cell value={row.entity_id} />
							</div>
						</div>
					</div>
					<DataCell value={row.data} />
				</div>
			))}
		</div>
	);
}

function Cell({ value }: { value: unknown }) {
	if (value === null || value === undefined) {
		return <span className="text-[var(--color-text-subtle)]">null</span>;
	}
	if (value instanceof Date) return <>{value.toISOString()}</>;
	if (typeof value === 'string') {
		if (value.length > 80) {
			return <span title={value}>{value.slice(0, 80)}…</span>;
		}
		return <>{value}</>;
	}
	if (typeof value === 'object') {
		return (
			<details>
				<summary className="cursor-pointer text-[var(--color-text-muted)]">
					{Array.isArray(value) ? `[${value.length}]` : '{…}'}
				</summary>
				<div className="pt-2">
					<JsonView value={value} />
				</div>
			</details>
		);
	}
	return <>{String(value)}</>;
}

function DataCell({ value }: { value: unknown }) {
	if (value === null || value === undefined) {
		return <span className="text-[var(--color-text-subtle)]">null</span>;
	}
	const normalized = tryParseJsonString(value);
	if (typeof normalized !== 'object' || normalized === null) {
		return (
			<span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
				{String(normalized)}
			</span>
		);
	}
	return (
		<details>
			<summary className="cursor-pointer text-[11px] text-[var(--color-accent)] list-none inline-flex items-center gap-2">
				<span>Inspect payload</span>
				<span className="text-[10px] text-[var(--color-text-subtle)]">
					(JSON)
				</span>
			</summary>
			<div className="pt-2 max-w-full overflow-x-auto">
				<JsonView value={normalized} />
			</div>
		</details>
	);
}

function tryParseJsonString(value: unknown): unknown {
	if (typeof value !== 'string') return value;
	const trimmed = value.trim();
	if (
		!(trimmed.startsWith('{') && trimmed.endsWith('}')) &&
		!(trimmed.startsWith('[') && trimmed.endsWith(']'))
	) {
		return value;
	}
	try {
		return JSON.parse(trimmed);
	} catch {
		return value;
	}
}

type EntityPaths = {
	entity: string;
	listPath: string | null;
	searchPath: string | null;
};

function toDbTree(
	operations: Record<string, string[]> | string[] | string,
): Record<string, EntityPaths[]> {
	const operationMap = toOperationMap(operations);
	if (!Object.keys(operationMap).length) {
		return {};
	}
	const out: Record<string, Record<string, EntityPaths>> = {};
	for (const [plugin, paths] of Object.entries(operationMap)) {
		if (!Array.isArray(paths)) continue;
		for (const path of paths) {
			const parts = path.split('.');
			if (parts.length !== 4) continue;
			const pluginName = parts[0];
			const type = parts[1];
			const entity = parts[2];
			const method = parts[3];
			if (!pluginName || !type || !entity || !method) continue;
			if (pluginName !== plugin) continue;
			if (type !== 'db') continue;
			if (!out[plugin]) out[plugin] = {};
			if (!out[plugin][entity]) {
				out[plugin][entity] = { entity, listPath: null, searchPath: null };
			}
			if (method === 'list') out[plugin][entity].listPath = path;
			if (method === 'search') out[plugin][entity].searchPath = path;
		}
	}
	const tree: Record<string, EntityPaths[]> = {};
	for (const [plugin, entities] of Object.entries(out)) {
		tree[plugin] = Object.values(entities)
			.filter((entity) => entity.listPath || entity.searchPath)
			.sort((a, b) => a.entity.localeCompare(b.entity));
	}
	return tree;
}

function toOperationMap(
	operations: Record<string, string[]> | string[] | string,
): Record<string, string[]> {
	if (typeof operations === 'string') {
		return groupByPlugin(
			operations
				.split('\n')
				.map((value) => value.trim())
				.filter(Boolean),
		);
	}
	if (Array.isArray(operations)) {
		return groupByPlugin(
			operations
				.filter((value): value is string => typeof value === 'string')
				.map((value) => value.trim())
				.filter(Boolean),
		);
	}
	return operations ?? {};
}

function groupByPlugin(paths: string[]): Record<string, string[]> {
	const grouped: Record<string, string[]> = {};
	for (const path of paths) {
		const plugin = path.split('.', 1)[0];
		if (!plugin) continue;
		if (!grouped[plugin]) grouped[plugin] = [];
		grouped[plugin].push(path);
	}
	for (const plugin of Object.keys(grouped)) {
		const pluginPaths = grouped[plugin];
		if (!pluginPaths) continue;
		pluginPaths.sort((a, b) => a.localeCompare(b));
	}
	return grouped;
}

function toRows(result: unknown): Array<Record<string, unknown>> {
	if (!result) return [];
	if (Array.isArray(result)) {
		return result.filter(
			(row): row is Record<string, unknown> =>
				!!row && typeof row === 'object' && !Array.isArray(row),
		);
	}
	if (typeof result === 'object' && result && 'rows' in result) {
		const rows = (result as { rows?: unknown }).rows;
		if (Array.isArray(rows)) {
			return rows.filter(
				(row): row is Record<string, unknown> =>
					!!row && typeof row === 'object' && !Array.isArray(row),
			);
		}
	}
	return [];
}
