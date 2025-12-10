import { exec } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { promisify } from 'util';
import { loadConfig } from './config.js';

const execAsync = promisify(exec);

interface FileWithErrors {
	file: string;
	errors: string[];
}

async function getFilesWithErrors(): Promise<FileWithErrors[]> {
	const cfg = loadConfig();

	const queriesPath = resolve(
		process.cwd(),
		cfg.pathToCorsairFolder,
		'queries',
	);
	const mutationsPath = resolve(
		process.cwd(),
		cfg.pathToCorsairFolder,
		'mutations',
	);

	const allFiles: string[] = [];

	if (existsSync(queriesPath)) {
		const queryFiles = readdirSync(queriesPath)
			.filter((file) => file.endsWith('.ts') && file !== 'index.ts')
			.map((file) => join(queriesPath, file));
		allFiles.push(...queryFiles);
	}

	if (existsSync(mutationsPath)) {
		const mutationFiles = readdirSync(mutationsPath)
			.filter((file) => file.endsWith('.ts') && file !== 'index.ts')
			.map((file) => join(mutationsPath, file));
		allFiles.push(...mutationFiles);
	}

	if (allFiles.length === 0) {
		return [];
	}

	let output = '';

	try {
		const result = await execAsync('npx tsc --noEmit --pretty false 2>&1', {
			cwd: process.cwd(),
		});
		output = result.stdout || '';
	} catch (error: any) {
		output = (error.stdout || '') + (error.stderr || '');
	}

	const errors: FileWithErrors[] = [];

	for (const file of allFiles) {
		const normalizedPath = file.replace(resolve(process.cwd()) + '/', '');
		const fileName = file.split('/').pop()!;

		const fileErrors = output
			.split('\n')
			.filter(
				(line) =>
					line.trim() &&
					(line.includes(normalizedPath) || line.includes(fileName)),
			)
			.filter((line) => line.includes('error TS'));

		if (fileErrors.length > 0) {
			errors.push({ file, errors: fileErrors });
		}
	}

	return errors;
}

export async function fix() {
	console.log('🔍 Checking for files with errors...\n');

	const filesWithErrors = await getFilesWithErrors();

	if (filesWithErrors.length === 0) {
		console.log('✅ No files with errors found!\n');
		return;
	}

	const totalErrors = filesWithErrors.reduce(
		(sum, result) => sum + result.errors.length,
		0,
	);

	console.log('❌ Found errors in the following files:\n');
	filesWithErrors.forEach((result) => {
		const fileName = result.file.split('/').pop();
		const errorCount = result.errors.length;
		console.log(
			`📄 ${fileName}: ${errorCount} error${errorCount > 1 ? 's' : ''}`,
		);
	});

	console.log(
		`\n📊 Total: ${totalErrors} error${totalErrors > 1 ? 's' : ''} in ${filesWithErrors.length} file${filesWithErrors.length > 1 ? 's' : ''}\n`,
	);

	const { loadConfig } = await import('./config.js');
	const cfg = loadConfig();

	const queriesPath = resolve(
		process.cwd(),
		cfg.pathToCorsairFolder,
		'queries',
	);
	const mutationsPath = resolve(
		process.cwd(),
		cfg.pathToCorsairFolder,
		'mutations',
	);

	for (let i = 0; i < filesWithErrors.length; i++) {
		const fileWithError = filesWithErrors[i];
		if (!fileWithError) continue;
		const { file } = fileWithError;
		const fileName = file.split('/').pop()!.replace('.ts', '');

		const isQuery = file.includes(queriesPath);
		const kind = isQuery ? 'query' : 'mutation';

		console.log(
			`\n🔧 [${i + 1}/${filesWithErrors.length}] Regenerating ${kind} "${fileName}"...\n`,
		);

		try {
			const { runAgentOperation } = await import('./operation.js');
			await runAgentOperation(kind, fileName, undefined, true);
		} catch (error) {
			console.error(`\n❌ Failed to regenerate ${kind} "${fileName}":`, error);
			console.log(`\n⏭️  Continuing to next file...\n`);
			continue;
		}
	}

	console.log('\n🔄 Running final type check...\n');

	const remainingErrors = await getFilesWithErrors();

	if (remainingErrors.length === 0) {
		console.log('✅ All errors have been fixed!\n');
	} else {
		const remainingTotal = remainingErrors.reduce(
			(sum, result) => sum + result.errors.length,
			0,
		);
		console.log(
			`⚠️  ${remainingTotal} error${remainingTotal > 1 ? 's' : ''} still remaining in ${remainingErrors.length} file${remainingErrors.length > 1 ? 's' : ''}:`,
		);
		remainingErrors.forEach((result) => {
			const fileName = result.file.split('/').pop();
			console.log(`   📄 ${fileName}`);
		});
		console.log();
	}
}
