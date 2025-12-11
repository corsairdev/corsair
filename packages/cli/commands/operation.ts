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

	const baseDir =
		kind === 'query'
			? cfg.pathToCorsairFolder + '/queries'
			: cfg.pathToCorsairFolder + '/mutations';
	const rawPwd = `${baseDir}/${kebabCaseName}.ts`;
	const pwd = rawPwd.startsWith('./') ? rawPwd.slice(2) : rawPwd;

	const schema = cfg.db;

	if (!schema) {
		console.error('No schema found');
		return;
	}

	if (!update && !force) {
		const { existsSync, readdirSync } = await import('fs');
		const { parseOperationFile } = await import('./list.js');
		const { checkSimilarity } = await import(
			'../llm/check-similarity.js'
		);
		const {
			displaySimilarOperations,
			promptUserChoice,
		} = await import('../utils/user-prompt.js');

		const operationsDir = baseDir;
		if (existsSync(operationsDir)) {
			const operationFiles = readdirSync(operationsDir)
				.filter((file) => file.endsWith('.ts') && file !== 'index.ts')
				.map((file) => join(operationsDir, file));

			const existingOperations = operationFiles
				.map((filePath) => parseOperationFile(filePath, kind))
				.filter((op) => op !== null);

			if (existingOperations.length > 0) {
				const similarityResult = await checkSimilarity(
					name,
					instructions || '',
					existingOperations,
					kind,
				);

				if (
					similarityResult &&
					similarityResult.hasSimilar &&
					similarityResult.similarOperations.length > 0
				) {
					displaySimilarOperations(similarityResult, kind);
					const userAction = await promptUserChoice(similarityResult);

					if (userAction.type === 'override') {
						const targetPath = join(
							baseDir,
							`${userAction.targetFileName}.ts`,
						);
						try {
							await fs.unlink(targetPath);
							console.log(
								`\n🗑️  Deleted ${userAction.targetOperation} (${userAction.targetFileName}.ts)\n`,
							);
						} catch (error) {
							console.error(
								`\n❌ Failed to delete ${targetPath}:`,
								error,
							);
							return;
						}
					} else if (userAction.type === 'update') {
						const targetPath = join(
							baseDir,
							`${userAction.targetFileName}.ts`,
						);
						const { extractCommentMetadata } = await import(
							'./list.js'
						);

						try {
							const existingContent = await fs.readFile(
								targetPath,
								'utf-8',
							);
							const metadata =
								extractCommentMetadata(existingContent);
							const existingInstructions =
								metadata.userInstructions || '';

							const mergedInstructions = existingInstructions
								? `${existingInstructions}. Additionally: ${instructions}`
								: instructions;

							update = true;
							name = userAction.targetFileName;
							instructions = mergedInstructions;

							console.log(
								`\n✏️  Updating ${userAction.targetOperation} with merged instructions\n`,
							);
						} catch (error) {
							console.error(
								`\n❌ Failed to read ${targetPath}:`,
								error,
							);
							return;
						}
					} else {
						console.log(
							`\n✅ Proceeding to create new ${kind}\n`,
						);
					}
				}
			}
		}
	}

	const finalKebabName = toKebabCase(name.trim());
	const finalCamelName = kebabToCamelCase(finalKebabName);
	const finalPwd = `${baseDir}/${finalKebabName}.ts`;
	const finalPath = finalPwd.startsWith('./') ? finalPwd.slice(2) : finalPwd;

	if (!update) {
		try {
			await fs.access(finalPath);
			console.log(
				`\n❌ ${kind.charAt(0).toUpperCase() + kind.slice(1)} "${finalCamelName}" already exists at ${finalPath}`,
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
		functionName: finalCamelName,
		incomingSchema: schema,
		config: {
			dbType: cfg.dbType,
			framework: cfg.framework,
			operation: kind,
			orm: cfg.orm,
		},
		instructions,
	});

	const spinner = new Spinner();
	const startTime = Date.now();

	try {
		spinner.start(
			`🤖 AI Agent is ${update ? 'updating' : 'generating'} ${kind} "${finalCamelName}"...`,
		);

		const result = await promptAgent(finalPath).generate({ prompt });

		const indexPath = join(baseDir, 'index.ts');
		await sortIndexFile(indexPath);

		const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
		const timeStr =
			elapsedSeconds < 60
				? `${elapsedSeconds}s`
				: `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;

		spinner.succeed(
			`Agent finished ${update ? 'updating' : 'generating'} ${kind} "${finalCamelName}" at ${finalPath} (${timeStr})`,
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
		spinner.fail(
			`Failed to ${update ? 'update' : 'generate'} ${kind} "${finalCamelName}"`,
		);
		throw error;
	}
}
