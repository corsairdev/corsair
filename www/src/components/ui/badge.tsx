import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-foreground text-background',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				outline: 'border-border bg-background text-foreground',
				muted: 'border-transparent bg-muted text-muted-foreground',
				accent: 'border-transparent bg-[#e8f0fe] text-[#1a4a8a]',
				success: 'border-transparent bg-[#e6f4ea] text-[#1e6b3a]',
				warning: 'border-transparent bg-[#fef3e0] text-[#8a5a00]',
				destructive: 'border-transparent bg-destructive/10 text-destructive',
			},
		},
		defaultVariants: {
			variant: 'secondary',
		},
	},
);

function Badge({
	className,
	variant = 'secondary',
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
