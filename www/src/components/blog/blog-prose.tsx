import { PortableText } from '@portabletext/react';
import type { BlogPortableTextProps } from '@/components/blog/portable-text-components';
import { portableTextComponents } from '@/components/blog/portable-text-components';

export function BlogProse({ value }: BlogPortableTextProps) {
	return (
		<div className="blog-prose">
			<PortableText components={portableTextComponents} value={value} />
		</div>
	);
}
