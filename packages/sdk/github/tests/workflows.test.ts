import { Github } from '../api';
import { getTestOwner, getTestRepo, handleRateLimit, sleep } from './setup';

describe('Github.Workflows - Workflow Operations', () => {
	const owner = getTestOwner();
	const repo = getTestRepo();

	let workflowId: number | undefined;

	describe('list', () => {
		it('should list workflows for the repository', async () => {
			try {
				const result = await Github.Workflows.list(owner, repo, 10, 1);

				expect(result).toBeDefined();
				expect(result).toHaveProperty('total_count');
				expect(result).toHaveProperty('workflows');
				expect(Array.isArray(result.workflows)).toBe(true);

				console.log('Total workflows:', result.total_count);

				if (result.workflows.length > 0) {
					const firstWorkflow = result.workflows[0];
					if (firstWorkflow) {
						workflowId = firstWorkflow.id;
					}

					result.workflows.forEach((workflow) => {
						console.log(`  ID ${workflow.id}: ${workflow.name}`);
						console.log(`    Path: ${workflow.path}`);
						console.log(`    State: ${workflow.state}`);
					});
				} else {
					console.log('No workflows found in this repository');
					console.log(
						'Note: Workflow tests require workflows in .github/workflows/',
					);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get a specific workflow by ID', async () => {
			if (!workflowId) {
				console.warn('Skipping - no workflow available');
				return;
			}

			try {
				const workflow = await Github.Workflows.get(owner, repo, workflowId);

				expect(workflow).toBeDefined();
				expect(workflow.id).toBe(workflowId);
				expect(workflow).toHaveProperty('name');
				expect(workflow).toHaveProperty('path');
				expect(workflow).toHaveProperty('state');

				console.log('Workflow:', workflow.name);
				console.log('ID:', workflow.id);
				console.log('Path:', workflow.path);
				console.log('State:', workflow.state);
				console.log('Created:', workflow.created_at);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('getUsage', () => {
		it('should get workflow usage', async () => {
			if (!workflowId) {
				console.warn('Skipping - no workflow available');
				return;
			}

			try {
				const usage = await Github.Workflows.getUsage(owner, repo, workflowId);

				expect(usage).toBeDefined();
				expect(usage).toHaveProperty('billable');

				console.log('Workflow usage:', JSON.stringify(usage, null, 2));
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('listRuns', () => {
		it('should list workflow runs for the repository', async () => {
			try {
				const result = await Github.Workflows.listRuns(
					owner,
					repo,
					undefined,
					undefined,
					undefined,
					undefined,
					10,
					1,
				);

				expect(result).toBeDefined();
				expect(result).toHaveProperty('total_count');
				expect(result).toHaveProperty('workflow_runs');
				expect(Array.isArray(result.workflow_runs)).toBe(true);

				console.log('Total workflow runs:', result.total_count);

				if (result.workflow_runs.length > 0) {
					result.workflow_runs.slice(0, 5).forEach((run) => {
						console.log(`  Run #${run.run_number}: ${run.name || 'Unnamed'}`);
						console.log(`    ID: ${run.id}`);
						console.log(
							`    Status: ${run.status}, Conclusion: ${run.conclusion || 'pending'}`,
						);
						console.log(`    Event: ${run.event}`);
					});
				} else {
					console.log('No workflow runs found');
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('disable', () => {
		it('should disable a workflow', async () => {
			if (!workflowId) {
				console.warn('Skipping - no workflow available');
				return;
			}

			try {
				await sleep(1000);

				await Github.Workflows.disable(owner, repo, workflowId);
				console.log('Disabled workflow ID:', workflowId);

				const workflow = await Github.Workflows.get(owner, repo, workflowId);
				expect(workflow.state).toBe('disabled_manually');
				console.log('Verified: Workflow state is', workflow.state);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('enable', () => {
		it('should enable a workflow', async () => {
			if (!workflowId) {
				console.warn('Skipping - no workflow available');
				return;
			}

			try {
				await sleep(1000);

				await Github.Workflows.enable(owner, repo, workflowId);
				console.log('Enabled workflow ID:', workflowId);

				const workflow = await Github.Workflows.get(owner, repo, workflowId);
				expect(workflow.state).toBe('active');
				console.log('Verified: Workflow state is', workflow.state);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('dispatch', () => {
		it('should dispatch a workflow event', async () => {
			if (!workflowId) {
				console.warn('Skipping - no workflow available');
				return;
			}

			try {
				await sleep(1000);

				await Github.Workflows.dispatch(owner, repo, workflowId, {
					ref: 'main',
					inputs: {},
				});

				console.log('Dispatched workflow event for workflow ID:', workflowId);
				console.log('Check the Actions tab in GitHub to see the new run');
			} catch (error: any) {
				if (error.status === 422) {
					console.log(
						'Workflow does not have workflow_dispatch trigger configured',
					);
					console.log(
						'Add "on: workflow_dispatch" to your workflow file to enable manual dispatch',
					);
				} else {
					await handleRateLimit(error);
				}
			}
		});
	});
});
