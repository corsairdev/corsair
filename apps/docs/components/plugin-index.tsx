import type { PluginSummary } from '@/lib/plugin-catalog';
import { listPlugins, POPULAR_PLUGIN_IDS } from '@/lib/plugin-catalog';
import { PluginSearchButton } from './plugin-index-client';

export function PluginIndex() {
	const plugins = listPlugins();
	const byId = new Map(plugins.map((p) => [p.id, p]));
	const marks = POPULAR_PLUGIN_IDS.map((id) => byId.get(id)).filter(
		(p): p is PluginSummary => p !== undefined,
	);

	return (
		<>
			<PluginSearchButton total={plugins.length} />
			<PluginMarks plugins={marks} />
		</>
	);
}

export function PluginMarks({ plugins }: { plugins: PluginSummary[] }) {
	return (
		<ul className="not-prose mt-6 flex flex-wrap gap-2">
			{plugins.map((p) => (
				<li key={p.id}>
					<a
						href={`/plugins/${p.id}/overview`}
						title={`${p.displayName} — ${p.counts.api} operations`}
						className="flex items-center gap-2 rounded-md border border-fd-border px-2.5 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:border-fd-foreground/25 hover:text-fd-foreground"
					>
						<img
							src={`/plugin-icons/${p.id}`}
							alt=""
							loading="lazy"
							decoding="async"
							className="size-4 shrink-0 rounded-[3px]"
						/>
						{p.displayName}
					</a>
				</li>
			))}
		</ul>
	);
}
