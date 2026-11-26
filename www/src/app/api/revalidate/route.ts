import { revalidatePath, revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { after, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

import { blogPostIndexNowUrls, submitToIndexNow } from '@/lib/indexnow';

type SanityWebhookPayload = {
	_type: string;
	slug?: {
		current?: string;
	};
};

export async function POST(request: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET;

	if (!secret) {
		return NextResponse.json(
			{ message: 'Missing SANITY_REVALIDATE_SECRET' },
			{ status: 500 },
		);
	}

	try {
		const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
			request,
			secret,
		);

		if (!isValidSignature) {
			return NextResponse.json(
				{ message: 'Invalid signature' },
				{ status: 401 },
			);
		}

		if (body?._type === 'post') {
			revalidateTag('blog');
			revalidatePath('/blog');

			if (body.slug?.current) {
				revalidatePath(`/blog/${body.slug.current}`);
			}

			// Tell Bing and IndexNow engines the post changed, after the response.
			after(() => submitToIndexNow(blogPostIndexNowUrls(body.slug?.current)));
		}

		return NextResponse.json({ revalidated: true, now: Date.now() });
	} catch {
		return NextResponse.json(
			{ message: 'Failed to revalidate' },
			{ status: 500 },
		);
	}
}
