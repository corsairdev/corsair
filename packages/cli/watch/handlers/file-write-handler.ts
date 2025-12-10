import { spawn } from 'child_process';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { format } from 'prettier';
import type { SourceFile } from 'ts-morph';
import { Project, SyntaxKind } from 'ts-morph';
import { getResolvedPaths, loadConfig } from '../../cli/config.js';

export interface OperationToWrite {
	operationName: string;
	operationType: 'query' | 'mutation';
	prompt: string;
	inputType: string;
	handler: string;
	dependencies?: {
		tables?: string[];
		columns?: string[];
	};
	pseudocode?: string;
	functionNameSuggestion?: string;
	targetFilePath?: string;
}

export interface WriteFileOptions {
	createDirectories?: boolean;
	overwrite?: boolean;
}

function kebabCase(str: string) {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}

export class FileWriteHandler {
	public getOperationFilePath(operation: OperationToWrite): string {
		const cfg = loadConfig();
		const pathsResolved = getResolvedPaths(cfg);
		const baseDir =
			operation.operationType === 'query'
				? pathsResolved.queriesDir
				: pathsResolved.mutationsDir;
		const newOperationFileName = `${kebabCase(operation.operationName)}.ts`;
		return path.join(baseDir, newOperationFileName);
	}

	public async writeOperationToFile(
		operation: OperationToWrite,
	): Promise<void> {
		const projectRoot = process.cwd();
		const operationTypePlural =
			operation.operationType === 'query' ? 'queries' : 'mutations';

		const cfg = loadConfig();
		const pathsResolved = getResolvedPaths(cfg);
		const baseDir =
			operation.operationType === 'query'
				? pathsResolved.queriesDir
				: pathsResolved.mutationsDir;
		const newOperationFilePath = this.getOperationFilePath(operation);

		const isQuery = operation.operationType === 'query';
		const variableName = operation.operationName
			.split(' ')
			.map((word, i) =>
				i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
			)
			.join('');

		const inputTypeCode = this.parseInputTypeFromLLM(operation.inputType);
		const handlerCodeRaw = this.parseHandlerFromLLM(operation.handler);
		const drizzleFns = this.getDrizzleFunctionsUsed(handlerCodeRaw);

		const imports: string[] = [];
		imports.push(`import { z } from 'corsair'`);
		imports.push(`import { procedure } from '../procedure'`);
		if (drizzleFns.size > 0) {
			imports.push(
				`import { ${Array.from(drizzleFns).join(', ')} } from 'drizzle-orm'`,
			);
		}

		const header = imports.join('\n');
		const handlerCode = handlerCodeRaw;

		let newOperationCode = `
${header}

export const ${variableName} = procedure
  .input(${inputTypeCode})
  .${isQuery ? 'query' : 'mutation'}(${handlerCode})
`;

		if (operation.pseudocode) {
			newOperationCode += ``;
		}
		if (operation.functionNameSuggestion) {
			newOperationCode += ``;
		}
		if (operation.dependencies) {
			newOperationCode += ``;
		}

		const formattedContent = await format(newOperationCode, {
			parser: 'typescript',
		});
		await fsp.writeFile(newOperationFilePath, formattedContent);

		const barrelPath = path.join(baseDir, 'index.ts');

		try {
			const existingBarrel = await fsp.readFile(barrelPath, 'utf8');
			const exportLine = `export * from './${path
				.basename(newOperationFilePath)
				.replace('.ts', '')}'\n`;
			if (!existingBarrel.includes(exportLine)) {
				await fsp.appendFile(barrelPath, exportLine);
			}
		} catch {
			const exportLine = `export * from './${path
				.basename(newOperationFilePath)
				.replace('.ts', '')}'\n`;
			await fsp.writeFile(barrelPath, exportLine);
		}

		const operationsFilePath = pathsResolved.operationsFile;
		const project = new Project();
		let operationsFile: SourceFile | null = null;

		if (fs.existsSync(operationsFilePath)) {
			try {
				operationsFile = project.addSourceFileAtPath(operationsFilePath);
			} catch {}

			if (operationsFile) {
				const moduleSpecifierRaw = path.relative(
					path.dirname(operationsFilePath),
					baseDir,
				);
				let moduleSpecifier = moduleSpecifierRaw.replace(/\\/g, '/');
				if (!moduleSpecifier.startsWith('.')) {
					moduleSpecifier = './' + moduleSpecifier;
				}
				const desiredNs = isQuery ? 'queriesModule' : 'mutationsModule';
				const existingNsImport = operationsFile
					.getImportDeclarations()
					.find(
						(d) =>
							d.getModuleSpecifierValue() === moduleSpecifier &&
							d.getNamespaceImport(),
					);
				if (!existingNsImport) {
					operationsFile.addImportDeclaration({
						moduleSpecifier,
						namespaceImport: desiredNs,
					});
				}

				const operationsVar =
					operationsFile.getVariableDeclaration(operationTypePlural);
				const initializer = operationsVar?.getInitializerIfKind(
					SyntaxKind.ObjectLiteralExpression,
				);

				if (initializer) {
					const propName = `"${operation.operationName}"`;
					const moduleRef = `${desiredNs}.${variableName}`;
					const exists = initializer
						.getProperties()
						.some((p) =>
							p.isKind(SyntaxKind.PropertyAssignment)
								? p.getNameNode().getText() === propName
								: false,
						);
					if (!exists) {
						initializer.addPropertyAssignment({
							name: propName,
							initializer: moduleRef,
						});
					}
				}

				operationsFile.formatText();
				await operationsFile.save();
			}
		}

		await new Promise<void>((resolve) => {
			const child = spawn('npx', ['--yes', 'tsc', '--noEmit'], {
				stdio: 'inherit',
				shell: true,
				cwd: projectRoot,
				env: process.env,
			});
			child.on('close', () => resolve());
		});
	}

