/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type selected_actions = {
    /**
     * Whether GitHub-owned actions are allowed. For example, this includes the actions in the `actions` organization.
     */
    github_owned_allowed?: boolean;
    /**
     * Whether actions from GitHub Marketplace verified creators are allowed. Set to `true` to allow all actions by GitHub Marketplace verified creators.
     */
    verified_allowed?: boolean;
    /**
     * Specifies a list of string-matching patterns to allow specific action(s) and reusable workflow(s). Wildcards, tags, and SHAs are allowed. For example, `monalisa/octocat@*`, `monalisa/octocat@v2`, `monalisa*`.
     *
     * > [!NOTE]
     * > The `patterns_allowed` setting only applies to public repositories.
     */
    patterns_allowed?: Array<string>;
};

