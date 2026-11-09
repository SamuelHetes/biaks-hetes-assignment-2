import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDatabase } from './db.js';
import { vulnerableRouter } from './routes/vulnerable.js';
import { secureRouter } from './routes/secure.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

const db = createDatabase();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/vulnerable', vulnerableRouter(db));
app.use('/api/secure', secureRouter(db));

app.listen(PORT, () => {
  console.log(`Server beží na http://localhost:${PORT}`);
});
