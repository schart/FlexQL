# 🧩 FlexQL

A lightweight but powerful **query language engine** that allows you to filter data **without writing complex SQL or ORM queries**.

---

## 🚀 Overview

**FlexQL** provides developers with a **readable and simple** query language that works across databases and ORMs.

**Example query:**

```
username==heja;age>18,status==active
```

This means:

```
(username == "heja" AND age > 18) OR (status == "active")
```

> ⚠️ **Note:** Spaces (` `) cannot be used as separators.

---

## ✨ Features

- 🧠 **Readable syntax** — simple and intuitive
- 🔀 **Flexible separators** — `;` for AND, `,` for OR (or custom-defined)
- 🔒 **Secure parsing** — protected against SQL injections
- ⚙️ **Adapter-based architecture** — supports SQL, Sequelize, MongoDB, and more
- 🧱 **Lexer → Parser → Adapter** pipeline — modular and extensible
- 🧪 **Validated syntax** and type checking
- 🧰 **Easy to extend** — build new adapters quickly

---

## ⚙️ How It Works

**Main Pipeline:**

```
+--------+       +--------+       +------------+
| Lexer  |  -->  | Parser |  -->  | Adapter(s) |
+--------+       +--------+       +------------+
     |                |               |
   Tokens         N-ary Tree     SQL / Sequelize / Mongo
```

1. **Lexer** — breaks the query string into tokens
2. **Parser** — validates syntax and builds an **N-ary Abstract Syntax Tree (AST)**
3. **Adapter** — converts this AST into the target output, such as:
   - **Raw SQL**
   - **Sequelize conditions**
   - (coming soon) **MongoDB**, **Elasticsearch**, etc.

---

## 🌳 AST Example

**Query:**

```
username==heja;age>18,status==active
```

**Generated AST (simplified):**

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

> 🧩 This shows FlexQL is not just a parser, but a real query engine.

---

## 🧱 Adapter Outputs

### 🔹 SQL Adapter

**Query:**

```
CategoryName==Beverages ; age>10
```

**Output:**

```js
{
  type: 'sql',
  payload: {
    conditions: 'WHERE CategoryName = ? AND age > ?',
    values: ['Beverages', '10']
  }
}
```

✅ **Safe from SQL injection** — all values are parameterized.

---

### 🔹 Sequelize Adapter

**Query:**

```
username=="heja",country=="NL";score>90,rank>=5,level=="pro";created_at>="2025-01-01";updated_at<="2025-10-01",last_login>="2025-09-01";active==true,verified==true
```

**Output:**

```js
{
  type: 'sequelize',
  payload: {
    conditions: {
      where: [
        { created_at: { [Symbol(gte)]: '2025-01-01' } },
        { [Symbol(or)]: [ [Object], [Object] ] },
        { [Symbol(or)]: [ [Object], [Object], [Object] ] },
        { [Symbol(or)]: [ [Object], [Object] ] },
        { [Symbol(or)]: [ [Object], [Object] ] }
      ]
    }
  }
}
```

This produces a **fully Sequelize-compatible structure**, suitable for:

```js
Model.findAll({ where: conditions.where });
```

> ⚙️ The adapter automatically groups **AND (`;`)** and **OR (`,`)** conditions.

---

## 🔤 Syntax Reference

| Element        | Description         | Examples                               |
| -------------- | ------------------- | -------------------------------------- |
| **Identifier** | Column/field name   | `username`, `age`, `status`            |
| **Operator**   | Comparison operator | `==`, `!=`, `>`, `<`, `>=`, `<=`       |
| **Logic**      | Combine conditions  | `;` (AND), `,` (OR), 'custom' (AND/OR) |
| **Value**      | Value to match      | `"heja"`, `18`, `true`                 |

---

## 🧩 Examples

```
username==test ; age>10
username==test , status==false
```

**Complex query:**

```
username=="heja",country=="NL";score>90,rank>=5;active==true,verified==true
```

---

## 📦 Installation & Usage

Coming Soon

<!--

```bash
npm install flexql
```

```js
import { FlexQL } from "flexql";

// Sequelize example
const query = 'username=="heja";age>18;country=="NL"';
const result = FlexQL.parse(query, { adapter: "sequelize" });

console.log(result.payload.conditions);
``` -->

---

## 💡 Why FlexQL?

- ✅ **Readable** — even complex filters stay human-friendly
- 🧱 **Unified syntax** — one language for SQL, Sequelize, MongoDB
- 🧠 **Smart** — understands logical precedence (AND > OR)
- 🔒 **Secure** — parameterized, safe from injection
- 🌍 **Portable** — adapter-based architecture
- 🧩 **Modular** — easily extended

---

## 🧑‍💻 Use Cases

- Dynamic filtering in **admin dashboards**
- Building **ORM-independent query engines**
- Safe query parsing in **API parameters**
- Configurable **rule-based logic systems**

---

## 🧭 Roadmap

- [x] Sequelize adapter
- [ ] MongoDB and Elasticsearch adapters
- [ ] Parenthesis (nested query) support
- [ ] Type inference for field-value pairs
- [ ] Query optimizer
- [ ] FlexQL Playground

---

## ⚖️ License

MIT © 2025 Heja “xeja” Arslan
