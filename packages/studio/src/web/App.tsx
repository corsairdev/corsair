import { useEffect, useState } from 'react';
import type { StatusResp } from './api';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { DatabasePage } from './pages/DatabasePage';
import { OperationsPage } from './pages/OperationsPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { PluginsPage } from './pages/PluginsPage';
import { ScriptPage } from './pages/ScriptPage';

export type Route =
	| 'plugins'
	| 'operations'
	| 'database'
	| 'permissions'
	| 'script';

const TITLES: Record<Route, string> = {
	plugins: 'Plugins',
	operations: 'Operations',
	database: 'Data',
	permissions: 'Permissions',
	script: 'Script',
};

type AppLocation = {
	route: Route;
	pluginId: string | null;
};

const ROUTES = new Set<Route>([
	'plugins',
	'operations',
	'database',
	'permissions',
	'script',
]);

function parseLocation(pathname: string): AppLocation {
	const parts = pathname.split('/').filter(Boolean);
	const route = parts[0];
	if (!route || !ROUTES.has(route as Route)) {
		return { route: 'plugins', pluginId: null };
	}
	if (route === 'plugins' && parts[1]) {
		return {
			route: 'plugins',
			pluginId: decodeURIComponent(parts[1]),
		};
	}
	return { route: route as Route, pluginId: null };
}

function toPath({ route, pluginId }: AppLocation): string {
	if (route === 'plugins') {
		return pluginId ? `/plugins/${encodeURIComponent(pluginId)}` : '/plugins';
	}
	return `/${route}`;
}

export function App() {
	const [location, setLocation] = useState<AppLocation>(() =>
		parseLocation(window.location.pathname),
	);
	const [tenant, setTenant] = useState<string>(
		() => localStorage.getItem('corsair-studio:tenant') ?? 'default',
	);
	const [status, setStatus] = useState<StatusResp | null>(null);
	const [fatal, setFatal] = useState<string | null>(null);
	const route = location.route;

	const navigate = (next: AppLocation) => {
		setLocation(next);
		const path = toPath(next);
		if (window.location.pathname !== path) {
			window.history.pushState({}, '', path);
		}
	};

	useEffect(() => {
		api
			.status()
			.then(setStatus)
			.catch((e) => setFatal(e.message));
	}, []);

	useEffect(() => {
		localStorage.setItem('corsair-studio:tenant', tenant);
	}, [tenant]);

	useEffect(() => {
		const source = new EventSource('/api/events');
		const onCorsairChanged = () => {
			window.location.reload();
		};
		source.addEventListener('corsair-changed', onCorsairChanged);
		return () => {
			source.removeEventListener('corsair-changed', onCorsairChanged);
			source.close();
		};
	}, []);

	useEffect(() => {
		const onPopState = () => {
			setLocation(parseLocation(window.location.pathname));
		};
		window.addEventListener('popstate', onPopState);
		return () => {
			window.removeEventListener('popstate', onPopState);
		};
	}, []);

	if (fatal) {
		return (
			<div className="h-full flex items-center justify-center p-6">
				<div className="max-w-xl">
					<h1 className="text-xl font-semibold mb-2">Couldn't load Corsair</h1>
					<pre className="text-xs rounded-md bg-[var(--color-err)]/5 border border-[var(--color-err)]/30 p-3 whitespace-pre-wrap text-[var(--color-err)]">
						{fatal}
					</pre>
					<p className="text-xs text-[var(--color-text-muted)] mt-3">
						Make sure a <code>corsair.ts</code> exists in your project root (or{' '}
						<code>src/</code>, <code>lib/</code>, <code>server/</code>) and
						exports your corsair instance.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex">
			<Sidebar
				current={route}
				onNavigate={(nextRoute) => {
					navigate({ route: nextRoute, pluginId: null });
				}}
				tenant={tenant}
				setTenant={setTenant}
				multiTenancy={!!status?.multiTenancy}
				cwd={status?.cwd ?? null}
			/>

			<main className="flex-1 flex flex-col min-w-0 min-h-0">
				<header className="h-12 px-6 flex items-center justify-between border-b border-[var(--color-border)]">
					<h1 className="text-sm font-semibold">
						{route === 'plugins' && location.pluginId
							? `${TITLES[route]} / ${location.pluginId}`
							: TITLES[route]}
					</h1>
					{status ? (
						<div className="text-[11px] text-[var(--color-text-subtle)]">
							{status.pluginCount} plugins ·{' '}
							{status.hasDatabase ? 'DB' : 'no DB'}
						</div>
					) : null}
				</header>

				<div className="flex-1 min-h-0 overflow-auto p-6">
					{route === 'plugins' ? (
						<PluginsPage
							tenant={tenant}
							multiTenancy={!!status?.multiTenancy}
							selectedPluginId={location.pluginId}
							onSelectPlugin={(pluginId) => {
								navigate({ route: 'plugins', pluginId });
							}}
						/>
					) : null}
					{route === 'operations' ? <OperationsPage tenant={tenant} /> : null}
					{route === 'database' ? <DatabasePage /> : null}
					{route === 'permissions' ? <PermissionsPage /> : null}
					{route === 'script' ? <ScriptPage tenant={tenant} /> : null}
				</div>
			</main>
		</div>
	);
}
