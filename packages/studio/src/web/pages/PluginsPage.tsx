import { useEffect, useState } from 'react';
import type { PluginInfo } from '../api';
import { api } from '../api';
import {
	Badge,
	Button,
	Card,
	EmptyState,
	Input,
	Section,
} from '../components/Primitives';
import { PluginDetail } from './PluginDetail';

export function PluginsPage({
	tenant,
	multiTenancy,
	selectedPluginId,
	onSelectPlugin,
}: {
	tenant: string;
	multiTenancy: boolean;
	selectedPluginId: string | null;
	onSelectPlugin: (pluginId: string | null) => void;
}) {
	const [plugins, setPlugins] = useState<PluginInfo[] | null>(null);
	const [tenants, setTenants] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [scope, setScope] = useState<'main' | 'tenant'>('main');
	const [activeTenant, setActiveTenant] = useState(tenant);
	const [newTenant, setNewTenant] = useState('');
	const [creatingTenant, setCreatingTenant] = useState(false);

	const refresh = () => {
		api
			.plugins(scope === 'tenant' ? activeTenant : undefined, scope)
			.then(setPlugins)
			.catch((e) => setError(e.message));
	};

	const refreshTenants = () => {
		api
			.listTenants()
			.then((res) => setTenants(res.tenants))
			.catch((e) => setError(e.message));
	};

	useEffect(() => {
		refresh();
	}, [scope, activeTenant]);

	useEffect(() => {
		setActiveTenant(tenant);
	}, [tenant]);

	useEffect(() => {
		if (multiTenancy) {
			refreshTenants();
		}
	}, [multiTenancy]);

	useEffect(() => {
		if (tenants.length === 0) return;
		if (!tenants.includes(activeTenant)) {
			setActiveTenant(tenants[0]!);
		}
	}, [tenants, activeTenant]);

	const createTenant = async () => {
		const candidate = newTenant.trim();
		if (!candidate) return;
		setCreatingTenant(true);
		setError(null);
		try {
			await api.createTenant({ tenantId: candidate });
			setNewTenant('');
			setScope('tenant');
			setActiveTenant(candidate);
			await refreshTenants();
			await refresh();
		} catch (e) {
			setError((e as Error).message);
		} finally {
			setCreatingTenant(false);
		}
	};

	if (error) {
		return <EmptyState title="Couldn't load plugins" hint={error} />;
	}
	if (!plugins) {
		return <EmptyState title="Loading plugins…" />;
	}

	if (selectedPluginId) {
		return (
			<PluginDetail
				pluginId={selectedPluginId}
				tenant={activeTenant}
				scope={scope}
				onBack={() => {
					onSelectPlugin(null);
					refresh();
				}}
			/>
		);
	}

	if (plugins.length === 0) {
		return (
			<div className="flex flex-col gap-4">
				<PluginsToolbar
					multiTenancy={multiTenancy}
					scope={scope}
					setScope={setScope}
					activeTenant={activeTenant}
					setActiveTenant={setActiveTenant}
					tenants={tenants}
					newTenant={newTenant}
					setNewTenant={setNewTenant}
					creatingTenant={creatingTenant}
					onCreateTenant={createTenant}
				/>
				<EmptyState
					title="No plugins configured"
					hint="Add a plugin to your corsair instance, then refresh."
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<PluginsToolbar
				multiTenancy={multiTenancy}
				scope={scope}
				setScope={setScope}
				activeTenant={activeTenant}
				setActiveTenant={setActiveTenant}
				tenants={tenants}
				newTenant={newTenant}
				setNewTenant={setNewTenant}
				creatingTenant={creatingTenant}
				onCreateTenant={createTenant}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{plugins.map((p) => (
					<Card
						key={p.id}
						className="p-4 cursor-pointer hover:border-[var(--color-border-strong)] transition-colors"
					>
						<button
							type="button"
							onClick={() => onSelectPlugin(p.id)}
							className="w-full text-left flex flex-col gap-3"
						>
							<div className="text-sm font-semibold">{p.id}</div>
							<div className="text-[11px] text-[var(--color-text-muted)]">
								auth: {p.authType}
								{p.oauth?.available ? ' · OAuth' : ''}
								{scope === 'main' ? ' · integration scope' : ''}
							</div>
							<div className="flex flex-wrap gap-1">
								{p.requiredFields.map((f) => (
									<Badge
										key={`${f.level}:${f.name}`}
										tone={f.set ? 'ok' : 'err'}
									>
										{f.name}
									</Badge>
								))}
							</div>
						</button>
					</Card>
				))}
				<div className="col-span-full flex justify-end">
					<Button variant="ghost" onClick={refresh}>
						↻ Refresh
					</Button>
				</div>
			</div>
		</div>
	);
}

function PluginsToolbar({
	multiTenancy,
	scope,
	setScope,
	activeTenant,
	setActiveTenant,
	tenants,
	newTenant,
	setNewTenant,
	creatingTenant,
	onCreateTenant,
}: {
	multiTenancy: boolean;
	scope: 'main' | 'tenant';
	setScope: (scope: 'main' | 'tenant') => void;
	activeTenant: string;
	setActiveTenant: (tenantId: string) => void;
	tenants: string[];
	newTenant: string;
	setNewTenant: (value: string) => void;
	creatingTenant: boolean;
	onCreateTenant: () => Promise<void>;
}) {
	if (!multiTenancy) return null;
	const tenantOptions = tenants.length > 0 ? tenants : ['default'];

	return (
		<div className="grid gap-3 lg:grid-cols-2">
			<Section title="View scope">
				<Card className="p-3 flex items-center gap-2">
					<select
						value={scope}
						onChange={(e) =>
							setScope(e.target.value === 'main' ? 'main' : 'tenant')
						}
						className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)]"
					>
						<option value="main">Main (integration keys)</option>
						<option value="tenant">Tenant (account keys)</option>
					</select>
					{scope === 'tenant' ? (
						<select
							value={activeTenant}
							onChange={(e) => setActiveTenant(e.target.value)}
							className="h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)]"
						>
							{tenantOptions.map((tenantId) => (
								<option key={tenantId} value={tenantId}>
									{tenantId}
								</option>
							))}
						</select>
					) : null}
				</Card>
			</Section>
			<Section title="Create tenant">
				<Card className="p-3 flex items-center gap-2">
					<Input
						value={newTenant}
						onChange={(e) => setNewTenant(e.target.value)}
						placeholder="tenant-id"
					/>
					<Button
						variant="primary"
						disabled={creatingTenant || !newTenant.trim()}
						onClick={onCreateTenant}
					>
						{creatingTenant ? 'Creating…' : 'Create'}
					</Button>
				</Card>
			</Section>
		</div>
	);
}
