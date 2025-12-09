import { Transactions } from './interface.ts';

/**
 * Transactions to Total Score的简写
 * 快速根据积分记录计算总积分
 * @param transactions 记录
 * @returns 总积分，数字
 */
function t2ts(transactions: Transactions): number {
    return Object.values(transactions)
        .map((t) => t.variation)
        .reduce((a, b) => a + b, 0);
}

/**
 * Transactions to String Total Score的简写
 * 快速根据积分记录计算总积分并格式化为字符串
 * @param transactions 记录
 * @returns 总积分，两位小数字符
 */
function t2sts(transactions: Transactions): string {
    return t2ts(transactions).toFixed(2);
}

export { t2ts, t2sts };
