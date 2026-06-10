'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

export function SignOutButton() {
	const router = useRouter();

	return (
		<button
			type="button"
			className="text-xs text-muted-foreground transition-colors hover:text-foreground"
			onClick={async () => {
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => {
							router.refresh();
						},
					},
				});
			}}
		>
			Sign out
		</button>
	);
}
