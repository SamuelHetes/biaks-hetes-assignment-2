import { DatabaseSync } from 'node:sqlite';

export function createDatabase() {
  const db = new DatabaseSync(':memory:');

  db.exec(`
    CREATE TABLE users (
      id       INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email    TEXT NOT NULL,
      role     TEXT NOT NULL
    );

    CREATE TABLE products (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT NOT NULL,
      price       REAL NOT NULL
    );

    INSERT INTO users (username, password, email, role) VALUES
      ('admin',   'Adm1n!SuperSecret', 'admin@eshop.sk',   'admin'),
      ('samuel',  'samuel123',         'samuel@eshop.sk',  'zákazník'),
      ('timotej', 'timotej2024',       'timotej@eshop.sk', 'zákazník');

    INSERT INTO products (name, description, price) VALUES
      ('Notebook',   '14" ultrabook, 16 GB RAM',        999.00),
      ('Mobil',      '6,1" OLED smartfón',              699.00),
      ('Slúchadlá',  'Bezdrôtové s potlačením hluku',   199.00),
      ('Klávesnica', 'Mechanická klávesnica',           89.90),
      ('Monitor',    '27" 4K IPS displej',              349.00);
  `);

  return db;
}
