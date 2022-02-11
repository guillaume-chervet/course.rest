let args = process.argv.slice(2);

console.log(`fibonacci call with ${args}`);

function fibonacci(n) {
    if (n < 2) {
        return 1;
    } else {
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
}
/*
let result = fibonacci(args);
console.log(`result is ${result}`);
*/

process.on('uncaughtException', err => {
    console.log(`Caught exception: ${err}`);
});

const http = require('http');
http
    .createServer(function(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        console.log('funciton called');
        const result = fibonacci(62);
        console.log(result);
        res.end();
    })
    .listen(1337, '127.0.0.1');
