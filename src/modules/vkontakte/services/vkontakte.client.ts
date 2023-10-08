import { AXIOS_DEFAULT_TIMEOUT } from '@common/constants';
import { getEnv } from '@common/helpers/get-env.helper';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

type VkontakteClientRequestParams = Omit<AxiosRequestConfig, 'method' | 'url'>;

@Injectable()
export class VkontakteClient {
    private readonly client: AxiosInstance;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = Axios.create({
            baseURL: getEnv(this.configService, 'VK_API'),
            timeout: AXIOS_DEFAULT_TIMEOUT,
        });
    }

    async sendRequest<T>(url: string, method: Method, params: VkontakteClientRequestParams): Promise<T> {
        const response = await this.client.request<T>({
            ...params,
            url,
            method,
        });

        return response.data;
    }
}
