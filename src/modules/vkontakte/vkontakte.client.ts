import { appConfig } from '@config/app.config';
import { envConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import Axios, { AxiosInstance, Method } from 'axios';

import { SendRequestParams } from '../telegram/telegram.client';

@Injectable()
export class VkontakteClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = Axios.create({
            baseURL: envConfig.VK_API,
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
