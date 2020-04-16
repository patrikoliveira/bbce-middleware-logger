export interface Log {
    timestamp: number;
    userId: number;
    httpMethod: string;
    httpUrl: string;
    requestBody: string;
    statusCode: number;
    requestId: string;
}
