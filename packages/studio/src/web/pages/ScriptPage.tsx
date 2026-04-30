import { useState,useEffect } from 'react';
import type { OperationResult } from '../api';
import { api } from '../api';
import {
	Badge,
	Button,
	Card,
	JsonView,
	Section,
	Textarea,
} from '../components/Primitives';

const SAMPLE = `// \`corsair\` is the resolved client (tenant-scoped if multi-tenant).
// Use \`return\` to surface a value. Filter inline — don't return giant lists.
const channels = await corsair.slack?.db.channels.list({});
return channels?.slice(0, 5);`;

export function ScriptPage({ tenant }: { tenant: string }) {
	const [code, setCode] = useState(SAMPLE);
	const [result, setResult] = useState<OperationResult | null>(null);
	const [running, setRunning] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tenants, setTenants] = useState<string[]>([]);
	const [activeTenant, setActiveTenant] = useState('');
	const [multiTenancy, setMultiTenancy] = useState(false);

	const refreshTenants = () => {
		api
			.listTenants()
			.then((res) => setTenants(res.tenants))
			.catch((e) => setError(e.message));
	};

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const status = await api.status();
				setMultiTenancy(status.multiTenancy);
				if (status.multiTenancy) {
					refreshTenants();
				}
			} catch (e) {
				console.error(e)
			}
		};
		fetchStatus();
	}, []);

	useEffect(() => {
		if (tenants.length === 0) return;
		if (activeTenant && !tenants.includes(activeTenant)) {
			setActiveTenant('');
		}
	}, [tenants]);

	const run = async () => {
		if (multiTenancy && !activeTenant) {
			setError('Please select a tenant before running the script.');
			return;
		}
		setError(null);
		setRunning(true);
		try {
			const r = await api.runScript({
				code,
				tenant: multiTenancy ? activeTenant : undefined
			});
			setResult(r);
		} catch (e) {
			setError((e as Error).message);
		} finally {
			setRunning(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{multiTenancy && (
				<Section title="Tenant">
					<Card className="p-3 flex items-center gap-2">
						<select
							value={activeTenant}
							onChange={(e) => setActiveTenant(e.target.value)}
							className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)]"
						>
							<option value="">Select tenant</option>
							{tenants.map((tenantId) => (
								<option key={tenantId} value={tenantId}>
									{tenantId}
								</option>
							))}
						</select>
					</Card>
				</Section>
			)}
			<Section
				title="Script"
				action={
					<Button
						variant="primary"
						onClick={run}
						disabled={running || (multiTenancy && !activeTenant)}
					>
						{running ? 'Running…' : '▶ Run'}
					</Button>
				}
			>
				<Card className="p-3">
					<Textarea
						rows={14}
						value={code}
						onChange={(e) => setCode(e.target.value)}
						spellCheck={false}
					/>
				</Card>
			</Section>

			{error ? (
				<div className="text-xs text-[var(--color-err)] border border-[var(--color-err)]/40 rounded p-2 bg-[var(--color-err)]/5">
					{error}
				</div>
			) : null}

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
		</div>
	);
}
