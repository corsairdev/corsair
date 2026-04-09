/**
 * This file defines the input and output types for all Stitch API endpoints.
 * These types provide compile-time safety for developers using the Stitch plugin.
 *
 * Note on Type Safety:
 * Some fields use `any` or `any[]` where the API returns highly dynamic design data or
 * component structures that are not yet fully documented or are subject to frequent changes.
 */

import type { StitchProject, StitchScreen, StitchDesignSystem } from '../schema';

export type StitchEndpointInputs = {
  projectsList: { filter?: string };
  projectsGet: { id: string };
  projectsCreate: { title?: string };
  projectsGenerateScreen: {
    projectId: string;
    prompt: string;
    deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET' | 'AGNOSTIC';
    modelId?: string;
  };
  screensList: { projectId: string };
  screensGet: { projectId: string; screenId: string };
  screensEdit: {
    projectId: string;
    selectedScreenIds: string[];
    prompt: string;
    deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET' | 'AGNOSTIC';
    modelId?: string;
  };
  screensGenerateVariants: {
    projectId: string;
    selectedScreenIds: string[];
    prompt: string;
    variantOptions: {
      numVariants?: number;
      creativeRange?: number;
      aspects?: string[];
    };
  };
  designSystemsCreate: {
    projectId?: string;
    designSystem: Record<string, any>;
  };
  designSystemsUpdate: {
    assetId: string;
    projectId: string;
    designSystem: Record<string, any>;
  };
  designSystemsApply: {
    assetId: string;
    projectId: string;
    selectedScreenInstances: any[];
  };
};

export type StitchEndpointOutputs = {
  projectsList: StitchProject[];
  projectsGet: StitchProject;
  projectsCreate: StitchProject;
  projectsGenerateScreen: { screen: StitchScreen; output_components?: any };
  screensList: StitchScreen[];
  screensGet: StitchScreen;
  screensEdit: { screens: StitchScreen[] };
  screensGenerateVariants: { variants: StitchScreen[] };
  designSystemsCreate: StitchDesignSystem;
  designSystemsUpdate: StitchDesignSystem;
  designSystemsApply: { success: boolean };
};
