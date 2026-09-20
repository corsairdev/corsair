'use client';

import { useEffect, useState } from 'react';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboAction, ComboData, ComboTrigger } from '@/lib/combo-types';
import { WorkflowNodePair } from './workflow-nodes';

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

function PairSelect({
	kind,
	value,
	onChange,
	options,
	selected,
}: {
	kind: 'trigger' | 'action';
	value: string;
	onChange: (next: string) => void;
	options: (ComboTrigger | ComboAction)[];
	selected: ComboTrigger | ComboAction | undefined;
}) {
	const heading = kind === 'trigger' ? 'When this happens…' : 'Do this';
	const caption = kind === 'trigger' ? 'Choose a trigger' : 'Choose an action';
	return (
		<label className="block">
			<span className="mb-2 block font-[family-name:var(--landing-font-mono)] text-[11px] uppercase tracking-[0.06em] text-[#1c1c1c66]">
				{caption}
			</span>
			<span className="flex items-stretch overflow-hidden rounded-md border border-[#1c1c1c]/12 bg-white shadow-[0_1px_2px_rgba(28,28,28,0.04)] focus-within:border-[#4a38f5]">
				{selected ? (
					<span className="flex w-[72px] shrink-0 items-center justify-center border-r border-[#1c1c1c]/10 bg-[#f7f7f7]">
						<IntegrationLogo
							id={selected.app}
							displayName={selected.appLabel}
							size={44}
							className="rounded-md border-0"
						/>
					</span>
				) : null}
				<span className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5">
					<span className="text-[11px] font-medium text-[#1c1c1c66]">
						{heading}
					</span>
					<select
						value={value}
						onChange={(e) => onChange(e.target.value)}
						aria-label={caption}
						className="w-full min-w-0 cursor-pointer bg-transparent text-[15px] font-semibold text-[#1c1c1c] outline-none"
					>
						{options.map((item) => (
							<option
								key={keyOf(item.app, item.id)}
								value={keyOf(item.app, item.id)}
							>
								{item.appLabel}: {item.label}
							</option>
						))}
					</select>
				</span>
			</span>
		</label>
	);
}

export function WorkflowBuilder({ combo }: { combo: ComboData }) {
	const defaultTrigger = combo.triggers.find((t) => t.app === combo.slugA);
	const [triggerKey, setTriggerKey] = useState(
		defaultTrigger ? keyOf(defaultTrigger.app, defaultTrigger.id) : '',
	);
	const defaultAction = combo.actions.find((a) => a.app !== combo.slugA);
	const [actionKey, setActionKey] = useState(
		defaultAction ? keyOf(defaultAction.app, defaultAction.id) : '',
	);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		function applyHash() {
			const pair = pairFromHash(combo);
			if (!pair) return;
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

	async function copyPair() {
		if (!trigger || !action) return;
		const pair = `${trigger.app}.webhooks.${trigger.id} → ${action.app}.api.${action.id}`;
		try {
			await navigator.clipboard.writeText(pair);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			setCopied(false);
		}
	}

	return (
		<section id="builder" className="pb-10 md:pb-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					Create your own {combo.displayA} and {combo.displayB} integration
				</h2>
				<p className="mx-auto mt-2 max-w-2xl text-center text-[15px] leading-relaxed text-[#1c1c1c99]">
					When this happens, do this. The node graph follows the pair you pick.
				</p>
				<div className="mt-7 overflow-hidden rounded-md border border-[#1c1c1c]/10 bg-white">
					<div className="px-4 py-5 sm:px-5 sm:py-6">
						<div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
							<PairSelect
								kind="trigger"
								value={triggerKey}
								onChange={(next) => {
									setTriggerKey(next);
									writePairHash(next, actionKey);
								}}
								options={combo.triggers}
								selected={trigger}
							/>
							<span
								aria-hidden
								className="mx-auto hidden items-center text-[#1c1c1c33] md:flex"
							>
								<svg width="28" height="10" viewBox="0 0 28 10">
									<path
										d="M0 5h22M19 1.5 26 5l-7 3.5"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.25"
									/>
								</svg>
							</span>
							<PairSelect
								kind="action"
								value={actionKey}
								onChange={(next) => {
									setActionKey(next);
									writePairHash(triggerKey, next);
								}}
								options={combo.actions}
								selected={action}
							/>
						</div>
					</div>

					{trigger && action ? (
						<div className="border-t border-[#1c1c1c]/8">
							<WorkflowNodePair trigger={trigger} action={action} />
						</div>
					) : null}

					{trigger && action ? (
						<div
							aria-live="polite"
							className="border-t border-[#1c1c1c]/8 px-4 py-4 sm:px-5"
						>
							<p className="text-sm leading-relaxed text-[#1c1c1c]">
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
							<p className="mt-1 font-[family-name:var(--landing-font-mono)] text-[12px] leading-relaxed text-[#1c1c1c66]">
								{trigger.app}.webhooks.{trigger.id} → {action.app}
								.api.{action.id}
							</p>
							<div className="mt-3 flex flex-wrap items-center gap-3">
								<button
									type="button"
									onClick={copyPair}
									className="cursor-pointer rounded-sm bg-[#1c1c1c] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#4a38f5]"
								>
									{copied ? 'Copied' : 'Copy operation IDs'}
								</button>
								{combo.appDetails.map((app) => (
									<a
										key={app.id}
										href={app.docsHref}
										className="text-[13px] font-medium text-[#4a38f5] no-underline hover:underline"
									>
										{app.displayName} docs
									</a>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
