'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { analyticsDistinctId, track } from '@/lib/claim-analytics';
import type { AppCatalog, ClaimApp } from '@/lib/claim-apps';
import { appCatalog } from '@/lib/claim-apps';
import { currentCampaign } from '@/lib/claim-campaign';
import { claimClientById } from '@/lib/claim-clients';
import { linkProblem } from '@/lib/claim-handle';
import { buildHubUrl, HUB_URL, hubSignInUrl } from '@/lib/claim-hub-url';
import type { PassageEvent, Step } from '@/lib/claim-passage';
import { cn } from '@/lib/utils';

import { NameStep } from './name-step';
import { PickPanel } from './pick-panel';
import { PrimaryButton } from './primary-button';
import { ReviewPanel } from './review-panel';
import { AppIcon, ClientIcon } from './start-icons';
import type { PassageApi } from './use-passage';
import { usePassage } from './use-passage';

const STEP_NUMBER: Record<Step, 1 | 2 | 3> = { claim: 1, pick: 2, review: 3 };

/** Reports the funnel with lug.dev's event names. A name that isn't free never reaches send, so it isn't counted. */
function useFunnelEvents(api: PassageApi): PassageApi {
	const { p, ready, send, claimReady, claimedOnArrival } = api;
	const typed = useRef(false);
	const shownStep = useRef<Step | null>(null);
	const arrivalSent = useRef(false);

	useEffect(() => {
		if (!ready || !claimedOnArrival || arrivalSent.current) return;
		arrivalSent.current = true;
		track('lug_claim_submitted', {});
	}, [ready, claimedOnArrival]);

	useEffect(() => {
		if (!ready || shownStep.current === p.step) return;
		shownStep.current = p.step;
		if (p.step === 'pick') track('lug_apps_step', {});
		if (p.step === 'review') {
			track('lug_client_step', {
				apps: p.apps.length,
				client: p.clients[0] ?? '',
			});
		}
	}, [ready, p.step, p.apps.length, p.clients]);

	const reported = useCallback(
		(e: PassageEvent) => {
			if (e.type === 'typeHandle' && !typed.current) {
				typed.current = true;
				track('lug_handle_typed', {});
			}
			if (e.type === 'next' && p.step === 'claim' && claimReady) {
				track('lug_claim_submitted', {});
			}
			send(e);
		},
		[send, p.step, claimReady],
	);

	return { ...api, send: reported };
}

function StepHeader({ step, onBack }: { step: 1 | 2 | 3; onBack: () => void }) {
	return (
		<div className="mb-4 flex h-8 items-center justify-between text-[13px] text-[#1c1c1c99]">
			{step > 1 ? (
				<button
					type="button"
					onClick={onBack}
					className="-ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-[#1c1c1c0d] hover:text-[#1c1c1c]"
				>
					<ArrowLeft size={14} aria-hidden />
					Back
				</button>
			) : (
				<span />
			)}
			<span className="flex items-center gap-2.5">
				Step {step} of 3
				<span aria-hidden className="flex gap-1">
					{[1, 2, 3].map((n) => (
						<span
							key={n}
							className={cn(
								'h-1 rounded-full transition-[width,background-color] duration-300',
								n === step ? 'w-[18px]' : 'w-1.5',
								n <= step ? 'bg-[#4a38f5]' : 'bg-[#1c1c1c26]',
							)}
						/>
					))}
				</span>
			</span>
		</div>
	);
}

/** The URL being built: the address on step 2, the path too on step 3 (editable there). */
function UrlRow({
	api,
	label,
	disabled,
}: {
	api: PassageApi;
	label: string;
	disabled: boolean;
}) {
	const { p, send } = api;
	const review = p.step === 'review';
	const badLink = review && linkProblem(p.link) !== null;
	return (
		<div className="px-5 py-4 sm:px-6">
			<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
				<p className="flex min-w-0 flex-1 flex-wrap items-baseline font-[family-name:var(--landing-font-mono)] text-[clamp(16px,2.2vw,20px)] tracking-[-0.02em] text-[#1c1c1c]">
					<span className="hidden text-[#1c1c1c66] sm:inline">https://</span>
					<span className="ph-no-capture break-all">{p.handle}</span>
					<span className="text-[#1c1c1c66]">.lug.dev</span>
					{review ? (
						<>
							<span className="text-[#1c1c1c66]">/</span>
							<span className="rounded-[5px] bg-[#4a38f5]/10 px-1 text-[#4a38f5]">
								<input
									aria-label="Path"
									value={p.link}
									placeholder="work"
									maxLength={32}
									autoCapitalize="none"
									autoComplete="off"
									spellCheck={false}
									onChange={(e) =>
										send({ type: 'typeLink', raw: e.target.value })
									}
									style={{ width: `${Math.max(p.link.length, 4) + 0.5}ch` }}
									className="ph-no-capture max-w-full bg-transparent outline-none placeholder:text-[#4a38f5]/50"
								/>
							</span>
						</>
					) : null}
				</p>
				<PrimaryButton disabled={disabled}>{label}</PrimaryButton>
			</div>
			{badLink ? (
				<p className="mt-2 text-[13px] text-red-700">
					Use lowercase letters, numbers and single hyphens for the path.
				</p>
			) : null}
		</div>
	);
}

