export const multi = (...valores) => {
    let result = 1;
    for(let valor of valores){
        result *= valor;
    }
    return result;
}