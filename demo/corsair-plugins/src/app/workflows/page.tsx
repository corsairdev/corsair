'use client';

import { useState, useEffect } from 'react';

interface WorkflowMetadata {
	id: string;
	name: string;
	description: string;
	trigger: {
		type: 'manual' | 'cron' | 'webhook';
		config: {
			schedule?: string;
			event?: string;
			note?: string;
		};
	};
	steps: Array<{
		name: string;
		description: string;
		service: string;
		code: string;
	}>;
	services: string[];
	estimatedDuration: string;
}

interface WorkflowsData {
	manual: WorkflowMetadata[];
	cron: WorkflowMetadata[];
	webhook: WorkflowMetadata[];
	all: WorkflowMetadata[];
}

export default function WorkflowsPage() {
	const [workflows, setWorkflows] = useState<WorkflowsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [executing, setExecuting] = useState<Record<string, boolean>>({});
	const [results, setResults] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [params, setParams] = useState<Record<string, Record<string, any>>>({});

	useEffect(() => {
		fetchWorkflows();
	}, []);

	const fetchWorkflows = async () => {
		try {
			const response = await fetch('/api/workflows');
			const data = await response.json();
			setWorkflows(data);
		} catch (error) {
			console.error('Failed to load workflows:', error);
		} finally {
			setLoading(false);
		}
	};

	const executeWorkflow = async (workflowId: string) => {
		setExecuting((prev) => ({ ...prev, [workflowId]: true }));
		setErrors((prev) => ({ ...prev, [workflowId]: '' }));
		setResults((prev) => ({ ...prev, [workflowId]: null }));

		try {
			const response = await fetch('/api/workflows', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					workflowId,
					params: params[workflowId] || {},
				}),
			});

			const data = await response.json();

			if (data.success) {
				setResults((prev) => ({ ...prev, [workflowId]: data.result }));
			} else {
				setErrors((prev) => ({
					...prev,
					[workflowId]: data.error || 'Failed to execute workflow',
				}));
			}
		} catch (error) {
			setErrors((prev) => ({
				...prev,
				[workflowId]:
					error instanceof Error ? error.message : 'Failed to execute workflow',
			}));
		} finally {
			setExecuting((prev) => ({ ...prev, [workflowId]: false }));
		}
	};

	const updateParam = (workflowId: string, key: string, value: any) => {
		setParams((prev) => ({
			...prev,
			[workflowId]: {
				...(prev[workflowId] || {}),
				[key]: value,
			},
		}));
	};

	const formatCronSchedule = (schedule: string) => {
		// Basic cron format explanation
		const parts = schedule.split(' ');
		if (parts.length === 5) {
			const [minute, hour, day, month, weekday] = parts;
			let description = '';

			if (weekday.includes('-')) {
				const [start, end] = weekday.split('-').map(Number);
				const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				description = `${days[start]}-${days[end]}`;
			} else if (weekday !== '*') {
				const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				description = days[Number(weekday)];
			}

			return `${hour}:${minute.padStart(2, '0')} ${description || 'every day'}`;
		}
		return schedule;
	};

	if (loading) {
		return (
			<div style={{ padding: '2rem', textAlign: 'center' }}>
				<p>Loading workflows...</p>
			</div>
		);
	}

	if (!workflows) {
		return (
			<div style={{ padding: '2rem', textAlign: 'center' }}>
				<p>Failed to load workflows</p>
			</div>
		);
	}

	return (
		<main
			style={{
				padding: '2rem',
				fontFamily: 'system-ui, sans-serif',
				maxWidth: '1400px',
				margin: '0 auto',
			}}
		>
			<h1>Workflows Dashboard</h1>
			<p style={{ color: '#666', marginBottom: '2rem' }}>
				Manage and trigger manual and scheduled workflows
			</p>

			{/* Manual Workflows */}
			<section style={{ marginBottom: '3rem' }}>
				<h2 style={{ marginBottom: '1rem', borderBottom: '2px solid #0070f3', paddingBottom: '0.5rem' }}>
					Manual Workflows ({workflows.manual.length})
				</h2>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
						gap: '1.5rem',
					}}
				>
					{workflows.manual.map((workflow) => (
						<WorkflowCard
							key={workflow.id}
							workflow={workflow}
							executing={executing[workflow.id] || false}
							result={results[workflow.id]}
							error={errors[workflow.id]}
							params={params[workflow.id] || {}}
							onExecute={() => executeWorkflow(workflow.id)}
							onUpdateParam={(key, value) => updateParam(workflow.id, key, value)}
						/>
					))}
				</div>
			</section>

			{/* Cron Workflows */}
			<section style={{ marginBottom: '3rem' }}>
				<h2 style={{ marginBottom: '1rem', borderBottom: '2px solid #28a745', paddingBottom: '0.5rem' }}>
					Scheduled Workflows ({workflows.cron.length})
				</h2>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
						gap: '1.5rem',
					}}
				>
					{workflows.cron.map((workflow) => (
						<WorkflowCard
							key={workflow.id}
							workflow={workflow}
							executing={executing[workflow.id] || false}
							result={results[workflow.id]}
							error={errors[workflow.id]}
							params={params[workflow.id] || {}}
							onExecute={() => executeWorkflow(workflow.id)}
							onUpdateParam={(key, value) => updateParam(workflow.id, key, value)}
							schedule={workflow.trigger.config.schedule}
							formatSchedule={formatCronSchedule}
						/>
					))}
				</div>
			</section>
		</main>
	);
}

