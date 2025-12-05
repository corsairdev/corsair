import { existsSync, readdirSync, readFileSync } from "fs";
import { basename, join, resolve } from "path";
import { loadConfig } from "./config.js";
import { kebabToCamelCase } from "./utils/utils.js";

interface OperationInfo {
	name: string;
	fileName: string;
	type: "query" | "mutation";
	input: string | null;
	output: string | null;
	pseudoCode: string[] | null;
	userInstructions: string | null;
}

function extractCommentMetadata(content: string): {
	input: string | null;
	output: string | null;
	pseudoCode: string[] | null;
	userInstructions: string | null;
} {
	const commentBlockMatch = content.match(/\/\*\*[\s\S]*?\*\//);
	if (!commentBlockMatch) {
		return {
			input: null,
			output: null,
			pseudoCode: null,
			userInstructions: null,
		};
	}

	const commentBlock = commentBlockMatch[0];

	const inputMatch = commentBlock.match(
		/INPUT:\s*(.+?)(?=\n\s*\*\s*(?:OUTPUT|PSEUDO|USER|\*\/))/s,
	);
	const input = inputMatch?.[1]
		? inputMatch[1]
				.trim()
				.replace(/\s*\*\s*/g, " ")
				.trim()
		: null;

	const outputMatch = commentBlock.match(
		/OUTPUT:\s*(.+?)(?=\n\s*\*\s*(?:PSEUDO|USER|\*\/))/s,
	);
	const output = outputMatch?.[1]
		? outputMatch[1]
				.trim()
				.replace(/\s*\*\s*/g, " ")
				.trim()
		: null;

	const pseudoCodeMatch = commentBlock.match(
		/PSEUDO CODE:\s*([\s\S]+?)(?=\n\s*\*\s*(?:USER INSTRUCTIONS|\*\/))/s,
	);
	let pseudoCode: string[] | null = null;
	if (pseudoCodeMatch?.[1]) {
		pseudoCode = pseudoCodeMatch[1]
			.split("\n")
			.map((line) => line.replace(/^\s*\*\s*/, "").trim())
			.filter((line) => line.length > 0 && /^\d+\./.test(line));
	}

	const userInstructionsMatch = commentBlock.match(
		/USER INSTRUCTIONS:\s*(.+?)(?=\n\s*\*\/)/s,
	);
	const userInstructions = userInstructionsMatch?.[1]
		? userInstructionsMatch[1]
				.trim()
				.replace(/\s*\*\s*/g, " ")
				.trim()
		: null;

	return { input, output, pseudoCode, userInstructions };
}

function parseOperationFile(
	filePath: string,
	type: "query" | "mutation",
): OperationInfo | null {
	try {
		const content = readFileSync(filePath, "utf-8");
		const fileName = basename(filePath, ".ts");
		const name = kebabToCamelCase(fileName);

		const metadata = extractCommentMetadata(content);

		return {
			name,
			fileName,
			type,
			input: metadata.input,
			output: metadata.output,
			pseudoCode: metadata.pseudoCode,
			userInstructions: metadata.userInstructions,
		};
	} catch {
		return null;
	}
}

function formatOperation(op: OperationInfo): string {
	const lines: string[] = [];
	const typeLabel = op.type === "query" ? "🔍" : "✏️";
	const typeText = op.type.toUpperCase();

	lines.push(`${typeLabel} ${op.name} [${typeText}]`);
	lines.push(`   File: ${op.fileName}.ts`);

	if (op.input) {
		lines.push(`   Input: ${op.input}`);
	}

	if (op.output) {
		lines.push(`   Output: ${op.output}`);
	}

	if (op.userInstructions) {
		lines.push(`   Description: ${op.userInstructions}`);
	}

	if (op.pseudoCode && op.pseudoCode.length > 0) {
		lines.push(`   Pseudo Code:`);
		op.pseudoCode.forEach((step) => {
			lines.push(`      ${step}`);
		});
	}

	return lines.join("\n");
}

function matchesFilter(op: OperationInfo, filter: string): boolean {
	const normalizedFilter = filter.toLowerCase().replace(/\s+/g, " ");
	const searchableText = [
		op.name,
		op.fileName,
		op.input,
		op.output,
		op.userInstructions,
		...(op.pseudoCode || []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	const filterWords = normalizedFilter.split(" ");
	return filterWords.every((word) => searchableText.includes(word));
}

export async function list(options: {
	queries?: boolean;
	mutations?: boolean;
	filter?: string;
}) {
	const cfg = loadConfig();

	const queriesPath = resolve(
		process.cwd(),
		cfg.pathToCorsairFolder,
		"queries",
	);
	const mutationsPath = resolve(
		process.cwd(),
		cfg.pathToCorsairFolder,
		"mutations",
	);

	const operations: OperationInfo[] = [];

	const showQueries =
		options.queries || (!options.queries && !options.mutations);
	const showMutations =
		options.mutations || (!options.queries && !options.mutations);

	if (showQueries && existsSync(queriesPath)) {
		const queryFiles = readdirSync(queriesPath)
			.filter((file) => file.endsWith(".ts") && file !== "index.ts")
			.map((file) => join(queriesPath, file));

		for (const filePath of queryFiles) {
			const op = parseOperationFile(filePath, "query");
			if (op) operations.push(op);
		}
	}

	if (showMutations && existsSync(mutationsPath)) {
		const mutationFiles = readdirSync(mutationsPath)
			.filter((file) => file.endsWith(".ts") && file !== "index.ts")
			.map((file) => join(mutationsPath, file));

		for (const filePath of mutationFiles) {
			const op = parseOperationFile(filePath, "mutation");
			if (op) operations.push(op);
		}
	}

	let filteredOperations = operations;
	if (options.filter) {
		filteredOperations = operations.filter((op) =>
			matchesFilter(op, options.filter!),
		);
	}

	if (filteredOperations.length === 0) {
		if (options.filter) {
			console.log(`\n❌ No operations found matching "${options.filter}"`);
		} else {
			console.log("\n❌ No operations found");
		}
		return;
	}

	const queries = filteredOperations.filter((op) => op.type === "query");
	const mutations = filteredOperations.filter((op) => op.type === "mutation");

	console.log("\n📋 Corsair Operations\n");

	if (queries.length > 0) {
		console.log(`═══ Queries (${queries.length}) ═══\n`);
		queries.forEach((op, i) => {
			console.log(formatOperation(op));
			if (i < queries.length - 1) console.log("");
		});
		console.log("");
	}

	if (mutations.length > 0) {
		console.log(`═══ Mutations (${mutations.length}) ═══\n`);
		mutations.forEach((op, i) => {
			console.log(formatOperation(op));
			if (i < mutations.length - 1) console.log("");
		});
		console.log("");
	}

	console.log(`📊 Total: ${filteredOperations.length} operation(s)`);
	if (options.filter) {
		console.log(`🔎 Filter: "${options.filter}"`);
	}
	console.log("");
}
