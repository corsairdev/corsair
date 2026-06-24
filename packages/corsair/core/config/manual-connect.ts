import type { CorsairManualConfig, OAuthConfig } from '../plugins';

/** `createCorsair({ manual })` plus runtime fields injected when binding endpoints. */
export type EndpointManualConfig = CorsairManualConfig & {
	oauthConfig?: OAuthConfig;
	kek?: string;
	tenantId?: string;
};

/** Manual config with the connect URLs required to mint OAuth connect links. */
export type ManualConnectConfig = EndpointManualConfig & {
	baseUrl: string;
	redirectUri: string;
};

export function hasManualConnectConfig(
	manual: EndpointManualConfig | undefined,
): manual is ManualConnectConfig {
	return Boolean(manual?.baseUrl?.trim() && manual?.redirectUri?.trim());
}
