import { useEffect, useState } from 'react';
import type { ExecutionRow, ExecutionStatus } from '../api';
import { api } from '../api';
import { Card, EmptyState, Input, JsonView } from '../components/Primitives';

const PAGE_SIZE = 50;

type ExecutionsPageProps = {
	tenant: string;
	multiTenancy: boolean;
};

export function ExecutionsPage({ tenant, multiTenancy }: ExecutionsPageProps) {
	const [rows, setRows] = useState<ExecutionRow[]>([]);
	const [total, setTotal] = useState(0);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [note, setNote] = useState<string | null>(null);

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [filterPlugin, setFilterPlugin] = useState('');
	const [filterStatus, setFilterStatus] = useState<ExecutionStatus | ''>('');

	const [availablePlugins, setAvailablePlugins] = useState<string[]>([]);

	// Debounce search
	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedSearch(search.trim());
		}, 300);
		return () => window.clearTimeout(timer);
	}, [search]);

	// Reset offset when filters change
	useEffect(() => {
		setOffset(0);
	}, [tenant, filterPlugin, filterStatus, debouncedSearch]);

	// Load executions
	useEffect(() => {
		setLoading(true);
		setError(null);
		setNote(null);

		const filters: {
			tenant?: string;
			plugin?: string;
			status?: ExecutionStatus;
			search?: string;
			limit: number;
			offset: number;
		} = {
			limit: PAGE_SIZE,
			offset,
		};

		if (multiTenancy) {
			filters.tenant = tenant;
		}
		if (filterPlugin) {
			filters.plugin = filterPlugin;
		}
		if (filterStatus) {
			filters.status = filterStatus;
		}
		if (debouncedSearch) {
			filters.search = debouncedSearch;
		}

		api
			.listExecutions(filters)
			.then((result) => {
				setRows(result.rows);
				setTotal(result.total);
				setHasMore(result.hasMore);
				if (result.note) {
					setNote(result.note);
				}

				// Extract unique plugins from results for filter dropdown
				const plugins = new Set<string>();
				for (const row of result.rows) {
					if (row.plugin) plugins.add(row.plugin);
				}
				setAvailablePlugins((prev) => {
					const combined = new Set([...prev, ...Array.from(plugins)]);
					return Array.from(combined).sort();
				});
			})
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, [tenant, multiTenancy, filterPlugin, filterStatus, debouncedSearch, offset]);

	return (
		<div className="h-full min-h-0 flex flex-col gap-4">
			<Card className="p-3">
				<div className="flex items-center gap-3 flex-wrap">
					<div className="flex-1 min-w-[240px]">
						<Input
							placeholder="Search endpoint or error…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<select
						value={filterPlugin}
						onChange={(e) => setFilterPlugin(e.target.value)}
						className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
					>
						<option value="">All Plugins</option>
						{availablePlugins.map((plugin) => (
							<option key={plugin} value={plugin}>
								{plugin}
							</option>
						))}
					</select>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value as ExecutionStatus | '')}
						className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
					>
						<option value="">All Status</option>
						<option value="pending">Pending</option>
						<option value="completed">Completed</option>
						<option value="failed">Failed</option>
					</select>
				</div>
			</Card>

			{note ? (
				<Card className="p-3 bg-[var(--color-warn)]/5 border-[var(--color-warn)]/30">
					<div className="text-xs text-[var(--color-warn)]">{note}</div>
				</Card>
			) : null}

			{error ? (
				<Card className="p-3 bg-[var(--color-err)]/5 border-[var(--color-err)]/30">
					<div className="text-xs text-[var(--color-err)]">{error}</div>
				</Card>
			) : null}

			{loading && rows.length === 0 ? (
				<EmptyState title="Loading executions…" />
			) : rows.length === 0 ? (
				<EmptyState
					title="No executions found"
					hint={
						note
							? undefined
							: 'Execution history will appear here once operations are performed'
					}
				/>
			) : (
				<>
					<div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)]">
						<div>
							Showing {offset + 1}-{offset + rows.length} of {total}
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
								disabled={offset === 0}
								className="h-7 px-3 rounded border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-bg-hover)]"
							>
								Previous
							</button>
							<button
								type="button"
								onClick={() => {
									if (hasMore) setOffset((current) => current + PAGE_SIZE);
								}}
								disabled={!hasMore}
								className="h-7 px-3 rounded border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-bg-hover)]"
							>
								Next
							</button>
						</div>
					</div>
					<Card className="overflow-auto">
						<ExecutionsTable rows={rows} />
					</Card>
				</>
			)}
		</div>
	);
}

