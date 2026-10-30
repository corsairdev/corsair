'use client';

import { EnterpriseContactDialog } from './enterprise-contact-dialog';

const CTA_CLASS =
	'inline-flex w-full max-w-[140px] items-center justify-center rounded-full border border-[#1c1c1c] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c] hover:text-white font-[family-name:var(--landing-font-sans)]';

export function PricingTierCta({
	label,
	href,
	external,
	variant,
}: {
	label: string;
	href?: string;
	external?: boolean;
	variant: 'link' | 'dialog';
}) {
	if (variant === 'dialog') {
		return <EnterpriseContactDialog />;
	}

	if (!href) {
		return (
			<span
				className={`${CTA_CLASS} cursor-default opacity-50`}
				aria-disabled="true"
			>
				{label}
			</span>
		);
	}

	return (
		<a
			href={href}
			{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
			className={CTA_CLASS}
		>
			{label}
		</a>
	);
}
