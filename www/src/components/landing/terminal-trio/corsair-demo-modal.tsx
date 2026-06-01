'use client';

import { INTEGRATION_BY_ID } from '../data/companies-data';
import type { IntegrationId } from '../data/companies-data';
import { FaviconLogo } from '../app-preview/table-ui';
import { TrafficLights } from '../icons/window-chrome';

type IntegrationRef = {
	domain: string;
	label: string;
};

export type TriggerListItem = {
	id: string;
	kind: 'trigger' | 'cron' | 'webhook';
	integrations: IntegrationRef[];
	title: string;
	description: string;
	highlight?: boolean;
};

function ModalFrame({
	title,
	subtitle,
	onClose,
	children,
}: {
	title: string;
	subtitle?: string;
	onClose?: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="overflow-hidden rounded-[20px] border border-[#1c1c1c1a] bg-white shadow-[var(--landing-shadow-elevated)]">
			<div className="flex items-center gap-3 border-b border-[#1c1c1c1a] px-4 py-3 sm:px-5">
				<TrafficLights />
				<div className="min-w-0 flex-1 text-center">
					<p className="truncate text-[13px] font-semibold text-[#1c1c1c]">
						{title}
					</p>
					{subtitle ? (
						<p className="truncate text-[11px] text-[#1c1c1c66]">{subtitle}</p>
					) : null}
				</div>
				{onClose ? (
					<button
						type="button"
						onClick={onClose}
						className="flex size-7 shrink-0 items-center justify-center rounded-md text-[#737373] hover:bg-[#f4f4f4]"
						aria-label="Close"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				) : (
					<span className="w-7" />
				)}
			</div>
			{children}
		</div>
	);
}

function TriggerKindIcon({ kind }: { kind: TriggerListItem['kind'] }) {
	if (kind === 'cron') {
		return (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" aria-hidden>
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7v5l3 2" strokeLinecap="round" />
			</svg>
		);
	}
	if (kind === 'webhook') {
		return (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" aria-hidden>
				<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
				<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
			</svg>
		);
	}
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden>
			<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
		</svg>
	);
}

export function OAuthModalContent({
	integrationId,
	onConnect,
	onClose,
}: {
	integrationId: IntegrationId;
	onConnect: () => void;
	onClose: () => void;
}) {
	const integration = INTEGRATION_BY_ID[integrationId];

	return (
		<ModalFrame
			title={`Connect ${integration.label}`}
			subtitle="Corsair hosted auth"
			onClose={onClose}
		>
			<div className="px-4 py-6 sm:px-10 sm:py-10">
				<div className="mb-8 flex flex-col items-center gap-3 text-center">
					<FaviconLogo
						domain={integration.iconDomain}
						label={integration.label}
						size={52}
					/>
					<div className="space-y-2">
						<p className="text-xl font-semibold tracking-[-0.01em] text-[#1c1c1c]">
							Sign in to {integration.label}
						</p>
						<p className="max-w-[360px] text-sm leading-relaxed text-[#1c1c1c80]">
							Corsair needs read access to pull your records. This secure link
							expires in 30 minutes.
						</p>
					</div>
				</div>

				<div className="mb-8 rounded-xl border border-[#1c1c1c0d] bg-[#fafafa] px-5 py-4">
					<p className="mb-3 text-xs font-medium uppercase tracking-[0.04em] text-[#1c1c1c66]">
						Requested permissions
					</p>
					<ul className="space-y-2.5">
						{['Read records', 'List bases', 'View schema'].map((scope) => (
							<li
								key={scope}
								className="flex items-center gap-2.5 text-sm text-[#1c1c1c]"
							>
								<span className="size-1.5 shrink-0 rounded-full bg-[#1a7f4b]" />
								{scope}
							</li>
						))}
					</ul>
				</div>

				<button
					type="button"
					onClick={onConnect}
					className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#1c1c1c] px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#333]"
				>
					<FaviconLogo
						domain={integration.iconDomain}
						label={integration.label}
						size={18}
					/>
					Continue with {integration.label}
				</button>
			</div>
		</ModalFrame>
	);
}

export function PermissionModalContent({
	integrationId,
	onApprove,
	onDeny,
	onClose,
}: {
	integrationId: IntegrationId;
	onApprove: () => void;
	onDeny: () => void;
	onClose: () => void;
}) {
	const integration = INTEGRATION_BY_ID[integrationId];

	return (
		<ModalFrame
			title="Review before sending"
			subtitle="Permission required"
			onClose={onClose}
		>
			<div className="px-4 py-5 sm:px-8 sm:py-8">
				<div className="mb-6 flex items-center gap-3">
					<FaviconLogo
						domain={integration.iconDomain}
						label={integration.label}
						size={28}
					/>
					<div>
						<p className="text-base font-semibold text-[#1c1c1c]">
							Send via {integration.label}?
						</p>
						<p className="text-sm text-[#1c1c1c80]">
							Your agent drafted this message. Approve to send.
						</p>
					</div>
				</div>

				<div className="mb-8 rounded-xl border border-[#1c1c1c12] bg-[#fafafa] px-5 py-4">
					<p className="mb-1 text-xs text-[#1c1c1c66]">
						To <span className="font-medium text-[#1c1c1c]">dev@corsair.dev</span>
					</p>
					<p className="mb-3 text-[15px] font-medium text-[#1c1c1c]">
						Re: Corsair agreement
					</p>
					<p className="text-sm leading-relaxed text-[#1c1c1c99]">
						Hi Dev — we&apos;d like to start using Corsair this week. Could you
						send over the agreement when you get a chance?
					</p>
				</div>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onDeny}
						className="rounded-lg border border-[#1c1c1c1a] bg-white px-5 py-2.5 text-sm font-medium text-[#1c1c1c99] hover:bg-[#f4f4f4]"
					>
						Deny
					</button>
					<button
						type="button"
						onClick={onApprove}
						className="rounded-lg bg-[#4a38f5] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3d2ee0]"
					>
						Approve & send
					</button>
				</div>
			</div>
		</ModalFrame>
	);
}

export function TriggersModalContent({
	items,
	onClose,
}: {
	items: TriggerListItem[];
	onClose: () => void;
}) {
	return (
		<ModalFrame
			title="Reminders & triggers"
			subtitle={`${items.length} active`}
			onClose={onClose}
		>
			<div className="max-h-[min(420px,60vh)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
				<ul className="space-y-3">
					{items.map((item) => (
						<li
							key={item.id}
							className={`rounded-xl border px-4 py-3.5 ${
								item.highlight
									? 'border-[#4a38f533] bg-[#4a38f508]'
									: 'border-[#1c1c1c12] bg-[#fafafa]'
							}`}
						>
							<div className="mb-2 flex items-center gap-2">
								<TriggerKindIcon kind={item.kind} />
								<div className="flex items-center gap-1">
									{item.integrations.map((integration) => (
										<FaviconLogo
											key={integration.domain}
											domain={integration.domain}
											label={integration.label}
											size={18}
										/>
									))}
								</div>
								<span className="rounded-md bg-[#1c1c1c0d] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-[#1c1c1c80]">
									{item.kind}
								</span>
								{item.highlight ? (
									<span className="ml-auto rounded-full bg-[#4a38f5] px-2 py-0.5 text-[10px] font-medium text-white">
										New
									</span>
								) : null}
							</div>
							<p className="text-sm font-medium text-[#1c1c1c]">{item.title}</p>
							<p className="mt-0.5 text-[13px] leading-snug text-[#1c1c1c80]">
								{item.description}
							</p>
						</li>
					))}
				</ul>
			</div>
		</ModalFrame>
	);
}
