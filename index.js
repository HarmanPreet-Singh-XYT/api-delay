const express = require('express');
const app = express();

// Route for "/"
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Route for "/slow"
app.get('/slow', (req, res) => {
    // Randomly decide if the route succeeds or fails
    const shouldFail = Math.random() < 0.2; // 20% chance to fail

    if (shouldFail) {
        // Send a 500 error if the route fails
        return res.status(500).send({ error: 'An error occurred' });
    } else {
        // Simulate a delay for successful requests
        const delay = Math.floor(Math.random() * 900) + 10; // 10ms to 1000ms

        setTimeout(() => {
            res.send(`Heavy task completed in ${delay}ms`);
        }, delay);
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
