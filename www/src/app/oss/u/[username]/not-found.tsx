import Link from 'next/link';

export default function ContributorNotFound() {
	return (
		<main className="pb-16 pt-12">
			<Link
				href="/oss"
				className="mb-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
			>
				← All integrations
			</Link>
			<h1 className="text-2xl font-light tracking-[-0.02em] text-[#1c1c1c]">
				Contributor not found
			</h1>
			<p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#1c1c1c99]">
				We couldn&apos;t find a contributor with that GitHub username. They may
				not have signed up yet.
			</p>
		</main>
	);
}
