/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * An object describing a submodule
 */
export type content_submodule = {
    type: content_submodule.type;
    submodule_git_url: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
};
export namespace content_submodule {
    export enum type {
        SUBMODULE = 'submodule',
    }
}

