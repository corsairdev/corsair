import type { CorsairManualConfig } from '../plugins';

/** Manual config with the connect URLs required to mint OAuth connect links. */
export type ManualConnectConfig = CorsairManualConfig & {
	baseUrl: string;
	redirectUri: string;
};

export function hasManualConnectConfig(
	manual: CorsairManualConfig | undefined,
): manual is ManualConnectConfig {
	return Boolean(manual?.baseUrl?.trim() && manual?.redirectUri?.trim());
}
