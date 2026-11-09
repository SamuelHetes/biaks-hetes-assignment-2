# Zadanie č. 2 – SQL Injection

## Spustenie

Treba mať nainštalovaný **Node.js verzie 22.13 alebo novšej**.

```bash
npm install
npm start
```

Potom stačí otvoriť <http://localhost:3000>.

## O aplikácii

Aplikácia je jednoduchý e-shop s prihlásením a vyhľadávaním produktov. Hore na stránke sa dá prepínať medzi
**nezabezpečenou** a **zabezpečenou** verziou. Pod formulármi sú tlačidlá, ktoré predvyplnia ukážkové útoky.

## Ako útok funguje

Nezabezpečená verzia vkladá text z formulára priamo do SQL dopytu:

```js
const sql = `SELECT id, username, email, role FROM users
             WHERE username = '${username}' AND password = '${password}'`;
```

Keď sa do mena zadá `admin' --`, dopyt bude vyzerať takto:

```sql
SELECT id, username, email, role FROM users WHERE username = 'admin' --' AND password = 'nieco'
```

Znak `--` znamená v SQL komentár, takže kontrola hesla sa úplne preskočí a prihlási sa admin bez hesla.

## Ukážky útokov

| Kde | Vstup | Čo sa stane v nezabezpečenej verzii |
|---|---|---|
| Prihlásenie | `admin' --` | prihlásenie ako admin bez hesla |
| Prihlásenie | `' OR 1=1 --` | prihlásenie ako admin, lebo `1=1` platí vždy |
| Vyhľadávanie | `x' UNION SELECT id, username, password, email FROM users --` | namiesto produktov sa zobrazia mená a heslá všetkých používateľov |
| Vyhľadávanie | `'` | zobrazí sa chyba z databázy |

## Ochrana

Zabezpečená verzia používa **parametrizované dopyty**. V dopyte sú namiesto hodnôt iba otázniky `?` a hodnoty sa
do databázy posielajú zvlášť:

```js
const loginStmt = db.prepare(
  'SELECT id, username, email, role FROM users WHERE username = ? AND password = ?'
);
loginStmt.get(username, password);
```

Databáza potom berie vstup iba ako obyčajný text, nie ako SQL kód. Keď sa zadá `admin' --`, hľadá sa používateľ
s presne takýmto menom, ten neexistuje, a prihlásenie zlyhá. Rovnako všetky útoky vo vyhľadávaní vrátia iba
prázdny zoznam produktov.

## Záver

SQL Injection vzniká, keď sa vstup od používateľa vkladá priamo do SQL dopytu. Ochrana je jednoduchá – používať
parametrizované dopyty.
