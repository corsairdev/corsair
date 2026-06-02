'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { AVATAR_TONES, TABLE } from './table-theme';

export function TableCheckbox() {
	return (
		<div className="flex h-6 w-6 shrink-0 items-center justify-center">
			<div className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-[#d1d1d1] bg-transparent" />
		</div>
	);
}

export function PreviewAvatar({
	children,
	size = 14,
	tone = 'gray',
	square = false,
}: {
	children: ReactNode;
	size?: number;
	tone?: string;
	square?: boolean;
}) {
	const t = AVATAR_TONES[tone] ?? AVATAR_TONES.gray;
	return (
		<span
			className="inline-flex shrink-0 items-center justify-center overflow-hidden text-[10px] font-medium leading-none"
			style={{
				width: size,
				height: size,
				borderRadius: square ? 4 : 999,
				background: t.background,
				color: t.color,
				fontFamily: TABLE.font,
			}}
		>
			{children}
		</span>
	);
}

export function FaviconLogo({
	domain,
	label,
	size = 14,
}: {
	domain: string;
	label: string;
	size?: number;
}) {
	const [failed, setFailed] = useState(false);
	const url = `https://twenty-icons.com/${domain.replace(/^(https?:\/\/)|(www\.)/g, '').replace(/\/$/, '')}`;

	if (!failed) {
		return (
			<span
				className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded"
				style={{ width: size, height: size }}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={url}
					alt=""
					className="block h-full w-full object-contain"
					onError={() => setFailed(true)}
				/>
			</span>
		);
	}

	return (
		<span
			className="inline-flex shrink-0 items-center justify-center rounded bg-[#ebebeb] text-[9px] font-semibold text-[#666]"
			style={{ width: size, height: size, fontFamily: TABLE.font }}
		>
			{label[0]?.toUpperCase()}
		</span>
	);
}

export function PersonAvatar({
	person,
	size = 14,
}: {
	person: {
		name: string;
		tone?: string;
		shortLabel?: string;
		avatar?: string;
		square?: boolean;
	};
	size?: number;
}) {
	const [failed, setFailed] = useState(false);
	const label =
		person.shortLabel ??
		person.name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.slice(0, 2);

	if (person.avatar && !failed) {
		return (
			<PreviewAvatar size={size} tone={person.tone} square={person.square}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={person.avatar}
					alt=""
					className="h-full w-full object-cover"
					onError={() => setFailed(true)}
				/>
			</PreviewAvatar>
		);
	}

	return (
		<PreviewAvatar size={size} tone={person.tone} square={person.square}>
			{label}
		</PreviewAvatar>
	);
}

type ChipVariant = 'regular' | 'highlighted' | 'static';

export function Chip({
	label,
	left,
	variant = 'regular',
}: {
	label: string;
	left?: ReactNode;
	variant?: ChipVariant;
}) {
	const styles: Record<ChipVariant, string> = {
		regular: 'bg-transparent',
		highlighted: 'bg-[#1c1c1c0d]',
		static: 'rounded-full border border-[#d1d1d1] bg-[#fafafa] px-2',
	};

	return (
		<span
			className={`inline-flex h-5 max-w-full min-w-0 items-center gap-1 overflow-hidden rounded px-1 py-[3px] text-[13px] leading-[1.4] text-[#1c1c1c] ${styles[variant]}`}
			style={{ fontFamily: TABLE.font }}
		>
			{left}
			<span className="truncate">{label}</span>
		</span>
	);
}

export function HeaderIcon({ columnId }: { columnId: string }) {
	const color = TABLE.colors.textTertiary;
	const stroke = 1.6;
	const size = 16;

	const icons: Record<string, ReactNode> = {
		url: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
				<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
			</svg>
		),
		createdBy: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<circle cx="12" cy="8" r="4" />
				<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
			</svg>
		),
		address: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<path d="M3 7l9-4 9 4-9 4-9-4z" />
				<path d="M3 7v10l9 4 9-4V7" />
			</svg>
		),
		accountOwner: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<circle cx="12" cy="12" r="9" />
				<circle cx="12" cy="10" r="3" />
				<path d="M7 18c.5-2 2.5-3 5-3s4.5 1 5 3" />
			</svg>
		),
		icp: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<circle cx="12" cy="12" r="9" />
				<circle cx="12" cy="12" r="3" />
			</svg>
		),
		arr: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" />
			</svg>
		),
		linkedin: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<rect x="4" y="4" width="16" height="16" rx="2" />
				<path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 014 0v3" />
			</svg>
		),
		industry: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<path d="M3 21h18M5 21V7l7-4 7 4v14" />
			</svg>
		),
		mainContact: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<circle cx="12" cy="8" r="4" />
				<path d="M6 20v-2a4 4 0 014-4h4" />
			</svg>
		),
		employees: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<path d="M9 11a3 3 0 106 0M3 21v-1a4 4 0 014-4h10a4 4 0 014 4v1" />
				<path d="M16 7a3 3 0 11-6 0" />
			</svg>
		),
		opportunities: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<circle cx="12" cy="12" r="9" />
				<circle cx="12" cy="12" r="1" />
				<path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
			</svg>
		),
		added: (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth={stroke}
			>
				<rect x="4" y="5" width="16" height="16" rx="2" />
				<path d="M16 3v4M8 3v4M4 11h16" />
			</svg>
		),
	};

	return <span className="shrink-0">{icons[columnId] ?? icons.added}</span>;
}

export function AppleLogo() {
	return (
		<Image
			src="/twenty/apple-rainbow-logo.svg"
			alt=""
			width={16}
			height={16}
			className="shrink-0"
		/>
	);
}
