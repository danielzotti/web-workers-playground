addEventListener('message', function (event) {
    try {
        const startTime = performance.now();
        longTask(event.data);
        const endTime = performance.now();
        postMessage({message: `The long task took ${((endTime - startTime) / 1000).toFixed(2)}s`})
    } catch (error) {
        postMessage({type: 'error', message: error});
    }
});

function longTask(max) {
    let sum = 0;
    for (let i = 0; i < max; i++) {
        sum += i;
    }
    return sum;
}
