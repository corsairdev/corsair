import type { AlchemyNetwork } from '../client';
import { assertAlchemyNetwork } from '../client';

/** Resolve per-call network, falling back to plugin option then eth-mainnet. */
export function resolveNetwork(
	ctx: { options: { network?: string } },
	network?: string,
): AlchemyNetwork {
	return assertAlchemyNetwork(network || ctx.options.network || 'eth-mainnet');
}

/** Drop undefined values so Alchemy query strings stay clean. */
export function compactQuery(
	query: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}
