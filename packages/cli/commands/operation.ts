import { join } from 'path';
import {
	kebabToCamelCase,
	Spinner,
	sortIndexFile,
	toKebabCase,
} from '../utils/utils.js';

type OpKind = 'query' | 'mutation';

export async function runAgentOperation(
	kind: OpKind,
	name: string,
	instructions?: string,
	update?: boolean,
	force?: boolean,
) {
	const { loadConfig } = await import('./config.js');
	const { promptAgent } = await import('../llm/agent/index.js');
	const { promptBuilder } = await import(
		'../llm/agent/prompts/prompt-builder.js'
	);
	const { promises: fs } = await import('fs');

	const cfg = await loadConfig();
	const kebabCaseName = toKebabCase(name.trim());
	const camelCaseName = kebabToCamelCase(kebabCaseName);

	if (!cfg) {
		console.error('No config found');
		return;
	}

	const queriesDir = cfg.pathToCorsairFolder + '/queries';
	const mutationsDir = cfg.pathToCorsairFolder + '/mutations';

	const baseDir = kind === 'query' ? queriesDir : mutationsDir;
	const rawPwd = `${baseDir}/${kebabCaseName}.ts`;
	const pwd = rawPwd.startsWith('./') ? rawPwd.slice(2) : rawPwd;

	const schema = cfg.db;

	if (!schema) {
		console.error('No schema found');
		return;
	}

	if (!update) {
		try {
			await fs.access(pwd);
			console.log(
				`\n❌ ${kind.charAt(0).toUpperCase() + kind.slice(1)} "${camelCaseName}" already exists at ${pwd}`,
			);
			console.log(`💡 Use -u flag to update the existing ${kind}\n`);
			return;
		} catch (error: any) {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		}
	}

	const prompt = promptBuilder({
		functionName: camelCaseName,
		incomingSchema: schema,
		config: {
			dbType: cfg.dbType,
			framework: cfg.framework,
			operation: kind,
			orm: cfg.orm,
		},
		instructions,
		requestedOperationName: kebabCaseName,
		force,
		skipReuseCheck: Boolean(force) || Boolean(update),
		operationBaseDir: baseDir,
	});

	const startTime = Date.now();

	try {
		// Use a static message to avoid spinner interference with agent output
		const message = `🤖 AI Agent is ${update ? 'updating' : 'generating'} ${kind} "${camelCaseName}"...`;
		process.stdout.write(message);

		const result = await promptAgent(pwd, {
			queriesDir,
			mutationsDir,
		}).generate({ prompt });

		// Clear the line and show success
		process.stdout.write('\r\x1B[K');

		const indexPath = join(baseDir, 'index.ts');
		await sortIndexFile(indexPath);

		const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
		const timeStr =
			elapsedSeconds < 60
				? `${elapsedSeconds}s`
				: `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;

		console.log(
			`✅ Agent finished ${update ? 'updating' : 'generating'} ${kind} "${camelCaseName}" at ${pwd} (${timeStr})`,
		);

		if (result.usage) {
			console.log('\n🔢 Token Usage:');
			console.log(
				`   Input tokens:  ${result.usage.inputTokens?.toLocaleString() ?? 'N/A'}`,
			);
			console.log(
				`   Output tokens: ${result.usage.outputTokens?.toLocaleString() ?? 'N/A'}`,
			);
			console.log(
				`   Total tokens:  ${result.usage.totalTokens?.toLocaleString() ?? 'N/A'}`,
			);
		}

		if (result.text) {
			console.log('\n📋 Agent Report:');
			console.log('─'.repeat(80));
			console.log(result.text);
			console.log('─'.repeat(80));
			console.log();
		}
	} catch (error) {
		process.stdout.write('\r\x1B[K');
		console.error(
			`❌ Failed to ${update ? 'update' : 'generate'} ${kind} "${camelCaseName}"`,
		);
		throw error;
	}
}
