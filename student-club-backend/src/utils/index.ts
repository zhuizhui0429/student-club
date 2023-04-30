export function formatDate(date: Date) {
    const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate()
    return `${year}-${(month < 10 ? '0' : '') + month}-${(day < 10 ? '0' : '') + day}`
}

export const acceptMimeTypes = ['image'];

export function getRandomFileName(fileName: string) {
    const dotIndex = fileName.lastIndexOf('.');
    const name = fileName.slice(0, dotIndex);
    const ext = fileName.slice(dotIndex + 1);
    return `${name}-${Math.random().toString(32).slice(-6)}.${ext}`;
}