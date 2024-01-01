export function numberWithCommas(x: number) {
    const res = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
}