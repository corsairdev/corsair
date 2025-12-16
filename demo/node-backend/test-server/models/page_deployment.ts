/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The GitHub Pages deployment status.
 */
export type page_deployment = {
    /**
     * The ID of the GitHub Pages deployment. This is the Git SHA of the deployed commit.
     */
    id: (number | string);
    /**
     * The URI to monitor GitHub Pages deployment status.
     */
    status_url: string;
    /**
     * The URI to the deployed GitHub Pages.
     */
    page_url: string;
    /**
     * The URI to the deployed GitHub Pages preview.
     */
    preview_url?: string;
};

