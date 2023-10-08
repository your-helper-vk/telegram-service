import { cleanEnv, num, str } from 'envalid';

export const envConfig = cleanEnv(process.env, {

    /* Vkontakte env */
    VK_API: str({ default: 'https://api.vk.com/method/' }),
    VK_CLIENT_ID: num({ default: 51612368 }),
    VK_VERSION: str({ default: '5.131' }),
    VK_ACCESS_TOKEN: str({
        default:
            'vk1.a.ZBl5-SznpFxtseOMdwmJfFgZ9Lx5q-Gvgv6qRmWBB-zzAMwV_pdJt3UO-q1SQdK12ytWqj-eQUAVo96hg83FEbH_BfFBqK4VOCRHVCAvr-aTI0W1FLU_Prd9ZM8x5t2Kt9Hp7ZmVgLCFBHnerK8tXecCZ4DyFOj-2oM1icv36t4JPzYjru7maOHx8xifisOGf78TdGtZX3Bz2hWVnsfi7g',
    }),
});
