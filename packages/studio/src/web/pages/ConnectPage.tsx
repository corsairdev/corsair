import { useEffect, useMemo, useState } from 'react';
import type { PluginAuthState, PluginInfo } from '../api';
import { api } from '../api';
import { Badge, Button, Card, Input } from '../components/Primitives';

const PLUGIN_STYLES: Record<
	string,
	{ bg: string; text: string; name: string }
> = {
	github: {
		bg: 'bg-[#181717] border-zinc-800',
		text: 'text-white',
		name: 'GitHub',
	},
	slack: {
		bg: 'bg-[#4A154B] border-transparent',
		text: 'text-white',
		name: 'Slack',
	},
	gmail: {
		bg: 'bg-[#EA4335]/10 border-[#EA4335]/20',
		text: 'text-[#EA4335]',
		name: 'Gmail',
	},
	googlecalendar: {
		bg: 'bg-[#4285F4]/10 border-[#4285F4]/20',
		text: 'text-[#4285F4]',
		name: 'Google Calendar',
	},
	googlesheets: {
		bg: 'bg-[#34A853]/10 border-[#34A853]/20',
		text: 'text-[#34A853]',
		name: 'Google Sheets',
	},
	googledrive: {
		bg: 'bg-[#FBBC05]/10 border-[#FBBC05]/20',
		text: 'text-[#FBBC05]',
		name: 'Google Drive',
	},
	bluesky: {
		bg: 'bg-[#0085FF]/10 border-[#0085FF]/20',
		text: 'text-[#0085FF]',
		name: 'Bluesky',
	},
};

