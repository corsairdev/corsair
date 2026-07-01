import { useEffect, useState } from 'react';
import { api } from '../api';
import {
	Badge,
	Button,
	Card,
	EmptyState,
	JsonView,
	Textarea,
} from '../components/Primitives';

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

	const fetchRows = () => {
		let currentCancelled = false;
		api
			.permissions()
			.then((data) => {
				if (currentCancelled) return;
				setRows(data.rows as PermissionRow[]);
				setNote(data.note ?? null);
			})
			.catch((e) => !currentCancelled && setError(e.message));
		return () => {
			currentCancelled = true;
		};
	};

	useEffect(() => {
		let cancel = fetchRows();
		const iv = setInterval(() => {
			cancel();
			cancel = fetchRows();
		}, 5000);
		return () => {
			cancel();
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
				<PermissionRowView key={r.id} r={r} onUpdate={fetchRows} />
			))}
		</div>
	);
}

function PermissionRowView({
	r,
	onUpdate,
}: {
	r: PermissionRow;
	onUpdate: () => void;
}) {
	const [argsText, setArgsText] = useState(() => {
		let rawArgs = String(r.args);
		if (
			typeof r.error === 'string' &&
			r.error.startsWith('__corsair_modified_args__:')
		) {
			rawArgs = r.error.substring('__corsair_modified_args__:'.length);
			if (rawArgs.includes('__corsair_error__:')) {
				rawArgs = rawArgs.split('__corsair_error__:')[0] || '';
			}
		}
		try {
			return JSON.stringify(JSON.parse(rawArgs), null, 2);
		} catch {
			return rawArgs;
		}
	});
	const [submitting, setSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const isPending = r.status === 'pending';

	const handleAction = async (status: 'approved' | 'denied') => {
		setSubmitting(true);
		setErrorMsg(null);
		try {
			let parsed: unknown = null;
			if (status === 'approved') {
				try {
					parsed = JSON.parse(argsText);
				} catch {
					throw new Error('Invalid JSON payload');
				}
			}
			const originalParsed = tryParse(String(r.args));
			const isModified =
				status === 'approved' &&
				JSON.stringify(parsed) !== JSON.stringify(originalParsed);

			await api.updatePermission({
				id: r.id,
				status,
				args: isModified ? JSON.stringify(parsed) : undefined,
			});
			onUpdate();
		} catch (err: unknown) {
			setErrorMsg(err instanceof Error ? err.message : 'Action failed');
			setSubmitting(false);
		}
	};

	const hasModifiedArgs =
		typeof r.error === 'string' &&
		r.error.startsWith('__corsair_modified_args__:');

	let displayArgs = String(r.args);
	let displayError =
		r.error && !r.error.startsWith('__corsair_modified_args__:')
			? String(r.error)
			: null;

	if (hasModifiedArgs && typeof r.error === 'string') {
		let rawArgs = r.error.substring('__corsair_modified_args__:'.length);
		if (rawArgs.includes('__corsair_error__:')) {
			const parts = rawArgs.split('__corsair_error__:');
			rawArgs = parts[0] || '';
			displayError = parts[1] || null;
		}
		displayArgs = rawArgs;
	}

	return (
		<Card className="p-4 flex flex-col gap-3">
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

			{isPending ? (
				<div className="flex flex-col gap-2">
					<div className="text-xs text-[var(--color-text-muted)]">
						Edit Payload (Args)
					</div>
					<Textarea
						value={argsText}
						onChange={(e) => setArgsText(e.target.value)}
						disabled={submitting}
						className="min-h-[120px]"
					/>
					{errorMsg && (
						<div className="text-xs text-[var(--color-err)]">{errorMsg}</div>
					)}
					<div className="flex gap-2 justify-end mt-1">
						<Button
							variant="danger"
							disabled={submitting}
							onClick={() => handleAction('denied')}
						>
							Deny
						</Button>
						<Button
							variant="primary"
							disabled={submitting}
							onClick={() => handleAction('approved')}
						>
							Approve
						</Button>
					</div>
				</div>
			) : (
				<details>
					<summary className="cursor-pointer text-xs text-[var(--color-text-muted)]">
						Args {hasModifiedArgs && '(Modified)'}
					</summary>
					<div className="pt-2">
						<JsonView value={tryParse(displayArgs)} />
					</div>
				</details>
			)}

			{displayError ? (
				<pre className="text-xs whitespace-pre-wrap rounded bg-[var(--color-err)]/5 border border-[var(--color-err)]/30 p-2 text-[var(--color-err)]">
					{displayError}
				</pre>
			) : null}
		</Card>
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
