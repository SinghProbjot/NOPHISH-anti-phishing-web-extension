export interface Evaluator {
    evaluate(data: EvaluatorInput): Promise<number>;
}

export type EvaluatorInput = {url: URL; isPrimary: boolean};
