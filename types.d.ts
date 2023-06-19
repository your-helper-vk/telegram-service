type SendRequestParams = {
    method: BillingMethod;
    params?: Record<string, string>;
    host: string;
}

enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
}
