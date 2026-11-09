import { Router } from 'express';

const MAX_INPUT_LENGTH = 100;

export function secureRouter(db) {
  const router = Router();

  const loginStmt = db.prepare(
    'SELECT id, username, email, role FROM users WHERE username = ? AND password = ?'
  );
  const searchStmt = db.prepare(
    "SELECT id, name, description, price FROM products WHERE name LIKE ? ESCAPE '\\'"
  );

  router.post('/login', (req, res) => {
    const { username, password } = req.body ?? {};

    if (!isValidInput(username) || !isValidInput(password)) {
      return res.status(400).json({ ok: false, message: 'Neplatný vstup.' });
    }

    const params = [username, password];
    console.log('[zabezpečená]', loginStmt.sourceSQL, params);

    try {
      const user = loginStmt.get(...params);
      if (!user) {
        return res.status(401).json({ ok: false, message: 'Nesprávne meno alebo heslo.' });
      }
      return res.json({ ok: true, user });
    } catch (err) {
      console.error('[zabezpečená]', err);
      return res.status(500).json({ ok: false, message: 'Nastala chyba. Skúste to znova.' });
    }
  });

  router.get('/search', (req, res) => {
    const q = req.query.q ?? '';

    if (!isValidInput(q)) {
      return res.status(400).json({ ok: false, message: 'Neplatný vstup.' });
    }

    const params = [`%${q.replace(/[\\%_]/g, '\\$&')}%`];
    console.log('[zabezpečená]', searchStmt.sourceSQL, params);

    try {
      const rows = searchStmt.all(...params);
      return res.json({ ok: true, rows });
    } catch (err) {
      console.error('[zabezpečená]', err);
      return res.status(500).json({ ok: false, message: 'Nastala chyba. Skúste to znova.' });
    }
  });

  return router;
}

function isValidInput(value) {
  return typeof value === 'string' && value.length <= MAX_INPUT_LENGTH;
}
