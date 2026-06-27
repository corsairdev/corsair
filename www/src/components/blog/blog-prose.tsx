import { PortableText } from '@portabletext/react';

import {
	portableTextComponents,
	type BlogPortableTextProps,
} from '@/components/blog/portable-text-components';

export function BlogProse({ value }: BlogPortableTextProps) {
	return (
		<div className="blog-prose">
			<PortableText components={portableTextComponents} value={value} />
		</div>
	);
}
