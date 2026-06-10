import Link from 'next/link';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';

export function SignInBanner() {
	return (
		<div
			role="alert"
			className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-left text-xs text-amber-950"
		>
			<div className="flex min-w-0 items-center gap-2">
				<UserIcon className="size-4 shrink-0 text-current" />
				<p className="font-medium leading-snug">
					Sign in to claim an integration
				</p>
			</div>
			<Link
				href="/oss/sign-in"
				className="inline-flex h-7 shrink-0 items-center justify-center rounded-md border border-transparent bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80"
			>
				Sign in
			</Link>
		</div>
	);
}
