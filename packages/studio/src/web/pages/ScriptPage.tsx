import { useState } from 'react';
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

	const run = async () => {
		setError(null);
		setRunning(true);
		try {
			const r = await api.runScript({ code, tenant });
			setResult(r);
		} catch (e) {
			setError((e as Error).message);
		} finally {
			setRunning(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<Section
				title="Script"
				action={
					<Button variant="primary" onClick={run} disabled={running}>
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
