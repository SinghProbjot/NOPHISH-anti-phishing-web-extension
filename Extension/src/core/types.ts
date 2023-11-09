/**
 * Messaggio generico
 */
interface BaseMessage {
    type: unknown;
    payload?: unknown;
}
interface CheckUrlMessage extends BaseMessage {
    type: 'check-url';
    payload: {
        url: string;
    };
}

interface CheckPageMessage extends BaseMessage {
    type: 'check-page';
}

export type Message = CheckUrlMessage | CheckPageMessage;

/**
 * Informazioni reputazionali di un host
 */
export type Reputation = {
    host: string;
    score: number;
    userSafeMarked: boolean;
};