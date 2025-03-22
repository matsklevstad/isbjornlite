export const arraysEqual = (a: [number, number, number], b: [number, number, number]) => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
};