	public parseInputTypeFromLLM(inputTypeString: string): string {
		const cleaned = inputTypeString.trim();
		if (cleaned.startsWith('z.object(') || cleaned.startsWith('z.')) {
			return cleaned;
		}
		return `z.object(${cleaned})`;
	}

	public parseHandlerFromLLM(handlerString: string): string {
		const cleaned = handlerString.trim();
		if (cleaned.startsWith('async ({') || cleaned.startsWith('({')) {
			return cleaned;
		}
		const arrowIdx = cleaned.indexOf('=>');
		if (arrowIdx !== -1) {
			const paramsPart = cleaned.slice(0, arrowIdx).trim();
			const bodyPart = cleaned.slice(arrowIdx + 2).trim();
			if (/^async\s*\(\s*input\s*,\s*ctx\s*\)$/.test(paramsPart)) {
				return `async ({ input, ctx }) => ${bodyPart}`;
			}
			if (/^\(\s*input\s*,\s*ctx\s*\)$/.test(paramsPart)) {
				return `async ({ input, ctx }) => ${bodyPart}`;
			}
		}
		if (cleaned.startsWith('async (')) {
			return cleaned;
		}
		if (cleaned.startsWith('(')) {
			return `async ${cleaned}`;
		}
		return cleaned;
	}

	public writeFile(
		filePath: string,
		content: string,
		options: WriteFileOptions = {},
	): void {
		const { createDirectories = true, overwrite = true } = options;
		if (!overwrite && fs.existsSync(filePath)) {
			throw new Error(`File already exists: ${filePath}`);
		}
		if (createDirectories) {
			const dir = path.dirname(filePath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
		}
		fs.writeFileSync(filePath, content, 'utf-8');
	}

	public getQueryOutputPath(queryId: string, projectRoot?: string): string {
		const root = projectRoot || process.cwd();
		const queriesDir = path.join(root, 'lib', 'corsair', 'queries');
		return path.join(queriesDir, `${queryId}.ts`);
	}

	public ensureDirectoryExists(dirPath: string): void {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}

	private getDrizzleFunctionsUsed(handlerCode: string): Set<string> {
		const fns = new Set<string>();
		const candidates = [
			'eq',
			'and',
			'or',
			'ilike',
			'like',
			'gt',
			'gte',
			'lt',
			'lte',
			'ne',
			'inArray',
			'between',
		];
		for (const fn of candidates) {
			const regex = new RegExp(`\\b${fn}\\s*\\(`);
			if (regex.test(handlerCode)) {
				fns.add(fn);
			}
		}
		return fns;
	}
}

export const fileWriteHandler = new FileWriteHandler();
