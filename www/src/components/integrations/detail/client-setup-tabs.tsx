'use client';

import type { ReactNode } from 'react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * One tab per MCP client. Every panel stays in the page (inactive ones are
 * `hidden`), so search engines and Ctrl+F still find each client's steps.
 */
export function ClientSetupTabs({
	clients,
}: {
	clients: { name: string; body: ReactNode }[];
}) {
	const baseId = useId();
	const [active, setActive] = useState(0);

	return (
		<div className="mt-4 rounded-md border border-[#1c1c1c]/10 bg-white">
			<div
				role="tablist"
				aria-label="MCP clients"
				className="flex gap-1 overflow-x-auto border-b border-[#1c1c1c]/8 px-2 pt-2"
			>
				{clients.map((client, index) => (
					<button
						key={client.name}
						type="button"
						role="tab"
						id={`${baseId}-tab-${index}`}
						aria-selected={active === index}
						aria-controls={`${baseId}-panel-${index}`}
						onClick={() => setActive(index)}
						className={cn(
							'-mb-px shrink-0 border-b-2 px-3 py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
							active === index
								? 'border-[#1c1c1c] text-[#1c1c1c]'
								: 'border-transparent text-[#1c1c1c99] hover:text-[#1c1c1c]',
						)}
					>
						{client.name}
					</button>
				))}
			</div>
			{clients.map((client, index) => (
				<div
					key={client.name}
					role="tabpanel"
					id={`${baseId}-panel-${index}`}
					aria-labelledby={`${baseId}-tab-${index}`}
					hidden={active !== index}
					className="px-4 py-4 text-sm leading-relaxed text-[#1c1c1c99]"
				>
					{client.body}
				</div>
			))}
		</div>
	);
}
