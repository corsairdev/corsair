import { useEffect, useState } from 'react';
import { api } from '../api';
import { Badge, Card, EmptyState, JsonView } from '../components/Primitives';

type PermissionRow = Record<string, unknown> & {
	id: string;
	plugin: string;
	endpoint: string;
	status: string;
	args: string;
	expires_at: string;
	error?: string | null;
};

export function PermissionsPage() {
	const [rows, setRows] = useState<PermissionRow[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [note, setNote] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		const fetch = () =>
			api
				.permissions()
				.then((data) => {
					if (cancelled) return;
					setRows(data.rows as PermissionRow[]);
					setNote(data.note ?? null);
				})
				.catch((e) => !cancelled && setError(e.message));
		fetch();
		const iv = setInterval(fetch, 5000);
		return () => {
			cancelled = true;
			clearInterval(iv);
		};
	}, []);

	if (error) return <EmptyState title="Permissions unavailable" hint={error} />;
	if (!rows) return <EmptyState title="Loading…" />;
	if (rows.length === 0) {
		return (
			<EmptyState
				title="No approval requests yet"
				hint={note ?? 'Pending agent actions show up here in real time.'}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{rows.map((r) => (
				<Card key={r.id} className="p-4 flex flex-col gap-3">
					<div className="flex items-start justify-between gap-3">
						<div>
							<div className="font-mono text-sm">
								{String(r.plugin)}.{String(r.endpoint)}
							</div>
							<div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
								expires {String(r.expires_at)}
							</div>
						</div>
						<StatusBadge status={String(r.status)} />
					</div>
					<details>
						<summary className="cursor-pointer text-xs text-[var(--color-text-muted)]">
							Args
						</summary>
						<div className="pt-2">
							<JsonView value={tryParse(String(r.args))} />
						</div>
					</details>
					{r.error ? (
						<pre className="text-xs whitespace-pre-wrap rounded bg-[var(--color-err)]/5 border border-[var(--color-err)]/30 p-2 text-[var(--color-err)]">
							{String(r.error)}
						</pre>
					) : null}
				</Card>
			))}
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const tone =
		status === 'approved' || status === 'completed'
			? 'ok'
			: status === 'failed' || status === 'denied' || status === 'expired'
				? 'err'
				: 'warn';
	return <Badge tone={tone}>{status}</Badge>;
}

function tryParse(raw: string): unknown {
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}
