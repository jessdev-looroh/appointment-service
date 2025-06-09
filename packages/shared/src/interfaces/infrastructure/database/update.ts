export interface Update {
    update(fields: Record<string, string>, keys: Record<string, string>): Promise<boolean>;
}
