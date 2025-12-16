/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * A collection of related issues and pull requests.
 */
export type milestone = {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    /**
     * The number of the milestone.
     */
    number: number;
    /**
     * The state of the milestone.
     */
    state: milestone.state;
    /**
     * The title of the milestone.
     */
    title: string;
    description: string | null;
    creator: nullable_simple_user;
    open_issues: number;
    closed_issues: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    due_on: string | null;
};
export namespace milestone {
    /**
     * The state of the milestone.
     */
    export enum state {
        OPEN = 'open',
        CLOSED = 'closed',
    }
}

