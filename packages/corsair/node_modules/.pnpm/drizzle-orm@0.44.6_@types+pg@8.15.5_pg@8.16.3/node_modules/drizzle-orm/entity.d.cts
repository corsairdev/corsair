export declare const entityKind: unique symbol;
export declare const hasOwnEntityKind: unique symbol;
export interface DrizzleEntity {
    [entityKind]: string;
}
export type DrizzleEntityClass<T> = ((abstract new (...args: any[]) => T) | (new (...args: any[]) => T)) & DrizzleEntity;
export declare function is<T extends DrizzleEntityClass<any>>(value: any, type: T): value is InstanceType<T>;
