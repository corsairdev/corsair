/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * A comment made to a gist.
 */
export type gist_comment = {
    id: number;
    node_id: string;
    url: string;
    /**
     * The comment text.
     */
    body: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    author_association: author_association;
};

