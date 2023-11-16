import {Evaluator} from './Evaluator';

export class EvaluatorCompound implements Evaluator {
    readonly evaluators: Evaluator[];

    constructor(evaluators: Evaluator[]) {
        this.evaluators = evaluators;
    }

    async evaluate(url: URL): Promise<number> {
        let scores: number[] = [];

        for (const evaluator of this.evaluators) {
            const score = await evaluator.evaluate(url);
            scores.push(score);
        }
        if (scores.length === 0) {
            throw new Error('Score not found. Did you forget to add evaluators?');
        }

        let ignored = 0;

        const sum = scores.reduce((prev, cur) => {
            if (cur < 0) {
                ignored++;
                return prev;
            }

            return prev + cur;
        }, 0);

        return sum / (scores.length - ignored);
    }
}
