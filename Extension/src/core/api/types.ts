export declare namespace SafeBrowsing {
    interface RequestBody {
        client: Client;
        threatInfo: ThreatInfo;
    }

    interface ResponseBody {
        threatType: string;
        platformType: string;
        threatEntryType: string;
        threat: Threat;
        threatEntryMetadata: ThreatEntryMetadata;
        cacheDuration: string;
    }

    interface Client {
        clientId: string;
        clientVersion: string;
    }

    interface ThreatInfo {
        threatTypes: string[];
        platformTypes: string[];
        threatEntryTypes: string[];
        threatEntries: Threat[];
    }

    interface Threat {
        url: string;
    }

    interface ThreatEntryMetadata {
        entries: Entry[];
    }

    interface Entry {
        key: string;
        value: string;
    }
}

export declare namespace PhishTank {
    export type DbResponseBody = {
        phish_id: number;
        url: string;
        phish_detail_url: string;
        submission_time: string;
        verified: string;
        verification_time: string;
        online: string;
        details: Detail[];
        target: string;
    };

    export type Detail = {
        ip_address: string;
        cidr_block: string;
        announcing_network: string;
        rir: string;
        country: string;
        detail_time: string;
    };
}

export declare namespace IPQuality {
    type ResponseBody = {
        message: string;
        success: boolean;
        unsafe: boolean;
        domain: string;
        ip_address: string;
        country_code: string;
        language_code: string;
        server: string;
        content_type: string;
        status_code: number;
        page_size: number;
        domain_rank: number;
        dns_valid: boolean;
        parking: boolean;
        spamming: boolean;
        malware: boolean;
        phishing: boolean;
        suspicious: boolean;
        adult: boolean;
        risk_score: number;
        domain_age: {
            human: string;
            timestamp: number;
            iso: string;
        };
        category: string;
        redirected: boolean;
        request_id: string;
    };
}
