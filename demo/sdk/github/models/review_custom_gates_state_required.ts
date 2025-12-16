/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type review_custom_gates_state_required = {
    /**
     * The name of the environment to approve or reject.
     */
    environment_name: string;
    /**
     * Whether to approve or reject deployment to the specified environments.
     */
    state: review_custom_gates_state_required.state;
    /**
     * Optional comment to include with the review.
     */
    comment?: string;
};
export namespace review_custom_gates_state_required {
    /**
     * Whether to approve or reject deployment to the specified environments.
     */
    export enum state {
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

