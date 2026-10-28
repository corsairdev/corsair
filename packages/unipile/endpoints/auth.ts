import { defineOperation, noContent } from './call';

// Start Auth Intent (POST /v2/auth/intent)
export const startIntent = defineOperation(
	'authStartIntent',
	'auth.startIntent',
	{ method: 'POST', path: '/v2/auth/intent', body: 'rest' },
);

// Solve a Checkpoint (POST /v2/auth/checkpoint)
export const solveCheckpoint = defineOperation(
	'authSolveCheckpoint',
	'auth.solveCheckpoint',
	{ method: 'POST', path: '/v2/auth/checkpoint', body: ['code', 'intent_id'] },
);

// Request Checkpoint (POST /v2/auth/checkpoint/request)
export const requestCheckpoint = defineOperation(
	'authRequestCheckpoint',
	'auth.requestCheckpoint',
	{
		method: 'POST',
		path: '/v2/auth/checkpoint/request',
		body: ['intent_id', 'challenge'],
	},
);

// Resend Checkpoint Notification or Code (POST /v2/auth/checkpoint/resend)
export const resendCheckpoint = defineOperation(
	'authResendCheckpoint',
	'auth.resendCheckpoint',
	{ method: 'POST', path: '/v2/auth/checkpoint/resend', body: ['intent_id'] },
	noContent,
);
