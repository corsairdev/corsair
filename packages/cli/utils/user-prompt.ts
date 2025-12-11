import * as readline from 'readline';
import type { SimilarityCheckResponse } from '../llm/check-similarity.js';

export type UserAction =
	| { type: 'override'; targetOperation: string; targetFileName: string }
	| { type: 'update'; targetOperation: string; targetFileName: string }
	| { type: 'create-new' };

export function displaySimilarOperations(
	similarityResult: SimilarityCheckResponse,
	operationType: 'query' | 'mutation',
): void {
	console.log(`\n🔍 Found similar ${operationType}s:\n`);

	similarityResult.similarOperations.forEach((op, index) => {
		console.log(`${index + 1}. ${op.name} (${op.fileName}.ts)`);
		console.log(`   Reason: ${op.reason}\n`);
	});

	console.log('What would you like to do?');
	similarityResult.similarOperations.forEach((op, index) => {
		console.log(`${index + 1}. Override operation #${index + 1} (${op.name})`);
	});

	const baseOption = similarityResult.similarOperations.length + 1;
	similarityResult.similarOperations.forEach((op, index) => {
		console.log(
			`${baseOption + index}. Update operation #${index + 1} (${op.name})`,
		);
	});

	const createNewOption =
		similarityResult.similarOperations.length * 2 + 1;
	console.log(`${createNewOption}. Create new operation anyway\n`);
}

export async function promptUserChoice(
	similarityResult: SimilarityCheckResponse,
): Promise<UserAction> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const numOperations = similarityResult.similarOperations.length;
	const maxChoice = numOperations * 2 + 1;

	return new Promise((resolve) => {
		rl.question(
			`Enter your choice (1-${maxChoice}): `,
			(answer: string) => {
				rl.close();

				const choice = parseInt(answer.trim(), 10);

				if (isNaN(choice) || choice < 1 || choice > maxChoice) {
					console.log('\n❌ Invalid choice. Creating new operation.\n');
					resolve({ type: 'create-new' });
					return;
				}

			if (choice <= numOperations) {
				const targetOp =
					similarityResult.similarOperations[choice - 1];
				if (!targetOp) {
					console.log('\n❌ Invalid selection. Creating new operation.\n');
					resolve({ type: 'create-new' });
					return;
				}
				resolve({
					type: 'override',
					targetOperation: targetOp.name,
					targetFileName: targetOp.fileName,
				});
			} else if (choice <= numOperations * 2) {
				const targetOp =
					similarityResult.similarOperations[
						choice - numOperations - 1
					];
				if (!targetOp) {
					console.log('\n❌ Invalid selection. Creating new operation.\n');
					resolve({ type: 'create-new' });
					return;
				}
				resolve({
					type: 'update',
					targetOperation: targetOp.name,
					targetFileName: targetOp.fileName,
				});
			} else {
				resolve({ type: 'create-new' });
			}
			},
		);
	});
}

