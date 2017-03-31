export interface EnvironmentConfig {
    api: {
        endpoint: string;
    };
    aad:{        
        tenantId: string;
        clientId: string;
    }
}