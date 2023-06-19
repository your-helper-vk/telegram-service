import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';

@Injectable()
export class TelegramClient {
    private readonly client: AxiosInstance;

    constructor() { }

    async sendRequest<T>(params: SendRequestParams): Promise<T> {
        const response = await this.client.get(e);
    }
}
