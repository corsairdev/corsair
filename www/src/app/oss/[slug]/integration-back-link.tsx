import Link from 'next/link';

export function IntegrationBackLink() {
	return (
		<Link
			href="/oss"
			className="inline-flex items-center gap-1.5 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#4a38f5]"
		>
			← All integrations
		</Link>
	);
}