/** The apps picked so far, each one a remove button, with their action count and (on step 3) the agents. */
function ChosenApps({
	api,
	catalog,
}: {
	api: PassageApi;
	catalog: AppCatalog;
}) {
	const { p, send } = api;
	const agents = p.clients.map(claimClientById);
	const first = agents[0];
	const count = p.apps.length;
	return (
		<div className="flex min-h-[57px] flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#1c1c1c1a] px-5 py-3 text-[13px] text-[#1c1c1c99] sm:px-6">
			{count ? (
				<div className="flex items-center">
					{p.apps.map((id, i) => {
						const name = catalog.byId(id)?.name ?? id;
						return (
							<button
								key={id}
								type="button"
								onClick={() => send({ type: 'toggleApp', id })}
								title={`Remove ${name}`}
								aria-label={`Remove ${name}`}
								className="relative -ml-1.5 grid size-8 place-items-center rounded-lg bg-white ring-1 ring-[#1c1c1c1a] transition-transform first:ml-0 hover:-translate-y-0.5"
								style={{ zIndex: 20 - i }}
							>
								<AppIcon id={id} name={name} size={20} />
							</button>
						);
					})}
				</div>
			) : null}
			<span className="flex items-center gap-2 font-[family-name:var(--landing-font-mono)] tabular-nums">
				<span aria-hidden className="size-1.5 rounded-full bg-[#4a38f5]" />
				{count
					? `${count} ${count === 1 ? 'app' : 'apps'} · ${catalog.actionsOf(p.apps).toLocaleString('en-US')} actions`
					: 'No apps yet'}
			</span>
			{p.step === 'review' && first ? (
				<span className="ml-auto flex items-center gap-1.5">
					for
					<span className="flex items-center gap-1">
						{agents.map((c) => (
							<ClientIcon key={c.id} domain={c.domain} size={16} />
						))}
					</span>
					<span className="text-[#1c1c1c]">
						{agents.length === 1
							? first.name
							: `${first.name} +${agents.length - 1}`}
					</span>
				</span>
			) : null}
		</div>
	);
}

/** corsair.dev/start: name the URL, pick apps, pick agents, then Hub's sign-in. */
export function StartFlow({ apps }: { apps: ClaimApp[] }) {
	const catalog = useMemo(() => appCatalog(apps), [apps]);
	const api = useFunnelEvents(usePassage(catalog.ids));
	const { p, send, ready, href, claimReady } = api;
	const [leaving, setLeaving] = useState(false);

	// Coming Back from Hub can restore this page from the back-forward cache, mid hand-off.
	useEffect(() => {
		const reset = (e: PageTransitionEvent) => {
			if (e.persisted) setLeaving(false);
		};
		window.addEventListener('pageshow', reset);
		return () => window.removeEventListener('pageshow', reset);
	}, []);

	const handOff = () => {
		if (!href || leaving) return;
		track('lug_handoff', {
			kind: 'claim',
			apps: p.apps.length,
			plugins: p.apps.join(','),
			client: p.clients[0] ?? '',
			clients: p.clients.join(','),
		});
		setLeaving(true);
		window.location.assign(
			buildHubUrl(p, HUB_URL, analyticsDistinctId(), currentCampaign()),
		);
	};

	const step = STEP_NUMBER[p.step];
	const label =
		p.step === 'review'
			? leaving
				? 'Taking you to sign in…'
				: 'Sign in to finish'
			: 'Continue';
	const disabled = p.step === 'review' ? !href || leaving : p.apps.length === 0;

	return (
		<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
			<div className="mx-auto max-w-[760px] pt-8 pb-20 md:pt-14 md:pb-28">
				<StepHeader step={step} onBack={() => send({ type: 'back' })} />
				<h1 className="mb-3 text-balance font-[family-name:var(--landing-font-serif)] text-[clamp(2rem,4.5vw,3rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
					Set up your MCP URL
				</h1>
				<p className="mb-8 max-w-[560px] text-[16px] leading-relaxed text-[#1c1c1c99] md:text-[17px]">
					One address for your apps that works in every agent you use. Name it,
					pick the apps, choose the agents, then sign in.
				</p>

				<form
					noValidate
					aria-busy={!ready}
					onSubmit={(e) => {
						e.preventDefault();
						if (p.step === 'review') handOff();
						else if (p.step === 'pick' || claimReady) send({ type: 'next' });
					}}
					className="min-h-[164px] overflow-hidden rounded-2xl border border-[#1c1c1c1a] bg-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.3)]"
				>
					{!ready ? null : p.step === 'claim' ? (
						<NameStep api={api} />
					) : (
						<>
							<UrlRow api={api} label={label} disabled={disabled} />
							<ChosenApps api={api} catalog={catalog} />
							{p.step === 'pick' ? (
								<PickPanel api={api} catalog={catalog} />
							) : (
								<ReviewPanel api={api} />
							)}
						</>
					)}
				</form>

				{ready ? (
					<p className="mt-5 text-[14px] text-[#1c1c1c99]">
						Already have an MCP URL?{' '}
						<a
							href={hubSignInUrl(
								HUB_URL,
								{ handle: '', apps: [], clients: p.clients, skill: p.skill },
								analyticsDistinctId(),
								currentCampaign(),
							)}
							onClick={() => track('lug_handoff', { kind: 'sign_in' })}
							className="font-medium text-[#4a38f5] underline-offset-4 hover:underline"
						>
							Sign in
						</a>
					</p>
				) : null}
			</div>
		</div>
	);
}
