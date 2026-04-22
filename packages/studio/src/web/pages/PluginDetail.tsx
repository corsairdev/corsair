import { useEffect, useMemo, useState } from 'react';
import type { PluginAuthState } from '../api';
import { api } from '../api';
import { Badge, Button, Card, Input, Section } from '../components/Primitives';

export function PluginDetail({
	pluginId,
	tenant,
	scope,
	onBack,
}: {
	pluginId: string;
	tenant: string;
	scope: 'main' | 'tenant';
	onBack: () => void;
}) {
	const [state, setState] = useState<PluginAuthState | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const [saving, setSaving] = useState(false);
	const [settingUp, setSettingUp] = useState(false);
	const [oauthPending, setOauthPending] = useState<null | {
		authUrl: string;
		redirectUri: string;
		note?: string;
	}>(null);
	const [manualCode, setManualCode] = useState('');

	const refresh = () => {
		setError(null);
		api
			.getCredentials({
				pluginId,
				tenantId: tenant,
				scope,
			})
			.then(setState)
			.catch((e) => setError(e.message));
	};

	useEffect(refresh, [pluginId, tenant, scope]);

	const integrationEntries = useMemo(
		() => Object.entries(state?.integration ?? {}),
		[state],
	);
	const accountEntries = useMemo(
		() => Object.entries(state?.account ?? {}),
		[state],
	);
	const isSetupMissingError =
		!!error &&
		(error.includes('Integration "') ||
			error.includes('Account not found for tenant'));

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			await api.setCredentials({
				pluginId,
				tenantId: tenant,
				scope,
				fields: drafts,
			});
			setDrafts({});
			refresh();
		} catch (e) {
			setError((e as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const setupPlugin = async () => {
		setSettingUp(true);
		setError(null);
		try {
			await api.setupPlugin({
				pluginId,
				tenantId: tenant,
			});
			await refresh();
		} catch (e) {
			setError((e as Error).message);
		} finally {
			setSettingUp(false);
		}
	};

	const startOAuth = async () => {
		try {
			const res = await api.startOAuth({ pluginId, tenantId: tenant });
			setOauthPending(res);
			window.open(res.authUrl, '_blank');
			const poll = setInterval(async () => {
				try {
					const fresh = await api.getCredentials({
						pluginId,
						tenantId: tenant,
						scope,
					});
					if (fresh.account.access_token || scope === 'main') {
						clearInterval(poll);
						setOauthPending(null);
						setState(fresh);
					}
				} catch {
					/* keep polling */
				}
			}, 2000);
			setTimeout(() => clearInterval(poll), 5 * 60 * 1000);
		} catch (e) {
			setError((e as Error).message);
		}
	};

	const submitManualCode = async () => {
		if (!manualCode.trim()) return;
		try {
			await api.exchangeOAuth({
				pluginId,
				tenantId: tenant,
				code: manualCode.trim(),
			});
			setManualCode('');
			setOauthPending(null);
			refresh();
		} catch (e) {
			setError((e as Error).message);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" onClick={onBack}>
					← Back
				</Button>
				<h1 className="text-lg font-semibold">{pluginId}</h1>
				{state?.authType ? <Badge>{state.authType}</Badge> : null}
				<Badge>{scope === 'main' ? 'main scope' : `tenant: ${tenant}`}</Badge>
			</div>

			{error ? (
				<div className="text-xs text-[var(--color-err)] border border-[var(--color-err)]/40 rounded p-2 bg-[var(--color-err)]/5 flex items-center justify-between gap-3">
					<span>{error}</span>
					{isSetupMissingError ? (
						<Button
							variant="primary"
							onClick={setupPlugin}
							disabled={settingUp}
							className="whitespace-nowrap"
						>
							{settingUp
								? 'Creating…'
								: scope === 'main'
									? 'Create integration + account'
									: 'Create integration/account'}
						</Button>
					) : null}
				</div>
			) : null}

			{scope === 'tenant' && state?.authType === 'oauth_2' ? (
				<Section
					title="OAuth"
					action={
						<Button variant="primary" onClick={startOAuth}>
							Start OAuth flow
						</Button>
					}
				>
					<Card className="p-4 flex flex-col gap-2 text-xs">
						{oauthPending ? (
							<div className="flex flex-col gap-2">
								<div className="text-[var(--color-text-muted)]">
									Redirect listening at:{' '}
									<code className="text-[var(--color-text)]">
										{oauthPending.redirectUri}
									</code>
								</div>
								<div>
									Authorize in the browser tab. If your provider doesn't
									redirect to localhost, paste the code below.
								</div>
								{oauthPending.note ? (
									<div className="text-[var(--color-warn)]">
										{oauthPending.note}
									</div>
								) : null}
								<div className="flex gap-2 items-center">
									<Input
										value={manualCode}
										onChange={(e) => setManualCode(e.target.value)}
										placeholder="OAuth code…"
									/>
									<Button
										onClick={submitManualCode}
										disabled={!manualCode.trim()}
									>
										Exchange
									</Button>
								</div>
							</div>
						) : (
							<div className="text-[var(--color-text-muted)]">
								Starts a local listener, opens your browser to the provider, and
								saves tokens when it returns.
							</div>
						)}
					</Card>
				</Section>
			) : null}

			{integrationEntries.length > 0 ? (
				<Section title="Integration credentials">
					<Card className="p-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
							{integrationEntries.map(([k, v]) => (
								<Field
									key={k}
									name={k}
									masked={v}
									value={drafts[k] ?? ''}
									onChange={(val) => setDrafts((d) => ({ ...d, [k]: val }))}
								/>
							))}
						</div>
					</Card>
				</Section>
			) : null}

			{scope === 'tenant' && accountEntries.length > 0 ? (
				<Section title={`Account credentials · ${tenant}`}>
					<Card className="p-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
							{accountEntries.map(([k, v]) => (
								<Field
									key={k}
									name={k}
									masked={v}
									value={drafts[k] ?? ''}
									onChange={(val) => setDrafts((d) => ({ ...d, [k]: val }))}
								/>
							))}
						</div>
					</Card>
				</Section>
			) : null}

			<div className="flex justify-end gap-2">
				<Button variant="ghost" onClick={refresh}>
					↻ Refresh
				</Button>
				<Button
					variant="primary"
					onClick={save}
					disabled={saving || Object.values(drafts).every((v) => !v)}
				>
					{saving ? 'Saving…' : 'Save changes'}
				</Button>
			</div>
		</div>
	);
}

function Field({
	name,
	masked,
	value,
	onChange,
}: {
	name: string;
	masked: string | null;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<label className="flex flex-col gap-1">
			<span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wide flex items-center gap-2">
				{name}
				{masked ? (
					<Badge tone="ok">set</Badge>
				) : (
					<Badge tone="err">empty</Badge>
				)}
			</span>
			<Input
				type="text"
				value={value}
				placeholder={masked ?? 'unset'}
				onChange={(e) => onChange(e.target.value)}
			/>
		</label>
	);
}
