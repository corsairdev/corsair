import type { ReactNode } from 'react';

const INLINE_CODE_CLASS =
	'rounded bg-[#1c1c1c0d] px-1.5 py-0.5 font-[family-name:var(--landing-font-mono)] text-[0.9em] text-[#1c1c1c]';

export function renderTextWithInlineCode(text: string): ReactNode[] {
	const parts = text.split(/(`[^`]+`)/g);

	return parts.map((part, index) => {
		if (part.startsWith('`') && part.endsWith('`')) {
			return (
				<code key={index} className={INLINE_CODE_CLASS}>
					{part.slice(1, -1)}
				</code>
			);
		}

		return <span key={index}>{part}</span>;
	});
}

export function TextWithInlineCode({ text }: { text: string }) {
	return <>{renderTextWithInlineCode(text)}</>;
}
