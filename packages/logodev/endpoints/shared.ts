import { AuthMissingError } from 'corsair/core';
import type { LogoDevContext } from '../context';

export function requireKey(ctx: LogoDevContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('logodev', 'api_key');
	}
	return ctx.key;
}
