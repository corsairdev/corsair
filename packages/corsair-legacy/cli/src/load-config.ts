import { toFileUrl } from './paths';

/**
 * Loads a TS/ESM config file via dynamic import.
 * Intended to be run with `tsx`.
 */
export async function loadCorsairConfig(filePath: string) {
	const mod = await import(toFileUrl(filePath));
	return (mod.default ?? mod.config ?? mod) as unknown;
}
