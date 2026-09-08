import { APP_URL, DOCS_URL } from '@/lib/site-links';

export function CompareCta() {
	return (
		<section className="border-t border-[#1c1c1c1a] bg-white py-16 md:py-20">
			<div className="mx-auto max-w-[640px] px-4 text-center sm:px-6 md:px-10">
				<h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] text-[#1c1c1c] md:text-3xl">
					Ready to switch?
				</h2>
				<p className="mb-8 text-base leading-relaxed text-[#1c1c1c99]">
					Start with the hosted dashboard or self-host the open-source SDK. Your
					customers&apos; credentials stay in your database either way.
				</p>
				<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
					<a
						href={APP_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex w-full touch-manipulation items-center justify-center rounded-lg bg-[#4a38f5] px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-[#3d2ee0] sm:w-auto"
					>
						Go to app
					</a>
					<a
						href={DOCS_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex w-full touch-manipulation items-center justify-center rounded-lg border border-[#1c1c1c1a] bg-white px-6 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#f4f4f4] sm:w-auto"
					>
						Read the docs
					</a>
				</div>
			</div>
		</section>
	);
}
