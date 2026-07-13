'use client';

import { useEffect } from 'react';

type OssErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function OssError({ error }: OssErrorProps) {
	useEffect(() => {
		console.error('[oss]', error.digest ?? 'no-digest', error);
	}, [error]);

	return null;
}
