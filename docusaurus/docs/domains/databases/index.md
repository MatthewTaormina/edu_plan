# 🗄️ Databases Domain

> Understand how to store, query, and manage data — choosing the right tool for the job.

---

## Storage Models — The Conceptual Layer

Before choosing a database type, understand **how** it stores data. This affects performance
characteristics more than almost any other factor.

| Storage Model | How data is laid out | Optimised for | Examples |
|---------------|---------------------|--------------|---------|
| **Row-oriented** | Each row stored together on disk | OLTP — frequent reads/writes of individual records | PostgreSQL 🟢, MySQL 🟢, SQLite 🟢 |
| **Columnar** | Each column stored together on disk | OLAP — aggregate queries across millions of rows | DuckDB 🟢, ClickHouse 🟢, Amazon Redshift 🟢, BigQuery 🟢, Parquet 🟢 |
| **Document** | Each record stored as a self-describing JSON/BSON blob | Flexible schemas, nested data, variable structure | MongoDB 🟢, Firestore 🟢 |

```
Row-oriented (OLTP):
  Row 1: [id=1, name="Alice", age=30, city="London"]
  Row 2: [id=2, name="Bob",   age=25, city="Paris" ]
  → Fast to fetch one complete row: SELECT * FROM users WHERE id = 1

Columnar (OLAP):
  id column:   [1, 2, 3, ...]
  name column: ["Alice", "Bob", "Carol", ...]
  age column:  [30, 25, 28, ...]
  → Fast to aggregate across all rows: SELECT AVG(age) FROM users   ← reads only the age column

Document:
  { "_id": "abc", "name": "Alice", "address": { "city": "London", "postcode": "EC1A" } }
  → Each document is independent; schema can vary per record
```

:::tip A practical rule
- Building an app that reads/writes individual user records? → **Row-oriented** (PostgreSQL)
- Running analytics queries over millions of events? → **Columnar** (DuckDB for local, BigQuery/Redshift for cloud)
- Data has a changing or nested structure? → **Document** (MongoDB)
:::
These models are covered in depth in the [Schema Design](design.md) unit.

---

## Database Types

Databases are not one-size-fits-all. Each type is optimised for a different problem.
This domain teaches each type separately so you understand the trade-offs before you choose.

| Unit | Type | When to use | Primary tools |
|------|------|-------------|--------------|
| [Relational](relational.md) | Relational / SQL | Structured data with relationships, ACID guarantees | PostgreSQL 🟢, SQLite 🟢 |
| [Document](document.md) | Document / JSON | Flexible schemas, nested data, horizontal scale | MongoDB 🟢, Firestore 🟢 |
| [In-Memory](in_memory.md) | Cache / Key-Value | Sub-millisecond reads, session storage, queues | Redis 🟢 |
| [Graph](graph.md) | Graph | Highly connected data — social networks, recommendations, knowledge graphs | Neo4j 🟢 |
| [Search](search.md) | Full-Text Search | Keyword search, relevance ranking, log aggregation | Elasticsearch 🟢 / OpenSearch 🟢 |
| [Time-Series](time_series.md) | Time-Series | Metrics, IoT sensor data, financial tick data | TimescaleDB 🟢, InfluxDB 🟢 |
| [Schema Design](design.md) | Cross-type | Normalisation, ERDs, choosing the right DB type | All |
| [Migrations](migrations.md) | Cross-type | Schema evolution, zero-downtime migrations | Alembic 🟢, Flyway 🟢 |

---

## Choosing the Right Database

```
Is your data highly structured with known relationships?
  YES → Relational (PostgreSQL)

Is your data flexible/nested and schema may evolve?
  YES → Document (MongoDB)

Do you need sub-millisecond reads or a shared cache?
  YES → In-Memory (Redis)

Are relationships between items as important as the items themselves?
  YES → Graph (Neo4j)

Do you need keyword search or relevance ranking?
  YES → Search (Elasticsearch)

Is your data time-stamped measurements?
  YES → Time-Series (TimescaleDB)

Not sure? → Start with PostgreSQL. It can handle more use cases than you think,
            including JSON documents, full-text search, and time-series with extensions.
```

> **Tool note — Memcached:** Introduced 2003 · Still maintained · Status: 🟡 Legacy — Redis covers
> all Memcached use cases plus persistence, pub/sub, and data structures. Use Redis for new projects.

---

## Units Status

All units are planned for a future sprint. Check back soon.

---

## Quick Links (while units are being built)

- 📖 **[PostgreSQL Docs (FREE)](https://www.postgresql.org/docs/)** — Best SQL reference available
- 📖 **[MongoDB Docs (FREE)](https://www.mongodb.com/docs/)** — Official document DB guide
- 📖 **[Redis Docs (FREE)](https://redis.io/docs/)** — Commands, data types, patterns
- 📖 **[Use The Index, Luke (FREE)](https://use-the-index-luke.com/)** — Best practical SQL indexing guide
