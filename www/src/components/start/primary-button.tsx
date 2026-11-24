import type { ReactNode } from 'react';

/** The step's submit button, in corsair.dev's accent. */
export function PrimaryButton({
	disabled,
	children,
}: {
	disabled?: boolean;
	children: ReactNode;
}) {
	return (
		<button
			type="submit"
			disabled={disabled}
			className="inline-flex shrink-0 touch-manipulation items-center justify-center gap-2 rounded-lg bg-[#4a38f5] px-5 py-3 text-[15px] font-medium text-white transition-[background-color,opacity] hover:bg-[#3d2ee0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[#4a38f5]"
		>
			{children}
		</button>
	);
}
