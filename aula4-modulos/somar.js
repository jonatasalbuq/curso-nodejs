export const soma = (...valores) => {
    let result = 0;
    for(let valor of valores){
        result += valor;
    }
    return result;
}