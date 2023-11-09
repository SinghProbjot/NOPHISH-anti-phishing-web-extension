export interface Validator {
    validate(url: URL): Promise<boolean>;
}
