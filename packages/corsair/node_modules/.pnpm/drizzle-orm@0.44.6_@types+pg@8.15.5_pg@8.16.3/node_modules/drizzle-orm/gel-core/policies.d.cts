import { entityKind } from "../entity.cjs";
import type { SQL } from "../sql/sql.cjs";
import type { GelRole } from "./roles.cjs";
import type { GelTable } from "./table.cjs";
export type GelPolicyToOption = 'public' | 'current_role' | 'current_user' | 'session_user' | (string & {}) | GelPolicyToOption[] | GelRole;
export interface GelPolicyConfig {
    as?: 'permissive' | 'restrictive';
    for?: 'all' | 'select' | 'insert' | 'update' | 'delete';
    to?: GelPolicyToOption;
    using?: SQL;
    withCheck?: SQL;
}
export declare class GelPolicy implements GelPolicyConfig {
    readonly name: string;
    static readonly [entityKind]: string;
    readonly as: GelPolicyConfig['as'];
    readonly for: GelPolicyConfig['for'];
    readonly to: GelPolicyConfig['to'];
    readonly using: GelPolicyConfig['using'];
    readonly withCheck: GelPolicyConfig['withCheck'];
    constructor(name: string, config?: GelPolicyConfig);
    link(table: GelTable): this;
}
export declare function gelPolicy(name: string, config?: GelPolicyConfig): GelPolicy;
