import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL:
		typeof window !== 'undefined'
			? window.location.origin
			: (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
	plugins: [magicLinkClient()],
});
