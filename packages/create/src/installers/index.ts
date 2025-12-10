import { envVariablesInstaller } from '@/installers/envVars.js';
import type { PackageManager } from '@/utils/getUserPkgManager.js';

// Turning this into a const allows the list to be iterated over for programmatically creating prompt options
// Should increase extensibility in the future
export const availablePackages = ['envVariables'] as const;
export type AvailablePackages = (typeof availablePackages)[number];

export interface InstallerOptions {
	projectDir: string;
	pkgManager: PackageManager;
	noInstall: boolean;
	projectName: string;
	scopedAppName: string;
}

export type Installer = (opts: InstallerOptions) => void;

export type PkgInstallerMap = Record<
	AvailablePackages,
	{
		inUse: boolean;
		installer: Installer;
	}
>;

export const buildPkgInstallerMap = (): PkgInstallerMap => ({
	envVariables: {
		inUse: true,
		installer: envVariablesInstaller,
	},
});
