export function pause(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), time)
    })
}