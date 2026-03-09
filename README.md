  

# 🧩 FlexQL

A lightweight yet powerful **query language engine** that lets you filter data **without writing complex SQL or ORM queries**.

<p align="center">
  <img src="docs/Flexql-architecture.png" width="650"/>
</p>

---

# 🚀 Overview

**FlexQL** provides a **simple, readable, and database-agnostic** way to write query filters.

Instead of writing complex SQL or ORM conditions, you can use a **compact query syntax** that is parsed and converted into database-specific queries.

### Example Query

```
username==heja;age>18,status==active
```

Which means:

```
(username == "heja" AND age > 18) OR (status == "active")
```

> ⚠️ **Note:** Spaces (` `) cannot be used as separators in the query string.

---

# ✨ Features

* 🧠 **Readable syntax** — intuitive and compact query format
* 🔀 **Flexible separators** — `;` for **AND**, `,` for **OR** (customizable)
* 🔒 **Secure parsing** — safe against SQL injection
* ⚙️ **Adapter-based architecture** — supports SQL, Sequelize, MongoDB and more
* 🧱 **Lexer → Parser → Adapter pipeline** — modular and extensible
* 🧪 **Validated syntax** with type checking
* 🧰 **Easy to extend** — create new adapters quickly

---

# ⚙️ How It Works

FlexQL processes queries through a **compiler-like pipeline**:

```
+--------+       +--------+       +------------+
| Lexer  |  -->  | Parser |  -->  | Adapter(s) |
+--------+       +--------+       +------------+
     |                |               |
   Tokens         N-ary AST       SQL / Sequelize / Mongo
```

### 1️⃣ Lexer

Breaks the raw query string into **tokens**.

### 2️⃣ Parser

Validates syntax and builds an **N-ary Abstract Syntax Tree (AST)**.

### 3️⃣ Adapter

Converts the AST into database-specific output such as:

* **Raw SQL**
* **Sequelize conditions**
* *(coming soon)* **MongoDB**
* *(coming soon)* **Elasticsearch**

---

# 🌳 AST Example

### Query

```
username==heja;age>18,status==active
```

### Generated AST (simplified)

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

This demonstrates that **FlexQL is not just a string parser**, but a real **query engine** that constructs a structured representation of the query.

---

# 🧱 Adapter Outputs

## 🔹 SQL Adapter

### Query

```
CategoryName==Beverages ; age>10
```

### Output

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

## 🔹 Sequelize Adapter

### Query

```
username=="heja",country=="NL";score>90,rank>=5,level=="pro";created_at>="2025-01-01";updated_at<="2025-10-01",last_login>="2025-09-01";active==true,verified==true
```

### Output

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

This produces a **fully Sequelize-compatible structure**, usable directly in:

```js
Model.findAll({ where: conditions.where });
```

The adapter automatically groups **AND (`;`)** and **OR (`,`)** conditions.

---

# 🔤 Syntax Reference

| Element        | Description         | Examples                               |
| -------------- | ------------------- | -------------------------------------- |
| **Identifier** | Column / field name | `username`, `age`, `status`            |
| **Operator**   | Comparison operator | `==`, `!=`, `>`, `<`, `>=`, `<=`       |
| **Logic**      | Combine conditions  | `;` (AND), `,` (OR), custom separators |
| **Value**      | Value to match      | `"heja"`, `18`, `true`                 |

---

# 🧩 Examples

### Basic

```
username==test ; age>10
```

```
username==test , status==false
```

### Complex Query

```
username=="heja",country=="NL";score>90,rank>=5;active==true,verified==true
```

---

# 📦 Installation & Usage

Coming Soon

<!--
```bash
npm install flexql
```

```js
import { FlexQL } from "flexql";

const query = 'username=="heja";age>18;country=="NL"';
const result = FlexQL.parse(query, { adapter: "sequelize" });

console.log(result.payload.conditions);
```
-->

---

# 💡 Why FlexQL?

* ✅ **Readable queries** even for complex filters
* 🧱 **Unified syntax** across multiple databases
* 🧠 **Logical precedence support** (AND > OR)
* 🔒 **Secure parameterized outputs**
* 🌍 **Portable architecture** via adapters
* 🧩 **Highly modular design**

---

# 🧑‍💻 Use Cases

* Dynamic filtering in **admin dashboards**
* Building **ORM-independent query engines**
* Safe filtering in **API query parameters**
* **Rule-based filtering systems**

---

# 🧭 Roadmap

* [x] Sequelize adapter
* [ ] MongoDB adapter
* [ ] Elasticsearch adapter
* [ ] Parenthesis / nested query support
* [ ] Type inference
* [ ] Query optimizer
* [ ] FlexQL Playground

---

# ⚖️ License

MIT License
© 2025 **Heja “xeja” Arslan**

---

 