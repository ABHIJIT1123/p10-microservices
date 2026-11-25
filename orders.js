import express from 'express';

const app = express();
app.use(express.json());

const orders = [];
const CATALOGUE = process.env.CATALOGUE_URL || 'http://localhost:4001';

app.post('/orders', async (req, res) => {
  const itemId = Number(req.body?.itemId);
  if (!Number.isInteger(itemId) || itemId < 1) {
    return res.status(400).json({ error: 'Invalid itemId' });
  }

  try {
    const r = await fetch(new URL('/items', CATALOGUE), { signal: AbortSignal.timeout(3000) });
    if (!r.ok) throw new Error();

    const items = await r.json();
    if (!items.some((i) => i.id === itemId)) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const order = { id: orders.length + 1, itemId };
    orders.push(order);
    res.status(201).json(order);
  } catch {
    res.status(503).json({ error: 'Catalogue temporarily unavailable' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4002;
app.listen(port, '0.0.0.0', () => console.log(`Orders on ${port}`));
