---
title: 'Upsert Multiple Rows in SQLite, PostgreSQL, and MySQL'
summary: 'Upsert (insert or update) syntax that references rows being inserted for SQLite, PostgreSQL, and MySQL.'
createdAt: 2025-01-30 21:43:26 +0800
publishedAt: 2025-01-30
categories: [database, sql, sqlite, postgresql, mysql]
---

## TLDR

- SQLite and PostGreSQL: Use `EXCLUDED` to reference the would-have-been inserted row
- MySQL: Use `VALUES()` function to reference the would-have-been inserted row

## Syntax

```sql
-- sqlite
-- psql
INSERT INTO users (email, last_name, first_name)
VALUES
    ('john.doe@example.com', 'Doe', 'John'),
    ('jane.doe@example.com', 'Doe', 'Jane')
ON CONFLICT (email) DO UPDATE SET
    last_name = EXCLUDED.last_name,
    first_name = EXCLUDED.first_name;

-- mysql
INSERT INTO users (email, last_name, first_name)
VALUES
    ('john.doe@example.com', 'Doe', 'John'),
    ('jane.doe@example.com', 'Doe', 'Jane')
ON DUPLICATE KEY UPDATE
    last_name = VALUES(last_name),
    first_name = VALUES(first_name);
```

## Gotchas

### Upsert Might not Work Like How You Thought It Would

Per documents, the such ONLY works on columns with an uniqueness constraint, like `UNIQUE` or `PRIMARY KEY`. And, the upsert flow for each row is decided separately.

Should other qualifiers, like `NOT NULL`, fail to pass, the row insertion/update would still fail.

With hindsight, this was already stated in MySQL's "`DUPLICATE KEY` but not having to specify which" part.

### Unwanted Row Locks

The affected rows will be locked during the query[^1][^2], even though they might not be updated in the end. Treat them with care.

## Anecdote

SQLite follows PostgreSQL in its upsert syntax, and it is [documented](https://www.sqlite.org/lang_upsert.html).

[^1]: [PostgreSQL reference on the lock](https://www.postgresql.org/docs/17/sql-insert.html#:~:text=although%20all%20rows%20will%20be%20locked%20when%20the%20ON%20CONFLICT%20DO%20UPDATE%20action%20is%20taken.)

[^2]: [MySQL reference on the lock](https://bugs.mysql.com/bug.php?id=107656#:~:text=Whenever%20a%20duplicate%20key%20is%20encountered,%20a%20rows%20is%20not%20inserted%20but%20updated.%20Each%20row%20that%20should%20be%20updated%20must%20first%20acquire%20an%20exclusive%20lock.)

---

## Refs

- [SQLite - UPSERT](https://www.sqlite.org/lang_upsert.html)
- [PostgreSQL - INSERT](https://www.postgresql.org/docs/17/sql-insert.html)
- [MySQL - INSERT Statement](https://dev.mysql.com/doc/refman/8.4/en/insert.html)
