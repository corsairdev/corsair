/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type runner_groups_org = {
    id: number;
    name: string;
    visibility: string;
    default: boolean;
    /**
     * Link to the selected repositories resource for this runner group. Not present unless visibility was set to `selected`
     */
    selected_repositories_url?: string;
    runners_url: string;
    hosted_runners_url?: string;
    /**
     * The identifier of a hosted compute network configuration.
     */
    network_configuration_id?: string;
    inherited: boolean;
    inherited_allows_public_repositories?: boolean;
    allows_public_repositories: boolean;
    /**
     * If `true`, the `restricted_to_workflows` and `selected_workflows` fields cannot be modified.
     */
    workflow_restrictions_read_only?: boolean;
    /**
     * If `true`, the runner group will be restricted to running only the workflows specified in the `selected_workflows` array.
     */
    restricted_to_workflows?: boolean;
    /**
     * List of workflows the runner group should be allowed to run. This setting will be ignored unless `restricted_to_workflows` is set to `true`.
     */
    selected_workflows?: Array<string>;
};

