import { Ref, InjectionKey } from "vue";

interface Users {
    [key: number]: string,
}

// users依赖注入键
export const usersKey: InjectionKey<Ref<Users>> = Symbol("users");

interface Transactions {
    [key: number]: {
        time: number,
        variation: number,
        reason: string,
    }
}

interface IBTransactions {
    [key: number]: Transactions,
}

interface ClassTotalScore {
    [key: number]: number,
}

interface UserId2TotalScore {
    [key: number]: number,
}

interface BallInformation {
    user_id: number,
    name: string,
    total_score: string,
}

export { Transactions, Users, IBTransactions, ClassTotalScore, UserId2TotalScore, BallInformation };
