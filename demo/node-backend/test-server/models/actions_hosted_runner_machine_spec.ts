/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Provides details of a particular machine spec.
 */
export type actions_hosted_runner_machine_spec = {
    /**
     * The ID used for the `size` parameter when creating a new runner.
     */
    id: string;
    /**
     * The number of cores.
     */
    cpu_cores: number;
    /**
     * The available RAM for the machine spec.
     */
    memory_gb: number;
    /**
     * The available SSD storage for the machine spec.
     */
    storage_gb: number;
};

