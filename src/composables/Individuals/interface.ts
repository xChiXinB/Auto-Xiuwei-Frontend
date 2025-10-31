interface Transactions {
    [key: number]: {
        time: number,
        variation: number,
        reason: string,
    }
}

export { Transactions };
