const express = require('express');
const app = express();

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

const { createLogger } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);


collectDefaultMetrics({ register });
// Route for "/"
app.get('/', (req, res) => {
    logger.info('request received');
    res.send('Hello World');
});

// Route for "/slow"
app.get('/slow', (req, res) => {
    // Randomly decide if the route succeeds or fails
    const shouldFail = Math.random() < 0.2; // 20% chance to fail

    if (shouldFail) {
        // Send a 500 error if the route fails
        logger.error('Slow route failed');
        return res.status(500).send({ error: 'An error occurred' });
    } else {
        // Simulate a delay for successful requests
        logger.info('Slow route succeeded');
        const delay = Math.floor(Math.random() * 900) + 10; // 10ms to 1000ms

        setTimeout(() => {
            res.send(`Heavy task completed in ${delay}ms`);
        }, delay);
    }
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
