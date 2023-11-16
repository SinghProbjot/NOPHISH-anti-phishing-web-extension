export interface Evaluator {
    evaluate(url: URL): Promise<number>;
}