function ExecutionsTable({ rows }: { rows: ExecutionRow[] }) {
	return (
		<div className="divide-y divide-[var(--color-border)]/70">
			{rows.map((row) => (
				<ExecutionRow key={row.id} row={row} />
			))}
		</div>
	);
}

function ExecutionRow({ row }: { row: ExecutionRow }) {
	const [expanded, setExpanded] = useState(false);

	const statusColor = {
		pending: 'var(--color-text-subtle)',
		completed: 'var(--color-success)',
		failed: 'var(--color-err)',
	}[row.status];

	const createdAt = new Date(row.created_at);
	const timeStr = createdAt.toLocaleString();

	return (
		<div className="px-4 py-3 hover:bg-[var(--color-bg-hover)]/30 transition-colors">
			<div className="flex items-start justify-between gap-4 mb-2">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
							{row.plugin}
						</span>
						<span className="text-[var(--color-text-subtle)]">›</span>
						<span className="font-mono text-xs">{row.endpoint}</span>
						<span
							className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded"
							style={{
								color: statusColor,
								backgroundColor: `${statusColor}20`,
								borderWidth: '1px',
								borderStyle: 'solid',
								borderColor: `${statusColor}40`,
							}}
						>
							{row.status}
						</span>
					</div>
					<div className="flex items-center gap-4 text-[11px] text-[var(--color-text-subtle)]">
						<span>{timeStr}</span>
						{row.duration_ms !== null && (
							<span>{row.duration_ms}ms</span>
						)}
						{row.tenant_id && (
							<span className="font-mono">tenant: {row.tenant_id}</span>
						)}
					</div>
				</div>
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					className="text-xs text-[var(--color-accent)] hover:underline"
				>
					{expanded ? 'Hide Details' : 'View Details'}
				</button>
			</div>

			{row.error && (
				<div className="mt-2 p-2 rounded bg-[var(--color-err)]/5 border border-[var(--color-err)]/30">
					<div className="text-[10px] uppercase tracking-wide text-[var(--color-err)] mb-1">
						Error
					</div>
					<div className="text-xs text-[var(--color-err)] font-mono whitespace-pre-wrap break-all">
						{row.error}
					</div>
				</div>
			)}

			{expanded && (
				<div className="mt-3 space-y-3">
					<DetailSection title="Input" data={row.input} />
					<DetailSection title="Output" data={row.output} />
					{row.permission_id && (
						<div className="text-[11px]">
							<span className="text-[var(--color-text-subtle)]">
								Permission ID:
							</span>{' '}
							<span className="font-mono text-[var(--color-text)]">
								{row.permission_id}
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function DetailSection({
	title,
	data,
}: {
	title: string;
	data: Record<string, unknown>;
}) {
	const isEmpty =
		!data || (typeof data === 'object' && Object.keys(data).length === 0);

	return (
		<div>
			<div className="text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] mb-1">
				{title}
			</div>
			{isEmpty ? (
				<div className="text-xs text-[var(--color-text-subtle)] italic">
					No data
				</div>
			) : (
				<div className="max-h-[300px] overflow-auto rounded border border-[var(--color-border)] p-2 bg-[var(--color-bg)]">
					<JsonView value={data} />
				</div>
			)}
		</div>
	);
}
