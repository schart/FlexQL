# 🧩 FlexQL

A lightweight but powerful **query language engine** that allows you to filter data **without writing complex SQL or ORM queries**.

> 🇹🇷 Turkish version → [README-TR.md](./README-TR.md)

---

## 🚀 Overview

**FlexQL** provides developers with a **readable and simple** query language.
You can create filters easily without writing SQL.

**Example query:**

```
username==heja;age>18,status==active
```

This means:

```
(username == "heja" AND age > 18) OR (status == "active")
```

> ⚠️ **Note:** Space (` `) cannot be used as a separator.

---

## ✨ Features

- 🧠 **Readable syntax** — simple and intuitive
- 🔀 **Flexible separators** — use `;`, `,`, or custom-defined characters
- 🔒 **Secure parsing** — protected against SQL injections
- ⚙️ **Adapter-based architecture** — integrates with SQL, MongoDB, Elasticsearch, or your own system
- 🧱 **Lexer → Parser → Adapter** pipeline — modular and extensible
- 🧪 **Validated syntax** and type checking
- 🧰 **Easy to extend** — add new adapters quickly

---

## ⚙️ How It Works

**Main Pipeline:**

```
+--------+       +--------+       +---------+
| Lexer  |  -->  | Parser |  -->  | Adapter |
+--------+       +--------+       +---------+
     |                |               |
   Tokens         N-ary Tree     SQL/Mongo/Elastic
```

1. **Lexer**: Breaks the query string into meaningful components (tokens).
2. **Parser**: Validates syntax and builds an **N-ary Tree (ANT)**.
3. **Adapter**: Converts this tree into the target format (SQL, MongoDB, Elasticsearch, etc).
   This process uses **parameterized queries**, ensuring injection safety.

---

## 🌳 AST Example

Query:

```
username==heja;age>18,status==active
```

Generated AST (simplified):

```json
{
  "type": "OR",
  "children": [
    {
      "type": "AND",
      "children": [
        { "field": "username", "operator": "==", "value": "heja" },
        { "field": "age", "operator": ">", "value": 18 }
      ]
    },
    { "field": "status", "operator": "==", "value": "active" }
  ]
}
```

> This AST shows that FlexQL is **not just a string parser, but a real query engine**.

---

## 🧱 Standard Output Example

Query:

```
CategoryName==Beverages ; age>10
```

With the **RawSQL** adapter, it produces a secure output:

```js
{
  type: 'raw-sql',
  payload: {
    conditions: 'WHERE CategoryName = ? AND age > ?',
    values: ['Beverages', '10']
  }
}
```

> ✅ **Safe from SQL injection.**
> Values are never concatenated directly into the SQL string.

---

## 🔤 Syntax Reference

| Element        | Description         | Examples                         |
| -------------- | ------------------- | -------------------------------- |
| **Identifier** | Column/field name   | `username`, `age`, `status`      |
| **Operator**   | Comparison operator | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **Logic**      | Combine conditions  | `;`, `,` or custom separators    |
| **Value**      | Value to match      | `"heja"`, `18`, `true`           |

---

## 🧩 Examples

Valid queries:

```
username==test ; age>10
username==test , status == false
```

With custom separators:

```js
FlexQL.parse(query1, { adapter: "raw-sql", separators: { and: "!", or: "," } });
```

```
username==heja ! age>18
username==heja ! status==active , score>=100
```

---

## 📦 Installation & Usage

```bash
npm install flexql
```

```js
import { FlexQL } from "flexql";

// Default separators (; and ,)
const query = "username==heja;age>18";
const sql = FlexQL.parse(query, { adapter: "raw-sql" });

console.log(sql);
```

---

## 💡 Why FlexQL?

- ✅ **Readable** — even complex filters are easy to write
- 🧱 **Standardized** — one language across multiple data sources
- 🧠 **Smart** — understands logical precedence rules (AND > OR)
- 🔒 **Secure** — parameterized queries prevent SQL injection
- 🌍 **Portable** — adapter-based structure for any database
- 🧩 **Modular** — easily extensible and adaptable

---

## 🧑‍💻 Use Cases

- Dynamic filtering in **admin panels** or **dashboards**
- **Rule engines** or **bonus systems** requiring conditional logic
- Safely parsing **API query parameters**
- Creating a **database-agnostic query layer**

---

## 🧭 Roadmap

- [ ] MongoDB and Elasticsearch adapters
- [ ] Parenthesis (nested query) support
- [ ] Type inference for field-value pairs
- [ ] Query optimizer (merging redundant conditions)
- [ ] Web-based FlexQL Playground

---

## ⚖️ License

MIT © 2025 Heja “xeja” Arslan
