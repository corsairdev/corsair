import { exec } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript syntax check via tsc
// ─────────────────────────────────────────────────────────────────────────────

export async function typecheck(
	code: string,
): Promise<{ valid: boolean; errors: string }> {
	console.log('[typecheck] Starting typecheck, code length:', code.length);

	// Wrap the code with corsair import so tsc type-checks against the real client types.
	// __event is declared as an ambient variable so webhook-triggered workflow code
	// can reference it without a typecheck error (it is injected at execution time).
	// Temp file is in project root (cwd), same as executor.
	const wrapped = `
import { corsair } from './src/corsair.ts';
declare const __event: unknown;

${code}
`;

	const tmpPath = join(process.cwd(), `.tmp-typecheck-${Date.now()}.ts`);
	console.log('[typecheck] Writing temp file:', tmpPath);
	writeFileSync(tmpPath, wrapped, 'utf8');

	const execStart = Date.now();
	try {
		const tscCommand =
			`npx tsc --noEmit --strict --target ES2022 --module ESNext` +
			` --moduleResolution Bundler --skipLibCheck --allowImportingTsExtensions` +
			` --esModuleInterop --resolveJsonModule` +
			` "${tmpPath}"`;
		console.log('[typecheck] Running tsc command...');
		await execAsync(tscCommand, { cwd: process.cwd() });
		const execDuration = Date.now() - execStart;
		console.log(`[typecheck] tsc completed in ${execDuration}ms, no errors`);
		return { valid: true, errors: '' };
	} catch (e: unknown) {
		const execDuration = Date.now() - execStart;
		console.log(`[typecheck] tsc failed after ${execDuration}ms`);
		const err = e as { stdout?: string; stderr?: string; message?: string };
		const output = [err.stdout, err.stderr, err.message]
			.filter(Boolean)
			.join('\n');

		console.log(err);
		console.log(output);
		// Strip the tmp path from the error so the LLM sees clean messages
		return {
			valid: false,
			errors: output.replace(
				new RegExp(tmpPath.replace(/\\/g, '\\\\'), 'g'),
				'check.ts',
			),
		};
	} finally {
		try {
			console.log('[typecheck] Cleaning up temp file');
			unlinkSync(tmpPath);
		} catch (cleanupError) {
			console.log('[typecheck] Failed to cleanup temp file:', cleanupError);
		}
	}
}
