# FlexQL

Welcome to the FlexQL project!

For the Turkish version, see [README-TR.md](./README-TR.md).

## Overview

**FlexQL** is a simple and powerful query language for data filtering without the need for complex SQL or ORM queries.

**Example query:**

```
username==heja;age>18 status==active
```

> ⚠️ **Note:** Space (` `) cannot be used as a separator.

---

## Features

- **Human-readable syntax** with intuitive operators
- **Flexible separators** — `;`, `,`, or custom-defined delimiters can be used
- **Secure parsing** via lexer/parser architecture
- **Prevented SQL injections** — uses parameterized queries instead of raw string concatenation
- **Adaptable** — can be integrated into any database through the adapter system
- **Validated** syntax and type checking

---

## How It Works

**Pipeline:** Lexer → Parser → Adapter

1. **Lexer** splits query strings into meaningful components
2. **Parser** validates the syntax and builds an N-arry Tree (ANT)
3. **Adapter** converts the AST into the target format (SQL, MongoDB, Elasticsearch, etc) safely using **parameterized queries**

---

## Standardized Output Example

For a raw SQL query, FlexQL produces a standardized, injection-safe payload:

```javascript
{
  type: 'raw-sql',
  payload: {
    conditions: 'WHERE CategoryName = ? AND age > ?',
    values: [ 'Beverages', '10' ]
  }
}
```

> ⚠️ User inputs are never directly concatenated into SQL. Values are safely parameterized to prevent SQL injection.

---

## Syntax

| Element         | Purpose            | Examples                         |
| --------------- | ------------------ | -------------------------------- |
| **Identifiers** | Column names       | `username`, `age`, `status`      |
| **Operators**   | Comparisons        | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **Logic**       | Combine conditions | `;`, `,`, or custom-defined      |
| **Values**      | Data to be matched | `"heja"`, `18`, `true`           |

---

## Examples

All of the following queries are valid:

```
username==heja
age>18;status==active
country!=us,score>=100
username==heja;status==active
username==heja, status==active;score>=100
```

With custom separators:

```
username==heja!age>18
username==heja! status==active,score>=100
```

---

## Installation & Usage

```bash
npm install flexql
```

```javascript
import { FlexQL } from "flexql";

// Using default separators (; or ,)
const query1 = "username==heja;age>18";
const ast1 = FlexQL.parse(query1, { adapter: "raw-sql" });

// Using custom separators
const query2 = "username==heja!age>18";
const ast2 = FlexQL.parse(query2, {
  adapter: "raw-sql",
  separators: { and: "!", or: "," },
});

console.log(ast1, ast2);
```

---

## Benefits

- **Standardized** filtering — a common language across services
- **Flexible** — choose separators that fit your needs (`;`, `,`, or custom)
- **Secure** — prevents SQL injection via parameterized queries
- **Portable** — one syntax for multiple databases
- **Extensible** — add adapters for any data source

---
