import * as c from './endpoints/types-runs';

export const runsSchemas = {
	'runs.list': { input: c.ListRunsInputSchema, output: c.ListRunsOutputSchema },
	'runs.status': {
		input: c.GetRunStatusInputSchema,
		output: c.GetRunStatusOutputSchema,
	},
	'runs.input': {
		input: c.GetRunInputDataInputSchema,
		output: c.GetRunInputDataOutputSchema,
	},
	'runs.receipts': {
		input: c.GetRunReceiptsInputSchema,
		output: c.GetRunReceiptsOutputSchema,
	},
	'runs.events': {
		input: c.SearchRunEventsInputSchema,
		output: c.SearchRunEventsOutputSchema,
	},
	'runs.billing': {
		input: c.GetRunBillingInputSchema,
		output: c.GetRunBillingOutputSchema,
	},
	'runs.stop': { input: c.StopRunInputSchema, output: c.StopRunOutputSchema },
	'runs.stopAll': {
		input: c.StopAllRunsInputSchema,
		output: c.StopAllRunsOutputSchema,
	},
	'runs.rerun': { input: c.RerunInputSchema, output: c.RerunOutputSchema },
	'runs.resume': {
		input: c.ResumeRunInputSchema,
		output: c.ResumeRunOutputSchema,
	},
	'db.query': {
		input: c.QueryCustomerDbInputSchema,
		output: c.QueryCustomerDbOutputSchema,
	},
} as const;

export const runsMeta = {
	'runs.list': {
		riskLevel: 'read',
		description: 'List Play runs filtered by Play, status or run id',
	},
	'runs.status': {
		riskLevel: 'read',
		description: 'Read the lifecycle status and progress counters of one run',
	},
	'runs.input': {
		riskLevel: 'read',
		description: 'Read the exact original input retained for a run',
	},
	'runs.receipts': {
		riskLevel: 'read',
		description:
			'Read retained tool results for a run by receipt key, without executing tools',
	},
	'runs.events': {
		riskLevel: 'read',
		description: 'Search structured run events across the workspace or one run',
	},
	'runs.billing': {
		riskLevel: 'read',
		description:
			'Read credits billed to up to 100 runs and whether they are settling',
	},
	'runs.stop': {
		riskLevel: 'destructive',
		description: 'Stop one running Play run',
	},
	'runs.stopAll': {
		riskLevel: 'destructive',
		description:
			'Stop every active run in the workspace; dryRun only lists them',
	},
	'runs.rerun': {
		riskLevel: 'destructive',
		description:
			"Start a new run from a past run's input and revision (may spend credits)",
	},
	'runs.resume': {
		riskLevel: 'destructive',
		description:
			'Continue a failed or cancelled run in place (may spend credits)',
	},
	'db.query': {
		riskLevel: 'destructive',
		description:
			'Run SQL on the workspace customer database; writes can change storage tables',
	},
} as const;
