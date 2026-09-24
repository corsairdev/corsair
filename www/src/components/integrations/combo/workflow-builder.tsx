'use client';

import { ArrowsLeftRight, CaretDown } from '@phosphor-icons/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboAction, ComboData, ComboTrigger } from '@/lib/combo-types';
import { cn } from '@/lib/utils';

function keyOf(app: string, id: string) {
	return `${app}.${id}`;
}

function pairHash(triggerKey: string, actionKey: string) {
	return `#builder?pair=${triggerKey}+${actionKey}`;
}

function pairFromHash(combo: ComboData): {
	triggerKey: string;
	actionKey: string;
} | null {
	if (typeof window === 'undefined') return null;
	let hash = window.location.hash;
	try {
		hash = decodeURIComponent(hash);
	} catch {
		return null;
	}
	const stripped = hash.replace(/^#builder\/?\??/, '');
	const match = stripped.match(/^pair=([\w.]+)\+([\w.]+)$/);
	if (!match) return null;
	const [, triggerKey, actionKey] = match;
	const triggerOk = combo.triggers.some(
		(t) => keyOf(t.app, t.id) === triggerKey,
	);
	const actionOk = combo.actions.some((a) => keyOf(a.app, a.id) === actionKey);
	if (!triggerOk || !actionOk || !triggerKey || !actionKey) return null;
	return { triggerKey, actionKey };
}

function otherComboApp(combo: ComboData, app: string): string {
	return app === combo.slugA ? combo.slugB : combo.slugA;
}

function defaultPairForTriggerSide(
	combo: ComboData,
	triggerSideApp: string,
): { triggerKey: string; actionKey: string } {
	const actionSideApp = otherComboApp(combo, triggerSideApp);
	const trigger =
		combo.triggers.find((t) => t.app === triggerSideApp) ?? combo.triggers[0];
	const action =
		combo.actions.find((a) => a.app === actionSideApp) ?? combo.actions[0];
	if (!trigger || !action) {
		return { triggerKey: '', actionKey: '' };
	}
	return {
		triggerKey: keyOf(trigger.app, trigger.id),
		actionKey: keyOf(action.app, action.id),
	};
}

function writePairHash(triggerKey: string, actionKey: string) {
	if (typeof window === 'undefined' || !triggerKey || !actionKey) return;
	const next = pairHash(triggerKey, actionKey);
	if (window.location.hash === next) return;
	history.replaceState(
		null,
		'',
		`${window.location.pathname}${window.location.search}${next}`,
	);
}

type MenuLayout = {
	left: number;
	width: number;
	top: number;
	maxHeight: number;
};

function PairSelect({
	caption,
	value,
	onChange,
	options,
	selected,
}: {
	caption: string;
	value: string;
	onChange: (next: string) => void;
	options: (ComboTrigger | ComboAction)[];
	selected: ComboTrigger | ComboAction | undefined;
}) {
	const [open, setOpen] = useState(false);
	const [menuLayout, setMenuLayout] = useState<MenuLayout | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLUListElement>(null);
	const listboxId = useId();

	const updateMenuLayout = useCallback(() => {
		const root = containerRef.current;
		const trigger = triggerRef.current;
		if (!root || !trigger) return;
		const rect = root.getBoundingClientRect();
		const triggerRect = trigger.getBoundingClientRect();
		const edge = 12;
		const gap = 4;
		const preferredMax = 240;
		const spaceBelow = window.innerHeight - triggerRect.bottom - edge;
		const spaceAbove = triggerRect.top - edge;
		const openUp = spaceBelow < 140 && spaceAbove > spaceBelow;
		const maxHeight = Math.min(
			preferredMax,
			Math.max(120, openUp ? spaceAbove - gap : spaceBelow - gap),
		);
		setMenuLayout({
			left: rect.left,
			width: rect.width,
			top: openUp
				? triggerRect.top - gap - maxHeight
				: triggerRect.bottom + gap,
			maxHeight,
		});
	}, []);

	useEffect(() => {
		if (!open) setMenuLayout(null);
	}, [open]);

	useEffect(() => {
		if (!open) return;
		updateMenuLayout();

		const onScrollOrResize = () => updateMenuLayout();
		window.addEventListener('scroll', onScrollOrResize, true);
		window.addEventListener('resize', onScrollOrResize);

		const onPointerDown = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				containerRef.current?.contains(target) ||
				menuRef.current?.contains(target)
			) {
				return;
			}
			setOpen(false);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		const timeoutId = window.setTimeout(() => {
			document.addEventListener('click', onPointerDown, true);
		}, 0);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			window.clearTimeout(timeoutId);
			document.removeEventListener('click', onPointerDown, true);
			document.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('scroll', onScrollOrResize, true);
			window.removeEventListener('resize', onScrollOrResize);
		};
	}, [open, updateMenuLayout]);

	const menu =
		open && menuLayout && typeof document !== 'undefined'
			? createPortal(
					<ul
						ref={menuRef}
						id={listboxId}
						role="listbox"
						aria-label={caption}
						style={{
							position: 'fixed',
							left: menuLayout.left,
							width: menuLayout.width,
							top: menuLayout.top,
							maxHeight: menuLayout.maxHeight,
							zIndex: 50,
						}}
						className="overflow-y-auto rounded-md border border-[#1c1c1c]/12 bg-white py-1 shadow-[0_8px_32px_rgba(28,28,28,0.14)]"
					>
						{options.map((item) => {
							const itemKey = keyOf(item.app, item.id);
							const isSelected = itemKey === value;
							return (
								<li key={itemKey} role="presentation">
									<button
										type="button"
										role="option"
										aria-selected={isSelected}
										onClick={() => {
											onChange(itemKey);
											setOpen(false);
										}}
										className={cn(
											'flex min-h-11 w-full touch-manipulation flex-col justify-center gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-[#f4f4f4]',
											isSelected && 'bg-[#4a38f5]/[0.06]',
										)}
									>
										<span
											className={cn(
												'text-[14px] leading-snug text-[#1c1c1c]',
												isSelected && 'font-semibold text-[#4a38f5]',
											)}
										>
											{item.label}
										</span>
										{item.description ? (
											<span className="line-clamp-2 text-[12px] leading-snug text-[#1c1c1c66]">
												{item.description}
											</span>
										) : null}
									</button>
								</li>
							);
						})}
					</ul>,
					document.body,
				)
			: null;

	return (
		<div ref={containerRef} className="relative min-w-0">
			<div
				className={cn(
					'flex items-stretch rounded-md border bg-white shadow-[0_1px_2px_rgba(28,28,28,0.04)] transition-[border-color,box-shadow]',
					open
						? 'border-[#4a38f5] shadow-[0_0_0_1px_rgba(74,56,245,0.12)]'
						: 'border-[#1c1c1c]/12',
				)}
			>
				{selected ? (
					<span className="flex w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-l-md border-r border-[#1c1c1c]/10 bg-[#f7f7f7]">
						<IntegrationLogo
							id={selected.app}
							displayName={selected.appLabel}
							size={44}
							className="rounded-md border-0"
						/>
					</span>
				) : null}
				<button
					ref={triggerRef}
					type="button"
					aria-label={caption}
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-controls={listboxId}
					onClick={() => setOpen((prev) => !prev)}
					className="flex min-h-11 min-w-0 flex-1 touch-manipulation cursor-pointer items-center justify-between gap-2 px-3 py-3 text-left sm:py-3.5"
				>
					<span
						className="min-w-0 text-[15px] font-semibold leading-snug text-[#1c1c1c] md:truncate"
						title={selected?.label}
					>
						{selected ? selected.label : 'Select…'}
					</span>
					<CaretDown
						size={16}
						weight="bold"
						aria-hidden
						className={cn(
							'shrink-0 text-[#1c1c1c66] transition-transform duration-200',
							open && 'rotate-180 text-[#4a38f5]',
						)}
					/>
				</button>
			</div>
			{menu}
		</div>
	);
}

