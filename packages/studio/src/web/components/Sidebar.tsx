import type { Route } from '../App';

const items: Array<{ id: Route; label: string; icon: string }> = [
	{ id: 'plugins', label: 'Plugins', icon: '◎' },
	{ id: 'operations', label: 'Operations', icon: '⇢' },
	{ id: 'database', label: 'Data', icon: '▤' },
	{ id: 'permissions', label: 'Permissions', icon: '⚑' },
	{ id: 'script', label: 'Script', icon: '›_' },
];

export function Sidebar({
	current,
	onNavigate,
	tenant,
	setTenant,
	multiTenancy,
	cwd,
}: {
	current: Route;
	onNavigate: (r: Route) => void;
	tenant: string;
	setTenant: (t: string) => void;
	multiTenancy: boolean;
	cwd: string | null;
}) {
	return (
		<aside className="w-56 flex-shrink-0 bg-[var(--color-bg-elevated)] border-r border-[var(--color-border)] flex flex-col">
			<div className="px-4 py-4 border-b border-[var(--color-border)]">
				<div className="text-sm font-semibold tracking-tight">
					Corsair Studio
				</div>
				<div
					className="text-[11px] text-[var(--color-text-subtle)] mt-0.5 truncate"
					title={cwd ?? ''}
				>
					{cwd ? cwd.split('/').slice(-2).join('/') : '…'}
				</div>
			</div>

			<nav className="flex flex-col p-2 gap-0.5">
				{items.map((item) => (
					<button
						type="button"
						key={item.id}
						onClick={() => onNavigate(item.id)}
						className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs text-left transition-colors ${
							current === item.id
								? 'bg-[var(--color-bg-hover)] text-[var(--color-text)]'
								: 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]'
						}`}
					>
						<span className="text-[var(--color-text-subtle)] w-4">
							{item.icon}
						</span>
						{item.label}
					</button>
				))}
			</nav>

			<div className="mt-auto px-3 py-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-subtle)]">
				{multiTenancy ? (
					<label className="flex flex-col gap-1">
						<span className="uppercase tracking-wide">Tenant</span>
						<input
							value={tenant}
							onChange={(e) => setTenant(e.target.value)}
							placeholder="default"
							className="h-7 px-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
						/>
					</label>
				) : (
					<span>Single-tenant</span>
				)}
			</div>
		</aside>
	);
}
