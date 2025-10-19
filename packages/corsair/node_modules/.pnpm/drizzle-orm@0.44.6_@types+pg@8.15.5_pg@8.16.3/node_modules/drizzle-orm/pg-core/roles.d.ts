import { entityKind } from "../entity.js";
export interface PgRoleConfig {
    createDb?: boolean;
    createRole?: boolean;
    inherit?: boolean;
}
export declare class PgRole implements PgRoleConfig {
    readonly name: string;
    static readonly [entityKind]: string;
    constructor(name: string, config?: PgRoleConfig);
    existing(): this;
}
export declare function pgRole(name: string, config?: PgRoleConfig): PgRole;