export function ConnectPage() {
	const searchParams = useMemo(
		() => new URLSearchParams(window.location.search),
		[],
	);
	const tenant = searchParams.get('tenant') || 'default';
	const pluginsParam = searchParams.get('plugins') || '';
	const redirectUri = searchParams.get('redirect_uri') || '';

	const [plugins, setPlugins] = useState<PluginInfo[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);

	const requestedPluginIds = useMemo(() => {
		return pluginsParam
			? pluginsParam
					.split(',')
					.map((p) => p.trim().toLowerCase())
					.filter(Boolean)
			: [];
	}, [pluginsParam]);

	const refresh = () => {
		setLoading(true);
		api
			.plugins(tenant, 'tenant')
			.then((allPlugins) => {
				const filtered =
					requestedPluginIds.length > 0
						? allPlugins.filter((p) =>
								requestedPluginIds.includes(p.id.toLowerCase()),
							)
						: allPlugins;
				setPlugins(filtered);
				setError(null);
			})
			.catch((e) => {
				setError(e.message || String(e));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		refresh();
	}, [tenant, requestedPluginIds]);

	const totalCount = plugins?.length ?? 0;
	const connectedCount = plugins?.filter((p) => p.authed).length ?? 0;
	const allConnected = totalCount > 0 && connectedCount === totalCount;

	useEffect(() => {
		if (allConnected && redirectUri) {
			setCountdown(3);
		} else {
			setCountdown(null);
		}
	}, [allConnected, redirectUri]);

	useEffect(() => {
		if (countdown === null) return;
		if (countdown <= 0) {
			window.location.href = redirectUri;
			return;
		}
		const timer = setTimeout(() => {
			setCountdown((c) => (c !== null ? c - 1 : null));
		}, 1000);
		return () => clearTimeout(timer);
	}, [countdown, redirectUri]);

	if (error) {
		return (
			<div className="min-h-full flex items-center justify-center p-6 bg-[var(--color-bg)]">
				<Card className="w-full max-w-md p-6 border-[var(--color-err)]/30 bg-[var(--color-err)]/5">
					<h2 className="text-sm font-semibold text-[var(--color-err)] mb-2">
						Error Connecting Apps
					</h2>
					<p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">
						{error}
					</p>
					<Button onClick={refresh}>Try Again</Button>
				</Card>
			</div>
		);
	}

	if (loading && !plugins) {
		return (
			<div className="min-h-full flex items-center justify-center p-6 bg-[var(--color-bg)]">
				<div className="text-xs text-[var(--color-text-muted)] animate-pulse">
					Loading connection details…
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-full w-full bg-[var(--color-bg)] flex items-center justify-center p-6 overflow-auto">
			<div className="w-full max-w-2xl flex flex-col gap-6 py-8">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
						<span className="text-lg">⚓</span> Corsair secure connection
					</div>
					<h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
						Connect your apps
					</h1>
					<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
						Your team uses Corsair to connect work tools. Choose each app below
						and sign in or paste the requested key. This only takes a minute.
					</p>
					<div className="flex gap-2 items-center mt-1">
						<Badge tone={allConnected ? 'ok' : 'warn'}>
							{connectedCount} of {totalCount} connected
						</Badge>
						<Badge tone="default">Account: {tenant}</Badge>
					</div>
				</div>

				{allConnected && (
					<div className="p-4 border border-[var(--color-ok)]/30 bg-[var(--color-ok)]/5 rounded-lg flex items-center justify-between gap-4 animate-fade-in">
						<div className="flex flex-col gap-0.5">
							<div className="text-xs font-semibold text-[var(--color-ok)]">
								All requested apps are connected.
							</div>
							<div className="text-[11px] text-[var(--color-text-muted)]">
								{countdown !== null
									? `Redirecting you back to the application in ${countdown} seconds...`
									: 'You can now close this page.'}
							</div>
						</div>
						{redirectUri && (
							<Button
								variant="primary"
								onClick={() => (window.location.href = redirectUri)}
							>
								Continue
							</Button>
						)}
					</div>
				)}

				<div className="flex flex-col gap-4">
					{plugins && plugins.length === 0 ? (
						<div className="p-8 border border-dashed border-[var(--color-border)] rounded-lg text-center text-xs text-[var(--color-text-muted)]">
							No plugins requested or configured.
						</div>
					) : (
						plugins?.map((plugin) => (
							<PluginConnectCard
								key={plugin.id}
								plugin={plugin}
								tenant={tenant}
								onUpdate={refresh}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}

function PluginConnectCard({
	plugin,
	tenant,
	onUpdate,
}: {
	plugin: PluginInfo;
	tenant: string;
	onUpdate: () => void;
}) {
	const [expanded, setExpanded] = useState(!plugin.authed);
	const [state, setState] = useState<PluginAuthState | null>(null);
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const [saving, setSaving] = useState(false);
	const [settingUp, setSettingUp] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [oauthPending, setOauthPending] = useState<null | {
		authUrl: string;
		redirectUri: string;
		note?: string;
	}>(null);
	const [manualCode, setManualCode] = useState('');

	const style = PLUGIN_STYLES[plugin.id.toLowerCase()] || {
		bg: 'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-hover)] border-[var(--color-border)]',
		text: 'text-[var(--color-text)]',
		name: plugin.id.charAt(0).toUpperCase() + plugin.id.slice(1),
	};

	const refreshCredentials = () => {
		setError(null);
		api
			.getCredentials({
				pluginId: plugin.id,
				tenantId: tenant,
				scope: 'tenant',
			})
			.then(setState)
			.catch(async (e) => {
				const msg = e.message || String(e);
				if (
					msg.includes('Integration "') ||
					msg.includes('Account not found for tenant')
				) {
					setSettingUp(true);
					try {
						await api.setupPlugin({ pluginId: plugin.id, tenantId: tenant });
						const fresh = await api.getCredentials({
							pluginId: plugin.id,
							tenantId: tenant,
							scope: 'tenant',
						});
						setState(fresh);
					} catch (setupErr: any) {
						setError(setupErr.message || String(setupErr));
					} finally {
						setSettingUp(false);
					}
				} else {
					setError(msg);
				}
			});
	};

	useEffect(() => {
		if (expanded) {
			refreshCredentials();
		}
	}, [expanded, plugin.id, tenant]);

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			await api.setCredentials({
				pluginId: plugin.id,
				tenantId: tenant,
				scope: 'tenant',
				fields: drafts,
			});
			setDrafts({});
			onUpdate();
			refreshCredentials();
		} catch (e: any) {
			setError(e.message || String(e));
		} finally {
			setSaving(false);
		}
	};

	const startOAuth = async () => {
		setError(null);
		try {
			const res = await api.startOAuth({
				pluginId: plugin.id,
				tenantId: tenant,
			});
			setOauthPending(res);
			window.open(res.authUrl, '_blank');
			const poll = setInterval(async () => {
				try {
					const fresh = await api.getCredentials({
						pluginId: plugin.id,
						tenantId: tenant,
						scope: 'tenant',
					});
					if (fresh.account.access_token) {
						clearInterval(poll);
						setOauthPending(null);
						setState(fresh);
						onUpdate();
					}
				} catch {
					/* keep polling */
				}
			}, 2000);
			setTimeout(() => clearInterval(poll), 5 * 60 * 1000);
		} catch (e: any) {
			setError(e.message || String(e));
		}
	};

	const submitManualCode = async () => {
		if (!manualCode.trim()) return;
		setError(null);
		try {
			await api.exchangeOAuth({
				pluginId: plugin.id,
				tenantId: tenant,
				code: manualCode.trim(),
			});
			setManualCode('');
			setOauthPending(null);
			onUpdate();
			refreshCredentials();
		} catch (e: any) {
			setError(e.message || String(e));
		}
	};

	const hasFields = useMemo(() => {
		if (!state) return false;
		return (
			Object.keys(state.integration).length > 0 ||
			Object.keys(state.account).length > 0
		);
	}, [state]);

	return (
		<Card className="overflow-hidden border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-all duration-200 hover:border-[var(--color-border-strong)]">
			<div
				className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center gap-3">
					<div
						className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border ${style.bg} ${style.text}`}
					>
						{style.name.charAt(0)}
					</div>
					<div className="flex flex-col">
						<div className="text-sm font-semibold text-[var(--color-text)]">
							{style.name}
						</div>
						<div className="text-[11px] text-[var(--color-text-muted)]">
							{style.name} plugin for Corsair
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Badge tone={plugin.authed ? 'ok' : 'warn'}>
						{plugin.authed ? 'Connected' : 'Action Required'}
					</Badge>
					<span className="text-xs text-[var(--color-text-subtle)] transform transition-transform duration-200">
						{expanded ? '▲' : '▼'}
					</span>
				</div>
			</div>

			{expanded && (
				<div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-bg)]/20 flex flex-col gap-4 animate-slide-down">
					{error && (
						<div className="text-xs text-[var(--color-err)] border border-[var(--color-err)]/30 rounded-md p-2.5 bg-[var(--color-err)]/5">
							{error}
						</div>
					)}

					{settingUp && (
						<div className="text-xs text-[var(--color-text-subtle)] animate-pulse py-2">
							Initializing client configuration…
						</div>
					)}

					{!settingUp && state && (
						<>
							{plugin.authType === 'oauth_2' ? (
								<div className="flex flex-col gap-3">
									<div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
										Sign in securely with the app. You can sign in again to use
										a different account.
									</div>
									<div className="flex justify-start">
										<Button variant="primary" onClick={startOAuth}>
											🔑 Sign in
										</Button>
									</div>

									{oauthPending && (
										<div className="mt-2 border border-[var(--color-border)] rounded-md p-3 bg-[var(--color-bg-elevated)] flex flex-col gap-3 text-xs">
											<div className="text-[var(--color-text-muted)]">
												Authorization listener active at:{' '}
												<code className="text-[var(--color-text)] bg-[var(--color-bg)] px-1 py-0.5 rounded border border-[var(--color-border)] font-mono">
													{oauthPending.redirectUri}
												</code>
											</div>
											<div>
												Authorize in the opened browser tab. If you were not
												redirected, paste the authorization code below:
											</div>
											{oauthPending.note && (
												<div className="text-[var(--color-warn)]">
													{oauthPending.note}
												</div>
											)}
											<div className="flex gap-2 max-w-md">
												<Input
													value={manualCode}
													onChange={(e) => setManualCode(e.target.value)}
													placeholder="Paste code here..."
												/>
												<Button
													onClick={submitManualCode}
													disabled={!manualCode.trim()}
												>
													Exchange
												</Button>
											</div>
										</div>
									)}
								</div>
							) : null}

							{Object.entries(state.integration).length > 0 && (
								<div className="flex flex-col gap-2">
									<div className="text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
										Integration configuration
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{Object.entries(state.integration).map(([k, v]) => (
											<Field
												key={k}
												name={k}
												masked={v}
												value={drafts[k] ?? ''}
												onChange={(val) =>
													setDrafts((d) => ({ ...d, [k]: val }))
												}
											/>
										))}
									</div>
								</div>
							)}

							{Object.entries(state.account).length > 0 && (
								<div className="flex flex-col gap-2 mt-2">
									<div className="text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
										Account configuration
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{Object.entries(state.account).map(([k, v]) => (
											<Field
												key={k}
												name={k}
												masked={v}
												value={drafts[k] ?? ''}
												onChange={(val) =>
													setDrafts((d) => ({ ...d, [k]: val }))
												}
											/>
										))}
									</div>
								</div>
							)}

							{hasFields && (
								<div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-3 mt-1">
									<Button variant="ghost" onClick={refreshCredentials}>
										Reset
									</Button>
									<Button
										variant="primary"
										onClick={save}
										disabled={saving || Object.values(drafts).every((v) => !v)}
									>
										{saving ? 'Saving…' : 'Save configuration'}
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</Card>
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
		<label className="flex flex-col gap-1.5">
			<span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase tracking-wider flex items-center gap-1.5">
				{name}
				{masked ? (
					<span
						className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-ok)]"
						title="Credential is set"
					/>
				) : (
					<span
						className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-err)]"
						title="Credential is empty"
					/>
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
