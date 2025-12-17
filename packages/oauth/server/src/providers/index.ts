import { discord } from './discord';
import { github } from './github';
import { google } from './google';
import { slack } from './slack';
import { spotify } from './spotify';
import type { OAuthService } from './types';

export { OAuthService };

export const OAUTH_SERVICES: Record<string, OAuthService> = {
	spotify,
	slack,
	github,
	google,
	discord,
};

export const getServiceNames = (): string[] => {
	return Object.keys(OAUTH_SERVICES);
};

export const getService = (serviceName: string): OAuthService | undefined => {
	return OAUTH_SERVICES[serviceName];
};
