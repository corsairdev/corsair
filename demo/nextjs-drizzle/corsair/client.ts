import { createCorsairClient, createCorsairHooks } from "corsair";
import type { CorsairRouter } from ".";

const getBaseUrl = () => {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return `http://localhost:${process.env.PORT || 3000}`;
};

const { typedClient } = createCorsairClient<CorsairRouter>({
	url: `${getBaseUrl()}${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}`,
});

const {
	useCorsairQuery,
	useCorsairMutation,
	corsairQuery,
	corsairMutation,
	types,
} = createCorsairHooks<CorsairRouter>(typedClient);

export { useCorsairQuery, useCorsairMutation, corsairQuery, corsairMutation };

export type QueryInputs = typeof types.QueryInputs;
export type QueryOutputs = typeof types.QueryOutputs;
export type MutationInputs = typeof types.MutationInputs;
export type MutationOutputs = typeof types.MutationOutputs;