const captionClassName =
	'font-[family-name:var(--landing-font-mono)] text-[11px] uppercase tracking-[0.06em] text-[#1c1c1c66]';

export function WorkflowBuilder({ combo }: { combo: ComboData }) {
	const [triggerSideApp, setTriggerSideApp] = useState(combo.slugA);
	const initialPair = defaultPairForTriggerSide(combo, combo.slugA);
	const [triggerKey, setTriggerKey] = useState(initialPair.triggerKey);
	const [actionKey, setActionKey] = useState(initialPair.actionKey);

	const actionSideApp = otherComboApp(combo, triggerSideApp);
	const triggerOptions = combo.triggers.filter((t) => t.app === triggerSideApp);
	const actionOptions = combo.actions.filter((a) => a.app === actionSideApp);

	useEffect(() => {
		function applyHash() {
			const pair = pairFromHash(combo);
			if (!pair) return;
			const trigger = combo.triggers.find(
				(t) => keyOf(t.app, t.id) === pair.triggerKey,
			);
			const action = combo.actions.find(
				(a) => keyOf(a.app, a.id) === pair.actionKey,
			);
			if (!trigger || !action) return;
			if (trigger.app === action.app) return;
			setTriggerSideApp(trigger.app);
			setTriggerKey(pair.triggerKey);
			setActionKey(pair.actionKey);
			document.getElementById('builder')?.scrollIntoView({ block: 'center' });
		}
		applyHash();
		window.addEventListener('hashchange', applyHash);
		return () => window.removeEventListener('hashchange', applyHash);
	}, [combo]);

	const trigger = combo.triggers.find((t) => keyOf(t.app, t.id) === triggerKey);
	const action = combo.actions.find((a) => keyOf(a.app, a.id) === actionKey);

	function swapApps() {
		const nextTriggerSide = actionSideApp;
		const { triggerKey: nextTrigger, actionKey: nextAction } =
			defaultPairForTriggerSide(combo, nextTriggerSide);
		if (!nextTrigger || !nextAction) return;
		setTriggerSideApp(nextTriggerSide);
		setTriggerKey(nextTrigger);
		setActionKey(nextAction);
		writePairHash(nextTrigger, nextAction);
	}

	return (
		<section id="builder" className="pb-10 md:pb-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<div className="rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-6 sm:px-5 sm:py-7">
					<div className="mb-3 hidden items-center gap-3 md:mb-4 md:grid md:grid-cols-[1fr_auto_1fr]">
						<span className={captionClassName}>Choose a trigger</span>
						<button
							type="button"
							onClick={swapApps}
							disabled={!trigger || !action}
							className="inline-flex min-h-9 touch-manipulation cursor-pointer items-center justify-center gap-1.5 rounded-sm px-2 py-1 font-[family-name:var(--landing-font-mono)] text-[11px] font-medium uppercase tracking-[0.04em] text-[#4a38f5] transition-colors hover:text-[#3d2ee0] disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ArrowsLeftRight size={14} aria-hidden />
							Swap apps
						</button>
						<span className={`text-right ${captionClassName}`}>
							Choose an action
						</span>
					</div>
					<div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] md:gap-0">
						<div className="min-w-0">
							<span className={cn(captionClassName, 'mb-2 block md:hidden')}>
								Choose a trigger
							</span>
							<PairSelect
								caption="Choose a trigger"
								value={triggerKey}
								onChange={(next) => {
									setTriggerKey(next);
									writePairHash(next, actionKey);
								}}
								options={triggerOptions}
								selected={trigger}
							/>
						</div>
						<button
							type="button"
							onClick={swapApps}
							disabled={!trigger || !action}
							className="mx-auto inline-flex min-h-11 w-full max-w-xs touch-manipulation cursor-pointer items-center justify-center gap-2 rounded-md border border-[#4a38f5]/25 bg-[#4a38f5]/[0.06] px-4 py-2.5 font-[family-name:var(--landing-font-mono)] text-[12px] font-medium uppercase tracking-[0.04em] text-[#4a38f5] transition-colors hover:border-[#4a38f5]/40 hover:bg-[#4a38f5]/[0.1] disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
						>
							<ArrowsLeftRight size={16} aria-hidden />
							Swap apps
						</button>
						<div
							aria-hidden
							className="hidden items-center justify-center md:flex md:px-1"
						>
							<span className="block h-px w-full bg-[#1c1c1c]/18" />
						</div>
						<div className="min-w-0">
							<span className={cn(captionClassName, 'mb-2 block md:hidden')}>
								Choose an action
							</span>
							<PairSelect
								caption="Choose an action"
								value={actionKey}
								onChange={(next) => {
									setActionKey(next);
									writePairHash(triggerKey, next);
								}}
								options={actionOptions}
								selected={action}
							/>
						</div>
					</div>
					{trigger && action ? (
						<p
							aria-live="polite"
							className="mt-5 border-t border-[#1c1c1c]/8 pt-5 text-sm leading-relaxed text-[#1c1c1c] sm:mt-6 sm:pt-6"
						>
							When{' '}
							<strong className="font-semibold">
								{trigger.appLabel}: {trigger.label}
							</strong>{' '}
							happens, do{' '}
							<strong className="font-semibold">
								{action.appLabel}: {action.label}
							</strong>
							.
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
}
