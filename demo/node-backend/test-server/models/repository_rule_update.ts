/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Only allow users with bypass permission to update matching refs.
 */
export type repository_rule_update = {
    type: repository_rule_update.type;
    parameters?: {
        /**
         * Branch can pull changes from its upstream repository
         */
        update_allows_fetch_and_merge: boolean;
    };
};
export namespace repository_rule_update {
    export enum type {
        UPDATE = 'update',
    }
}

