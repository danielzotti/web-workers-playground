let worker;
let counter = 0;
const DEFAUL_MAX_VALUE = 5_000_000_000

const $btnIncrement = document.querySelector('#btn-increment');
const $btnDecrement = document.querySelector('#btn-decrement');
const $counterValue = document.querySelector('#counter-value');

const $btnStartWebWorker = document.querySelector('#btn-start-web-worker');
const $btnStopWebWorker = document.querySelector('#btn-stop-web-worker');

const $btnLongTaskWithWebWorker = document.querySelector('#btn-long-task-with-worker');
const $btnLongTaskWithoutWebWorker = document.querySelector('#btn-long-task-without-worker');

const $btnClearMessage = document.querySelector('#btn-clear-messages')

const $messages = document.querySelector('#messages');

$btnIncrement.addEventListener('click', increment);
$btnDecrement.addEventListener('click', decrement);
$btnStartWebWorker.addEventListener('click', startWorker);
$btnStopWebWorker.addEventListener('click', stopWorker);
$btnClearMessage.addEventListener('click', clearMessages);
$btnLongTaskWithWebWorker.addEventListener('click', runLongTaskWithWebWorker);
$btnLongTaskWithoutWebWorker.addEventListener('click', runLongTaskWithoutWebWorker);

function increment() {
    counter++;
    $counterValue.innerHTML = counter;
}

function decrement() {
    counter--;
    $counterValue.innerHTML = counter;
}

function printMessage(message) {
    $messages.innerHTML += `<li>${message}</li>`;
}

function clearMessages() {
    $messages.innerHTML = '';
}


function startWorker() {
    worker = initializeWorker();
}

function initializeWorker() {
    if (!window.Worker) {
        printMessage(`Your browser doesn't support Web Workers!`);
        return;
    }

    const worker = new Worker('./worker.js');

    worker.onerror = (error) => {
        printMessage(`Worker error:\n${JSON.stringify(error, null, 2)}`)
    };

    worker.onmessage = (event) =>
        printMessage(event.data.message);

    worker.onmessageerror = (event) =>
        console.warn(event.data.message);

    printMessage(`Web Worker has been started!`)

    return worker;
}

function stopWorker() {
    if (!worker) {
        printMessage(`Web Worker hasn't been started yet!`)
        return;
    }
    worker.terminate();
    worker = undefined;
    printMessage(`Web Worker has been stopped!`)
}

function runLongTaskWithWebWorker(e) {
    if (!worker) {
        printMessage(`Web Worker hasn't been started yet! Click on "Start Web Worker"`)
        return;
    }
    printMessage(`Long task started WITH web worker (UI should work as usual)`);
    worker.postMessage(DEFAUL_MAX_VALUE);
}

function runLongTaskWithoutWebWorker() {
    const startTime = performance.now();
    printMessage(`Long task started WITHOUT web worker (UI should be freezed)`);

    // NB: "setTimeout" is used just to make the UI display the message before it freezes.
    setTimeout(() => {
        let sum = 0;
        for (let i = 0; i < DEFAUL_MAX_VALUE; i++) {
            sum += i;
        }
        const endTime = performance.now();
        printMessage(`The long task took ${((endTime - startTime) / 1000).toFixed(2)}s. Now the UI should be usable again`)
    }, 100);


}

