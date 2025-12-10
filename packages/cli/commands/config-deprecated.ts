import type { ConnectionConfig, CorsairConfig } from '@corsair-ai/core/config';
import { DefaultBaseConfig } from '@corsair-ai/core/config';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import type { Node } from 'ts-morph';
import { Project, SyntaxKind } from 'ts-morph';

type GenericCorsairConfig = CorsairConfig<any>;

type ConfigValue =
	| string
	| number
	| boolean
	| ConfigObject
	| ConfigArray
	| null;
type ConfigObject = { [key: string]: ConfigValue };
type ConfigArray = ConfigValue[];

const REQUIRED_CONFIG_FIELDS = [
	'framework',
	'dbType',
	'orm',
	'db',
	'connection',
] as const;

export function loadConfig(): CorsairConfig<any> {
	loadEnv('.env.local');
	const tsConfigPath = resolve(process.cwd(), 'corsair.config.ts');
	let userConfig: Partial<GenericCorsairConfig> | null = null;

	const getNodeValue = (node: Node | undefined): ConfigValue => {
		if (!node) return null;

		if (
			node.isKind(SyntaxKind.StringLiteral) ||
			node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
		) {
			return node.getLiteralText();
		}

		if (node.isKind(SyntaxKind.NumericLiteral)) {
			const num = Number(node.getText());
			return Number.isNaN(num) ? node.getText() : num;
		}

		if (node.isKind(SyntaxKind.TrueKeyword)) return true;
		if (node.isKind(SyntaxKind.FalseKeyword)) return false;

		if (node.isKind(SyntaxKind.NonNullExpression)) {
			return getNodeValue(node.getExpression());
		}

		if (node.isKind(SyntaxKind.PropertyAccessExpression)) {
			const exprText = node.getExpression().getText();
			const name = node.getName();
			if (exprText === 'process.env') {
				return process.env[name] ?? null;
			}
		}

		if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
			const result: ConfigObject = {};
			for (const prop of node.getProperties()) {
				if (prop.isKind(SyntaxKind.PropertyAssignment)) {
					const name = prop.getName().replace(/['"`]/g, '');
					const valueNode = prop.getInitializer();
					result[name] = getNodeValue(valueNode);
				}
			}
			return result;
		}

		if (node.isKind(SyntaxKind.ArrayLiteralExpression)) {
			return node.getElements().map((el: Node) => getNodeValue(el));
		}

		const text = node.getText();
		return typeof text === 'string' ? text.replace(/['"`]/g, '') : text;
	};

	if (existsSync(tsConfigPath)) {
		try {
			const project = new Project();
			const sf = project.addSourceFileAtPath(tsConfigPath);
			const exportAssignment = sf.getExportAssignment(() => true);
			let expr = exportAssignment?.getExpression();

			if (!expr) {
				const configVar = sf.getVariableDeclaration('config');
				const init = configVar?.getInitializer();
				if (init) {
					const objLiteral = init.getFirstDescendantByKind(
						SyntaxKind.ObjectLiteralExpression,
					);
					if (objLiteral) {
						expr = objLiteral;
					}
				}
			}

			if (expr?.isKind(SyntaxKind.ObjectLiteralExpression)) {
				const obj: ConfigObject = {};
				for (const prop of expr.getProperties()) {
					if (prop.isKind(SyntaxKind.PropertyAssignment)) {
						const name = prop.getName().replace(/['"`]/g, '');
						const valueNode = prop.getInitializer();
						const value = getNodeValue(valueNode);
						if (name) obj[name] = value;
					}
				}
				userConfig = obj as Partial<CorsairConfig<any>>;
			}
		} catch {}
	}

	const missingFields = REQUIRED_CONFIG_FIELDS.filter(
		(field) => !userConfig?.[field],
	);

	if (missingFields.length > 0) {
		throw new Error(
			`Missing required fields in corsair.config.ts: ${missingFields.join(', ')}`,
		);
	}

	return {
		apiEndpoint: userConfig?.apiEndpoint ?? DefaultBaseConfig.apiEndpoint,
		framework: userConfig?.framework,
		dbType: userConfig?.dbType,
		orm: userConfig?.orm,
		db: userConfig?.db,
		connection: userConfig?.connection,
		pathToCorsairFolder:
			userConfig?.pathToCorsairFolder ?? DefaultBaseConfig.pathToCorsairFolder,
	} as CorsairConfig<any>;
}

export function loadEnv(envFile: string): void {
	const possibleEnvFiles = [envFile, '.env.local', '.env'];

	for (const file of possibleEnvFiles) {
		const envPath = resolve(process.cwd(), file);
		if (existsSync(envPath)) {
			config({ path: envPath });
			return;
		}
	}
}

export function checkDatabaseUrl(connection: ConnectionConfig): void {
	if (typeof connection === 'string') {
		if (!connection) {
			console.error('❌ DATABASE_URL is empty');
			console.error('   Please set DATABASE_URL in your .env file\n');
			process.exit(1);
		}
	} else {
		const requiredFields: (keyof Exclude<ConnectionConfig, string>)[] = [
			'host',
			'username',
			'password',
			'database',
		];

		const missingFields = requiredFields.filter((field) => !connection[field]);

		if (missingFields.length > 0) {
			console.error(
				'❌ Missing required connection fields:',
				missingFields.join(', '),
			);
			console.error(
				'   Please provide all required connection details in your config\n',
			);
			process.exit(1);
		}
	}
}

export function getResolvedPaths(cfg: CorsairConfig<any>): {
	queriesDir: string;
	mutationsDir: string;
	schemaFile: string;
	operationsFile: string;
} {
	const queriesDir = resolve(process.cwd(), 'corsair/queries');
	const mutationsDir = resolve(process.cwd(), 'corsair/mutations');
	const schemaFile = resolve(process.cwd(), 'corsair/schema.ts');
	const operationsFile = resolve(queriesDir, '..', 'operations.ts');
	return { queriesDir, mutationsDir, schemaFile, operationsFile };
}

export function validatePaths(cfg: CorsairConfig<any>): string[] {
	const warnings: string[] = [];
	const { queriesDir, mutationsDir } = getResolvedPaths(cfg);
	if (!existsSync(queriesDir)) warnings.push(`queries: ${queriesDir}`);
	if (!existsSync(mutationsDir)) warnings.push(`mutations: ${mutationsDir}`);
	return warnings;
}
