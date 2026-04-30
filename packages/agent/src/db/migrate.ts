import type { AgentKysely } from './schema.js';

/**
 * Creates the 3 agent tables. On an existing DB with the old schema (5 tables),
 * drops the obsolete tables and recreates the main 3 with the new shape.
 * Called automatically by agent.start() on every startup.
 */
export async function runAgentMigrations(db: AgentKysely) {
	// Drop tables from the old schema that no longer exist.
	await db.schema.dropTable('agent_step_executions').ifExists().execute();
	await db.schema.dropTable('agent_job_errors').ifExists().execute();

	// Detect the old schema by checking if agent_jobs still has the 'workflow' column.
	const tables = await db.introspection.getTables();
	const jobsTable = tables.find((t) => t.name === 'agent_jobs');
	const hasOldSchema = jobsTable?.columns.some((c) => c.name === 'workflow') ?? false;

	if (hasOldSchema) {
		await db.schema.dropTable('agent_jobs').ifExists().execute();
		await db.schema.dropTable('agent_hooks').ifExists().execute();
		await db.schema.dropTable('agent_job_instances').ifExists().execute();
	}

	await db.schema
		.createTable('agent_jobs')
		.ifNotExists()
		.addColumn('id', 'text', (c) => c.primaryKey().notNull())
		.addColumn('name', 'text', (c) => c.notNull())
		.addColumn('description', 'text')
		.addColumn('trigger', 'text', (c) => c.notNull()) // JSON
		.addColumn('instructions', 'text', (c) => c.notNull())
		.addColumn('status', 'text', (c) => c.notNull().defaultTo('active'))
		.addColumn('created_at', 'text', (c) => c.notNull())
		.addColumn('updated_at', 'text', (c) => c.notNull())
		.execute();

	await db.schema
		.createTable('agent_hooks')
		.ifNotExists()
		.addColumn('id', 'text', (c) => c.primaryKey().notNull())
		.addColumn('job_id', 'text', (c) => c.notNull())
		.addColumn('path', 'text', (c) => c.notNull())
		.addColumn('status', 'text', (c) => c.notNull().defaultTo('active'))
		.addColumn('created_at', 'text', (c) => c.notNull())
		.execute();

	await db.schema
		.createTable('agent_job_instances')
		.ifNotExists()
		.addColumn('id', 'text', (c) => c.primaryKey().notNull())
		.addColumn('job_id', 'text', (c) => c.notNull())
		.addColumn('status', 'text', (c) => c.notNull().defaultTo('running'))
		.addColumn('messages', 'text', (c) => c.notNull().defaultTo('[]')) // JSON
		.addColumn('triggered_by', 'text', (c) => c.notNull().defaultTo('{}')) // JSON
		.addColumn('correlation_id', 'text')
		.addColumn('timeout_at', 'integer') // unix ms
		.addColumn('started_at', 'text', (c) => c.notNull())
		.addColumn('updated_at', 'text', (c) => c.notNull())
		.execute();
}
