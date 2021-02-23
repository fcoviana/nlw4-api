import express from 'express';

const app = express();

app.get('/api/test', (request, response) => {
    return response.send('Hello');
});

app.listen(3585, () => console.log('Server running!'))