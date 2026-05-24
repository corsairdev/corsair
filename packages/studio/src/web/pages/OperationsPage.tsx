import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormFieldSchema, OperationResult } from '../api';
import { api } from '../api';
import {
	JsonFallbackEditor,
	OperationInputForm,
} from '../components/OperationInputForm';
import {
	Badge,
	Button,
	Card,
	EmptyState,
	JsonView,
	Section,
} from '../components/Primitives';

type OpType = 'api' | 'webhooks' | 'db';

export function OperationsPage({ tenant }: { tenant: string }) {
	const [type, setType] = useState<OpType>('api');
	const [paths, setPaths] = useState<Record<string, string[]> | null>(null);
	const [filter, setFilter] = useState('');
	const [selected, setSelected] = useState<string | null>(null);
	const [schema, setSchema] = useState<string | null>(null);
	const [structuredSchema, setStructuredSchema] =
		useState<FormFieldSchema | null>(null);
	const [inputMode, setInputMode] = useState<'form' | 'json'>('form');
	const [formJson, setFormJson] = useState<Record<string, unknown>>({});
	const [inputText, setInputText] = useState('{\n  \n}');
	const [running, setRunning] = useState(false);
	const [result, setResult] = useState<OperationResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setPaths(null);
		setSelected(null);
		setSchema(null);
		setStructuredSchema(null);
		setResult(null);
		api
			.listOperations({ type })
			.then((data) => setPaths(toOperationMap(data)))
			.catch((e) => setError(e.message));
	}, [type]);

	useEffect(() => {
		if (!selected) return;
		setSchema(null);
		setStructuredSchema(null);
		api
			.schema(selected)
			.then((r) => setSchema(r.schema))
			.catch((e) => setError(e.message));
		api
			.structuredSchema(selected)
			.then((r) => {
				setStructuredSchema(r.structured?.input ?? null);
				setInputMode(r.structured?.input ? 'form' : 'json');
			})
			.catch(() => {
				setStructuredSchema(null);
				setInputMode('json');
			});
	}, [selected]);

	const handleFormChange = useCallback((json: Record<string, unknown>) => {
		setFormJson(json);
		setInputText(JSON.stringify(json, null, 2));
	}, []);

	const filtered = useMemo(() => {
		if (!paths) return {};
		const term = filter.trim().toLowerCase();
		if (!term) return paths;
		const out: Record<string, string[]> = {};
		for (const [plugin, list] of Object.entries(paths)) {
			const ms = list.filter((p) => p.toLowerCase().includes(term));
			if (ms.length > 0) out[plugin] = ms;
		}
		return out;
	}, [paths, filter]);

	const run = async () => {
		if (!selected) return;
		setError(null);
		setRunning(true);
		try {
			let parsed: unknown;
			if (inputMode === 'form') {
				parsed = formJson;
			} else {
				try {
					parsed = JSON.parse(inputText || '{}');
				} catch {
					throw new Error('Input is not valid JSON.');
				}
			}
			const r = await api.runOperation({
				path: selected,
				input: parsed,
				tenant,
			});
			setResult(r);
		} catch (e) {
			setError((e as Error).message);
		} finally {
			setRunning(false);
		}
	};

	return (
		<div className="grid grid-cols-[320px_1fr] gap-6 h-full min-h-0">
			<div className="flex flex-col gap-3 min-h-0">
				<div className="flex gap-1">
					{(['api', 'webhooks', 'db'] as OpType[]).map((t) => (
						<Button
							key={t}
							variant={type === t ? 'primary' : 'default'}
							onClick={() => setType(t)}
						>
							{t}
						</Button>
					))}
				</div>

				<input
					placeholder="Filter…"
					className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)]"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				/>

				<div className="flex-1 min-h-0 overflow-auto border border-[var(--color-border)] rounded-lg">
					{!paths ? (
						<div className="p-4 text-xs text-[var(--color-text-muted)]">
							Loading…
						</div>
					) : Object.keys(filtered).length === 0 ? (
						<div className="p-4 text-xs text-[var(--color-text-muted)]">
							Nothing matches.
						</div>
					) : (
						Object.entries(filtered).map(([plugin, list]) => (
							<div
								key={plugin}
								className="border-b border-[var(--color-border)] last:border-b-0"
							>
								<div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] bg-[var(--color-bg-elevated)]">
									{plugin}
								</div>
								{list.map((p) => (
									<button
										key={p}
										type="button"
										onClick={() => setSelected(p)}
										className={`block w-full text-left px-3 py-1.5 text-xs font-mono truncate ${
											selected === p
												? 'bg-[var(--color-bg-hover)] text-[var(--color-accent)]'
												: 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text)]'
										}`}
									>
										{p}
									</button>
								))}
							</div>
						))
					)}
				</div>
			</div>

			<div className="flex flex-col gap-4 min-h-0 overflow-auto">
				{error ? (
					<div className="text-xs text-[var(--color-err)] border border-[var(--color-err)]/40 rounded p-2 bg-[var(--color-err)]/5">
						{error}
					</div>
				) : null}

				{!selected ? (
					<EmptyState
						title="Select an operation"
						hint="Pick a plugin endpoint, webhook, or DB query from the left."
					/>
				) : (
					<>
						<div className="flex items-center justify-between">
							<code className="text-sm text-[var(--color-accent)]">
								{selected}
							</code>
							<Badge>{type}</Badge>
						</div>

						<Section title="Schema">
							<Card className="p-0">
								<pre className="p-3 overflow-auto max-h-[320px] text-[11px] leading-relaxed">
									{schema ?? 'Loading…'}
								</pre>
							</Card>
						</Section>

						{type === 'webhooks' ? null : (
							<Section
								title="Run"
								action={
									<div className="flex items-center gap-2">
										{structuredSchema && (
											<div className="flex gap-1">
												<Button
													variant={inputMode === 'form' ? 'primary' : 'ghost'}
													onClick={() => {
														// Sync JSON editor content to form state when switching
														try {
															const parsed = JSON.parse(inputText || '{}');
															if (
																parsed &&
																typeof parsed === 'object' &&
																!Array.isArray(parsed)
															) {
																setFormJson(parsed);
															}
														} catch {
															// Keep existing formJson if JSON is invalid
														}
														setInputMode('form');
													}}
												>
													Form
												</Button>
												<Button
													variant={inputMode === 'json' ? 'primary' : 'ghost'}
													onClick={() => setInputMode('json')}
												>
													JSON
												</Button>
											</div>
										)}
										<Button variant="primary" onClick={run} disabled={running}>
											{running
												? 'Running…'
												: type === 'db'
													? 'Query'
													: '▶ Execute'}
										</Button>
									</div>
								}
							>
								<Card className="p-3">
									{inputMode === 'form' && structuredSchema ? (
										<div className="space-y-1">
											<div className="text-[11px] text-[var(--color-text-muted)] mb-2">
												Input
											</div>
											<OperationInputForm
												schema={structuredSchema}
												onChange={handleFormChange}
											/>
											<details className="mt-3">
												<summary className="text-[10px] text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text)]">
													JSON preview
												</summary>
												<pre className="mt-1 p-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[10px] overflow-auto max-h-[200px]">
													{JSON.stringify(formJson, null, 2)}
												</pre>
											</details>
										</div>
									) : (
										<div className="space-y-1">
											<div className="text-[11px] text-[var(--color-text-muted)] mb-1">
												Input (JSON)
											</div>
											<JsonFallbackEditor
												value={inputText}
												onChange={setInputText}
												rows={8}
											/>
										</div>
									)}
								</Card>
							</Section>
						)}

						{result ? (
							<Section
								title={`Result · ${result.durationMs}ms`}
								action={
									<Badge tone={result.ok ? 'ok' : 'err'}>
										{result.ok ? 'ok' : 'error'}
									</Badge>
								}
							>
								{result.ok ? (
									<JsonView value={result.result} />
								) : (
									<pre className="rounded-md bg-[var(--color-err)]/5 border border-[var(--color-err)]/30 p-3 overflow-auto max-h-[480px] text-xs whitespace-pre-wrap text-[var(--color-err)]">
										{result.error}
									</pre>
								)}
							</Section>
						) : null}
					</>
				)}
			</div>
		</div>
	);
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
		grouped[plugin]?.sort((a, b) => a.localeCompare(b));
	}
	return grouped;
}
