import { appConfig } from '@config/app.config';
import { envConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import Axios, { AxiosInstance, Method } from 'axios';

@Injectable()
export class TelegramClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = Axios.create({
            baseURL: envConfig.TG_BOT_API + envConfig.TG_BOT_TOKEN,
            timeout: appConfig.AXIOS_DEFAULT_TIMEOUT,
        });
    }

    async sendRequest<T>(url: string, method: Method, params: SendRequestParams): Promise<T> {
        const response = await this.client.request<T>({
            ...params,
            url,
            method,
        });

        return response.data;
    }
}
