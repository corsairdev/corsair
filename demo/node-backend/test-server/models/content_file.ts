/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Content File
 */
export type content_file = {
    type: content_file.type;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
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
    target?: string;
    submodule_git_url?: string;
};
export namespace content_file {
    export enum type {
        FILE = 'file',
    }
}

