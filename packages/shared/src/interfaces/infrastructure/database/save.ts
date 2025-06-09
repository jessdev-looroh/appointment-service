export interface Save {
    save(data: Record<string, any>, conditionExpression?: string): Promise<boolean>;
}
