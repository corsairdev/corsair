'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

type GlobalErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		posthog.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<h2>Something went wrong.</h2>
				<button type="button" onClick={() => reset()}>
					Try again
				</button>
			</body>
		</html>
	);
}
