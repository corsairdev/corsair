import type { CorsairInternalConfig } from 'corsair/core';
import { CORSAIR_INTERNAL } from 'corsair/core';
import { getCorsairInstance } from '../index';

export async function extractInternalConfig(
	cwd: string,
): Promise<CorsairInternalConfig> {
	const instance = await getCorsairInstance({ cwd, shouldThrowOnError: true });
	const internal = (instance as Record<string | symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;
	if (!internal) {
		throw new Error(
			'Could not read internal config from Corsair instance. Make sure you are using the latest version of corsair.',
		);
	}
	return internal;
}
