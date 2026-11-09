import { Router } from 'express';

export function vulnerableRouter(db) {
  const router = Router();

  router.post('/login', (req, res) => {
    const username = String(req.body?.username ?? '');
    const password = String(req.body?.password ?? '');

    const sql = `SELECT id, username, email, role FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log('[nezabezpečená]', sql);

    try {
      const user = db.prepare(sql).get();
      if (!user) {
        return res.status(401).json({ ok: false, message: 'Nesprávne meno alebo heslo.' });
      }
      return res.json({ ok: true, user });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  router.get('/search', (req, res) => {
    const q = String(req.query.q ?? '');

    const sql = `SELECT id, name, description, price FROM products WHERE name LIKE '%${q}%'`;
    console.log('[nezabezpečená]', sql);

    try {
      const rows = db.prepare(sql).all();
      return res.json({ ok: true, rows });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  return router;
}
