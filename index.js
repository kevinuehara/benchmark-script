/*
    Financial Assistant BenchMark
    Example Usage POST: node benchmark.js http://ciandt.mocklab.io/test 2 POST '{"foo": "bar"}'
    Example Usage GET: node benchmark.js http://ciandt.mocklab.io/thing 5 // Default: GET
*/

console.log("This script is for benchmarge usage!");
const message = `To run: node benchmark.js <endpoint> <times_to_run> <request_type> <body?> <protocol>
<endpoint>: REQUIRED. Example: http:localhost:8080 
<times_to_run>: NOT REQUIRED. Times to run the benchmark. Default: 1 
<request_type>: NOT REQUIRED. Request type (POST|GET|PUT|DELETE)
<body>: not REQUIRED, only if the request type is POST | PUT. Example: '{"foo": "bar"}' \n`;

console.log("Example Usage");

const REGEX_PATTERN_HTTP = '^(https|http)';
let protocol = '';

const args = process.argv;
if (args.length < 3 || args.length > 7) {
    throw new Error(`Invalid Parameters. \n ${message}`);
}

const argsToRunUsage = args.slice(2);
const protocolArg = argsToRunUsage[0].match(REGEX_PATTERN_HTTP);

if (protocolArg.length && protocolArg[0].toUpperCase() === 'HTTP') {
    protocol = require('http');
} else if (protocolArg.length && protocolArg[0].toUpperCase() === 'HTTPS') {
    protocol = require('https');
} else {
    throw Error("Invalid Protocol");
}

const endpoint = argsToRunUsage[0];
const timesToRun = argsToRunUsage.length > 1 ? argsToRunUsage[1] : 1;
const typeRequest = argsToRunUsage.length > 2 ? argsToRunUsage[2].toUpperCase() : 'GET';
if (argsToRunUsage.length > 2 && (typeRequest !== 'GET' && typeRequest !== 'POST' && typeRequest !== 'DELETE' && typeRequest !== 'PUT')) {
    throw new Error('Invalid Request Type.')
}

const options = {
    method: typeRequest,
    headers: {
      'Content-Type': 'application/json',
    }
  }

let bodyJson ='';
if (argsToRunUsage.length > 3) {
    bodyJson = argsToRunUsage[3];
}

let request;
for (let i = 0; i < timesToRun; i++) {
    request = protocol.request(endpoint, options, res => {
        res.on('data', body => console.log(`BODY: ${body} \n`));
    });

    request.write(bodyJson);
    request.end();
}