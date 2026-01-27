import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { inngest } from '@/server/inngest/client';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { title, description } = body;

		if (!title) {
			return NextResponse.json(
				{ success: false, error: 'Title is required' },
				{ status: 400 },
			);
		}

		const tenantId = request.headers.get('x-tenant-id') || 'default';

		await inngest.send({
			name: 'issue/reported',
			data: {
				tenantId,
				title,
				description,
			},
		});

		return NextResponse.json({
			success: true,
			message: 'Issue reported successfully',
		});
	} catch (error) {
		console.error('Error reporting issue:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to report issue' },
			{ status: 500 },
		);
	}
}
