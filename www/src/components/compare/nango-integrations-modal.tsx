'use client';

import { MagnifyingGlass, X } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import {
	createContext,
	useContext,
	useEffect,
	useId,
	useMemo,
	useState,
} from 'react';

import catalog from '@/content/compare/nango-integrations.json';
import type { NangoIntegrationsCatalog } from '@/content/compare/nango-integrations.types';

const data = catalog as NangoIntegrationsCatalog;

type Filter = 'all' | 'with-operations' | 'auth-only';

type NangoCatalogContextValue = {
	open: () => void;
};

const NangoCatalogContext = createContext<NangoCatalogContextValue | null>(
	null,
);

function useNangoCatalog() {
	const context = useContext(NangoCatalogContext);
	if (!context) {
		throw new Error(
			'useNangoCatalog must be used within NangoIntegrationsCatalogProvider',
		);
	}
	return context;
}

const COUNT_LINK_CLASS =
	'inline-flex items-center rounded-md border border-[#4a38f5]/20 bg-[#4a38f5]/10 px-1.5 py-0.5 font-medium text-[#4a38f5] underline decoration-[#4a38f5]/40 underline-offset-2 transition-colors hover:border-[#4a38f5]/35 hover:bg-[#4a38f5]/15 hover:decoration-[#4a38f5]';

const TRIGGER_CLASS =
	'mt-5 inline-flex items-center justify-center rounded-full border border-[#1c1c1c] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#1c1c1c] transition-colors hover:bg-[#1c1c1c] hover:text-white font-[family-name:var(--landing-font-sans)]';

const FILTER_CLASS =
	'rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.04em] transition-colors font-[family-name:var(--landing-font-sans)]';

function filterIntegrations(
	integrations: NangoIntegrationsCatalog['integrations'],
	query: string,
	filter: Filter,
) {
	const normalizedQuery = query.trim().toLowerCase();

	return integrations.filter((integration) => {
		if (filter === 'with-operations' && !integration.hasOperations)
			return false;
		if (filter === 'auth-only' && integration.hasOperations) return false;

		if (!normalizedQuery) return true;

		return (
			integration.name.toLowerCase().includes(normalizedQuery) ||
			integration.id.toLowerCase().includes(normalizedQuery)
		);
	});
}

export function NangoIntegrationsCountLink() {
	const { open } = useNangoCatalog();

	return (
		<button type="button" onClick={open} className={COUNT_LINK_CLASS}>
			we counted
		</button>
	);
}

export function NangoIntegrationsCatalogProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<NangoCatalogContext.Provider value={{ open: () => setOpen(true) }}>
			{children}
			<NangoIntegrationsCatalogDialog
				open={open}
				onClose={() => setOpen(false)}
			/>
		</NangoCatalogContext.Provider>
	);
}

export function NangoIntegrationsModalTrigger() {
	const { open } = useNangoCatalog();

	return (
		<button type="button" onClick={open} className={TRIGGER_CLASS}>
			View all integrations
		</button>
	);
}

function NangoIntegrationsCatalogDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const titleId = useId();
	const descriptionId = useId();
	const searchId = useId();
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState<Filter>('all');

	const { stats } = data;

	const filtered = useMemo(
		() => filterIntegrations(data.integrations, query, filter),
		[query, filter],
	);

	useEffect(() => {
		if (!open) return;

		document.body.style.overflow = 'hidden';

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [open, onClose]);

	useEffect(() => {
		if (!open) {
			setQuery('');
			setFilter('all');
		}
	}, [open]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
		>
			<button
				type="button"
				aria-label="Close dialog"
				onClick={onClose}
				className="absolute inset-0 cursor-default bg-[#1c1c1c]/40 backdrop-blur-[2px]"
				tabIndex={-1}
			/>

			<div className="relative flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col border border-[#1c1c1c1a] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] animate-[landing-modal-in_220ms_ease-out] motion-reduce:animate-none sm:rounded-sm">
				<div className="shrink-0 border-b border-[#1c1c1c1a] px-5 py-6 sm:px-6 sm:py-8">
					<button
						type="button"
						onClick={onClose}
						aria-label="Close dialog"
						className="absolute top-4 right-4 p-1 text-[#1c1c1c40] transition-colors hover:text-[#1c1c1c]"
					>
						<X size={16} weight="bold" aria-hidden />
					</button>

					<h2
						id={titleId}
						className="pr-8 text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[#1c1c1c]"
					>
						{stats.percentWithoutOperations}% of Nango integrations don&apos;t
						have associated operations
					</h2>
					<p
						id={descriptionId}
						className="mt-4 max-w-xl text-sm leading-relaxed text-[#1c1c1c99]"
					>
						That&apos;s {stats.withoutOperations.toLocaleString()} of{' '}
						{stats.total.toLocaleString()} integrations in Nango&apos;s
						docs—auth and a generic requests proxy only, with no pre-built syncs
						or actions. Browse the full list below.
					</p>
					<p className="mt-3 font-[family-name:var(--landing-font-mono)] text-[10px] text-[#1c1c1c66]">
						Source: Nango docs · updated {data.generatedAt}
					</p>
				</div>

				<div className="shrink-0 space-y-3 border-b border-[#1c1c1c1a] px-5 py-4 sm:px-6">
					<label htmlFor={searchId} className="sr-only">
						Search integrations
					</label>
					<div className="relative">
						<MagnifyingGlass
							size={16}
							className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#1c1c1c66]"
							aria-hidden
						/>
						<input
							id={searchId}
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search integrations…"
							className="w-full rounded-sm border border-[#1c1c1c1a] bg-[#fafafa] py-2 pr-3 pl-9 text-sm text-[#1c1c1c] outline-none transition-colors placeholder:text-[#1c1c1c66] focus:border-[#1c1c1c33] font-[family-name:var(--landing-font-sans)]"
						/>
					</div>

					<div className="flex flex-wrap gap-2">
						{(
							[
								['all', `All (${stats.total.toLocaleString()})`],
								[
									'with-operations',
									`Has operations (${stats.withOperations.toLocaleString()})`,
								],
								[
									'auth-only',
									`Auth only (${stats.withoutOperations.toLocaleString()})`,
								],
							] as const
						).map(([value, label]) => (
							<button
								key={value}
								type="button"
								onClick={() => setFilter(value)}
								className={`${FILTER_CLASS} ${
									filter === value
										? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
										: 'border-[#1c1c1c1a] bg-white text-[#1c1c1c99] hover:border-[#1c1c1c33] hover:text-[#1c1c1c]'
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				<div className="min-h-0 flex-1 overflow-auto">
					<table className="w-full border-collapse text-left text-sm">
						<thead className="sticky top-0 z-[1] bg-[#f7f7f7]">
							<tr className="border-b border-[#1c1c1c1a]">
								<th
									scope="col"
									className="px-5 py-2.5 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-[0.06em] text-[#1c1c1c66] sm:px-6"
								>
									Integration
								</th>
								<th
									scope="col"
									className="px-5 py-2.5 text-right font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-[0.06em] text-[#1c1c1c66] sm:px-6"
								>
									API operations
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td
										colSpan={2}
										className="px-5 py-10 text-center text-[#1c1c1c66] sm:px-6"
									>
										No integrations match your search.
									</td>
								</tr>
							) : (
								filtered.map((integration) => (
									<tr
										key={integration.id}
										className="border-b border-[#1c1c1c0d] last:border-b-0"
									>
										<td className="px-5 py-2.5 text-[#1c1c1c] sm:px-6">
											{integration.name}
										</td>
										<td className="px-5 py-2.5 text-right sm:px-6">
											{integration.hasOperations ? (
												<span className="inline-flex items-center rounded-full border border-[#4a38f5]/25 bg-[#4a38f5]/8 px-2 py-0.5 font-[family-name:var(--landing-font-mono)] text-[10px] font-medium text-[#4a38f5]">
													Yes
													{integration.operationCount > 0
														? ` · ${integration.operationCount}`
														: ''}
												</span>
											) : (
												<span className="inline-flex items-center rounded-full border border-[#1c1c1c1a] bg-[#f4f4f4] px-2 py-0.5 font-[family-name:var(--landing-font-mono)] text-[10px] font-medium text-[#1c1c1c66]">
													No
												</span>
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="shrink-0 border-t border-[#1c1c1c1a] px-5 py-3 sm:px-6">
					<p className="font-[family-name:var(--landing-font-mono)] text-[10px] text-[#1c1c1c66]">
						Showing {filtered.length.toLocaleString()} of{' '}
						{stats.total.toLocaleString()} integrations
					</p>
				</div>
			</div>
		</div>
	);
}
