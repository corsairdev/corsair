import { entityKind } from "../entity.js";
export interface GelRoleConfig {
    createDb?: boolean;
    createRole?: boolean;
    inherit?: boolean;
}
export declare class GelRole implements GelRoleConfig {
    readonly name: string;
    static readonly [entityKind]: string;
    constructor(name: string, config?: GelRoleConfig);
    existing(): this;
}
export declare function gelRole(name: string, config?: GelRoleConfig): GelRole;