interface WorkflowCardProps {
	workflow: WorkflowMetadata;
	executing: boolean;
	result: any;
	error: string;
	params: Record<string, any>;
	onExecute: () => void;
	onUpdateParam: (key: string, value: any) => void;
	schedule?: string;
	formatSchedule?: (schedule: string) => string;
}

function WorkflowCard({
	workflow,
	executing,
	result,
	error,
	params,
	onExecute,
	onUpdateParam,
	schedule,
	formatSchedule,
}: WorkflowCardProps) {
	const [expanded, setExpanded] = useState(false);

	// Common params for workflows
	const needsDaysAgo = workflow.id.includes('sync') || workflow.id.includes('archive') || workflow.id.includes('export');

	return (
		<div
			style={{
				border: '1px solid #e0e0e0',
				borderRadius: '8px',
				padding: '1.5rem',
				backgroundColor: '#fff',
				boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
				<div style={{ flex: 1 }}>
					<h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
						{workflow.name}
					</h3>
					{schedule && formatSchedule && (
						<div
							style={{
								display: 'inline-block',
								padding: '0.25rem 0.75rem',
								backgroundColor: '#e7f5e7',
								color: '#155724',
								borderRadius: '4px',
								fontSize: '0.875rem',
								marginBottom: '0.5rem',
							}}
						>
							⏰ {formatSchedule(schedule)}
						</div>
					)}
					<p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
						{workflow.description}
					</p>
				</div>
			</div>

			<div style={{ marginBottom: '1rem' }}>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
					{workflow.services.map((service) => (
						<span
							key={service}
							style={{
								padding: '0.25rem 0.5rem',
								backgroundColor: '#f0f0f0',
								borderRadius: '4px',
								fontSize: '0.75rem',
								textTransform: 'uppercase',
							}}
						>
							{service}
						</span>
					))}
					<span
						style={{
							padding: '0.25rem 0.5rem',
							backgroundColor: '#e7f3ff',
							borderRadius: '4px',
							fontSize: '0.75rem',
						}}
					>
						{workflow.estimatedDuration}
					</span>
				</div>
			</div>

			{needsDaysAgo && (
				<div style={{ marginBottom: '1rem' }}>
					<label
						style={{
							display: 'block',
							marginBottom: '0.25rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Days Ago:
					</label>
					<input
						type="number"
						value={params.daysAgo || (workflow.id.includes('archive') ? 90 : 7)}
						onChange={(e) => onUpdateParam('daysAgo', parseInt(e.target.value) || 0)}
						style={{
							width: '100%',
							padding: '0.5rem',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '0.875rem',
						}}
					/>
				</div>
			)}

			<button
				onClick={onExecute}
				disabled={executing}
				style={{
					width: '100%',
					padding: '0.75rem',
					backgroundColor: schedule ? '#28a745' : '#0070f3',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					fontSize: '0.9rem',
					fontWeight: '500',
					cursor: executing ? 'not-allowed' : 'pointer',
					opacity: executing ? 0.6 : 1,
					marginBottom: '1rem',
				}}
			>
				{executing ? 'Running...' : schedule ? 'Run Now' : 'Execute'}
			</button>

			{error && (
				<div
					style={{
						padding: '0.75rem',
						backgroundColor: '#f8d7da',
						color: '#721c24',
						borderRadius: '4px',
						marginBottom: '1rem',
						fontSize: '0.875rem',
					}}
				>
					❌ {error}
				</div>
			)}

			{result && (
				<div
					style={{
						padding: '0.75rem',
						backgroundColor: '#d4edda',
						color: '#155724',
						borderRadius: '4px',
						marginBottom: '1rem',
						fontSize: '0.875rem',
					}}
				>
					✅ Workflow completed successfully
				</div>
			)}

			<button
				onClick={() => setExpanded(!expanded)}
				style={{
					width: '100%',
					padding: '0.5rem',
					backgroundColor: 'transparent',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '0.875rem',
					cursor: 'pointer',
				}}
			>
				{expanded ? '▼ Hide Details' : '▶ Show Details'}
			</button>

			{expanded && (
				<div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
					<h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Steps:</h4>
					<ol style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
						{workflow.steps.map((step, idx) => (
							<li key={idx} style={{ marginBottom: '0.5rem' }}>
								<strong>{step.name}</strong> ({step.service})
								<br />
								<span style={{ color: '#666' }}>{step.description}</span>
							</li>
						))}
					</ol>
				</div>
			)}
		</div>
	);
}
