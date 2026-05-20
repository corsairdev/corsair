'use client';

import { useState } from 'react';
import {
	CELL_STATUS_CALLOUTS,
	CONNECTION_STATUS_COLORS,
	DEMO_MASKED_CONNECT_URL,
	getFirstName,
	INTEGRATION_BY_ID,
	INTEGRATION_PERMISSION_CONFIG,
	PERMISSION_MODE_LABELS,
	sampleUserActivity,
} from '../data/companies-data';
import type {
	ConnectionStatus,
	IntegrationId,
	PersonCell,
} from '../data/companies-data';
import { FaviconLogo, PersonAvatar } from './table-ui';
import { TABLE } from './table-theme';

export type TableCellSelection =
	| {
			kind: 'integration';
			rowId: string;
			personName: string;
			integrationId: IntegrationId;
			status: ConnectionStatus;
	  }
	| {
			kind: 'person';
			rowId: string;
			person: PersonCell;
	  };

function CloseButton({ onClose }: { onClose: () => void }) {
	return (
		<button
			type="button"
			onClick={onClose}
			className="flex size-7 shrink-0 items-center justify-center rounded text-[#737373] hover:bg-[#f4f4f5]"
			aria-label="Close panel"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		</button>
	);
}

function StatusLine({ status }: { status: ConnectionStatus }) {
	const colors = CONNECTION_STATUS_COLORS[status];
	return (
		<p className="flex items-center gap-1.5 text-[12px] text-[#525252]">
			<span
				className="size-1.5 shrink-0 rounded-full"
				style={{ background: colors.dot }}
			/>
			{CELL_STATUS_CALLOUTS[status]}
		</p>
	);
}

function IntegrationPanel({
	selection,
	onClose,
}: {
	selection: Extract<TableCellSelection, { kind: 'integration' }>;
	onClose: () => void;
}) {
	const integration = INTEGRATION_BY_ID[selection.integrationId];
	const permission = INTEGRATION_PERMISSION_CONFIG[selection.integrationId];

	return (
		<>
			<div className="flex items-start justify-between gap-2 px-4 py-3">
				<div className="flex min-w-0 items-center gap-2">
					<FaviconLogo
						domain={integration.iconDomain}
						label={integration.label}
						size={20}
					/>
					<div className="min-w-0">
						<h3 className="truncate text-[14px] font-semibold text-[#1c1c1c]">
							{integration.label}
						</h3>
						<p className="truncate text-[11px] text-[#737373]">
							{selection.personName}
						</p>
					</div>
				</div>
				<CloseButton onClose={onClose} />
			</div>

			<div
				className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				style={{ fontFamily: TABLE.font }}
			>
				<div className="space-y-2">
					<p className="flex items-center gap-1.5 text-[12px] text-[#1c1c1c]">
						<span className="size-1.5 shrink-0 rounded-full bg-[#10b981]" />
						OAuth connected
					</p>
					<StatusLine status={selection.status} />
				</div>

				<div>
					<p className="text-[15px] font-semibold text-[#1c1c1c]">
						{PERMISSION_MODE_LABELS[permission.mode]}
					</p>
					<p className="mt-1 text-[12px] leading-snug text-[#525252]">
						{permission.trustLine}
					</p>
				</div>
			</div>
		</>
	);
}

function DemoCopyButton({ label }: { label: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<button
			type="button"
			onClick={() => {
				setCopied(true);
				window.setTimeout(() => setCopied(false), 2000);
			}}
			className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#1c1c1c] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#333]"
		>
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<rect x="9" y="9" width="13" height="13" rx="2" />
				<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
			</svg>
			{copied ? 'Copied' : label}
		</button>
	);
}

function PersonPanel({
	selection,
	onClose,
}: {
	selection: Extract<TableCellSelection, { kind: 'person' }>;
	onClose: () => void;
}) {
	const firstName = getFirstName(selection.person.name);
	const [activity] = useState(() => sampleUserActivity());

	return (
		<>
			<div className="flex items-start justify-between gap-2 px-4 py-3">
				<div className="flex min-w-0 items-center gap-2">
					<PersonAvatar person={selection.person} size={24} />
					<h3 className="truncate text-[14px] font-semibold text-[#1c1c1c]">
						{selection.person.name}
					</h3>
				</div>
				<CloseButton onClose={onClose} />
			</div>

			<div
				className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				style={{ fontFamily: TABLE.font }}
			>
				<div>
					<p className="text-[11px] font-medium text-[#737373]">Connect link</p>
					<p className="mt-1 truncate font-mono text-[11px] text-[#525252]">
						{DEMO_MASKED_CONNECT_URL}
					</p>
					<div className="mt-2">
						<DemoCopyButton label="Copy 30-minute URL" />
					</div>
				</div>

				<div>
					<p className="text-[11px] font-medium text-[#737373]">
						{firstName}&apos;s recent activity
					</p>
					<ul className="mt-2 space-y-2">
						{activity.map((item) => (
							<li key={`${item.operation}-${item.timestamp}-${item.status}`}>
								<p className="font-mono text-[10px] text-[#1c1c1c]">
									{item.operation}
								</p>
								<p className="text-[10px] text-[#a3a3a3]">{item.timestamp}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}

export function TableDetailSidebar({
	selection,
	onClose,
}: {
	selection: TableCellSelection | null;
	onClose: () => void;
}) {
	if (!selection) return null;

	return (
		<aside
			className="absolute right-0 top-0 z-20 flex h-full w-[260px] flex-col border-l border-[#ebebeb] bg-white shadow-[-6px_0_20px_rgba(0,0,0,0.08)]"
			style={{ fontFamily: TABLE.font }}
		>
			{selection.kind === 'integration' ? (
				<IntegrationPanel selection={selection} onClose={onClose} />
			) : (
				<PersonPanel selection={selection} onClose={onClose} />
			)}
		</aside>
	);
}
