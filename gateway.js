import express from 'express';

const app = express();
app.use(express.json());

const CATALOGUE = process.env.CATALOGUE_URL || 'http://localhost:4001';
const ORDERS = process.env.ORDERS_URL || 'http://localhost:4002';

app.get('/catalogue/items', async (req, res) => {
  try {
    const r = await fetch(new URL('/items', CATALOGUE), { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return res.sendStatus(502);
    res.json(await r.json());
  } catch {
    res.sendStatus(502);
  }
});

app.post('/orders', async (req, res) => {
  try {
    const r = await fetch(new URL('/orders', ORDERS), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(3000),
    });
    res.status(r.status).json(await r.json());
  } catch {
    res.sendStatus(502);
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, '0.0.0.0', () => console.log(`Gateway on ${port}`));
