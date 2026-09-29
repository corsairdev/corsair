import type { ReactNode } from 'react';

import { CompareLayout } from '@/components/compare/compare-layout';

export default function ComparePagesLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <CompareLayout>{children}</CompareLayout>;
}
