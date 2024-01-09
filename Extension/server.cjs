const http = require('http');
const https = require('https');

const serverAddress = 'localhost';
const serverPort = 8000;

const server = http.createServer((request, response) => {
    const requestedUrl = request.url;

    if (requestedUrl.startsWith('/getCertificate?url=')) {
        const targetUrl = requestedUrl.substring('/getCertificate?url='.length);
        console.log(targetUrl);
        getCertificateDetails(targetUrl)
            .then(certificateDetails => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(certificateDetails, null, 2));
            })
            .catch(error => {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end(`Error fetching certificate details: ${error.message}`);
            });
    } else {
        console.log(`Request received for: ${requestedUrl}`);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello, this is my local HTTP server!');
    }
});

function getCertificateDetails(targetUrl) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(targetUrl);
        const options = {
            host: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            method: 'GET',
        };

        const request = https.request(options, res => {
            const certificate = res.socket.getPeerCertificate();
            resolve({
                subject: certificate.subject,
                issuer: certificate.issuer,
                valid_from: certificate.valid_from,
                valid_to: certificate.valid_to,
                fingerprint: certificate.fingerprint,
            });
        });

        request.on('error', error => {
            reject(error);
        });

        request.end();
    });
}

server.listen(serverPort, serverAddress, () => {
    console.log(`Server listening on http://${serverAddress}:${serverPort}`);
});
