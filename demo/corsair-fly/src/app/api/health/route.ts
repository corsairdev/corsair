import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
	try {
		// Test database connection
		await db.execute(`SELECT 1`);

		return NextResponse.json({
			status: 'ok',
			timestamp: new Date().toISOString(),
			database: 'connected',
		});
	} catch (error) {
		console.error('Health check failed:', error);
		return NextResponse.json(
			{
				status: 'error',
				timestamp: new Date().toISOString(),
				database: 'disconnected',
			},
			{ status: 503 },
		);
	}
}
