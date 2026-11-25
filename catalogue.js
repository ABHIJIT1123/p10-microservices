import express from 'express';

const app = express();

app.get('/items', (req, res) => res.json([{ id: 1, name: 'Laptop', price: 50000 }]));
app.get('/health', (req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4001;
app.listen(port, '0.0.0.0', () => console.log(`Catalogue on ${port}`));
