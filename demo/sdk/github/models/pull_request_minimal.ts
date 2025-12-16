/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type pull_request_minimal = {
    id: number;
    number: number;
    url: string;
    head: {
        ref: string;
        sha: string;
        repo: {
            id: number;
            url: string;
            name: string;
        };
    };
    base: {
        ref: string;
        sha: string;
        repo: {
            id: number;
            url: string;
            name: string;
        };
    };
};

