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
        primary: boolean;
    };
}

interface CheckMarkMessage extends BaseMessage {
    type: 'safeMarked';
    payload: {
        url: string;
        primary: boolean;
    };
}

interface CheckPageMessage extends BaseMessage {
    type: 'check-page';
}

export type Message = CheckUrlMessage | CheckPageMessage | CheckMarkMessage;

/**
 * Informazioni reputazionali di un url
 */
export type Reputation = {
    url: string;
    score: number;
    userSafeMarked: boolean;
};
