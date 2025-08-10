Sure! Here’s the English version of your README for **FlexQL** with the same structure and clarity:

---

# 📄 FlexQL

**FlexQL** is a simple yet powerful query language designed for data filtering and querying.
It allows you to define conditions easily without writing complex SQL or ORM queries.

Example query:

```
username==heja;age>18;status==active
```

---

## 🚀 Features

- **Readable Syntax** → Easy for humans to understand.
- **Parser + Lexer Architecture** → Fast and secure query parsing.
- **Adapter System** → Easily integrate with your desired database or query engine.
- **Type & Syntax Validation** → Catch incorrect queries before execution.

---

## 📦 Components

### 1️⃣ Lexer

The Lexer breaks the incoming query string into small meaningful pieces called **tokens**.
Example:

```
username==heja;age>18
```

Lexer output:

```json
[
  { "type": "IDENTIFIER", "value": "username" },
  { "type": "OPERATOR", "value": "==" },
  { "type": "VALUE", "value": "heja" },
  { "type": "SEPARATOR", "value": ";" },
  { "type": "IDENTIFIER", "value": "age" },
  { "type": "OPERATOR", "value": ">" },
  { "type": "VALUE", "value": "18" }
]
```

🔹 Benefit → Makes queries safe and manageable.

---

### 2️⃣ Parser

The Parser takes tokens from the Lexer and validates whether the query is **semantically correct**.
For example:

- `username==heja` ✅ Valid
- `==heja` ❌ Invalid (missing IDENTIFIER)

The Parser also transforms tokens into an **AST** (Abstract Syntax Tree) that can be processed by the backend.

---

### 3️⃣ Adapter

The Adapter converts the parsed structure into a format suitable for your target system.
Examples:

- **SQL Adapter** → Generates SQL `WHERE` clause.
- **MongoDB Adapter** → Creates MongoDB query object.
- **Elasticsearch Adapter** → Converts to Elasticsearch DSL format.

This allows you to connect FlexQL to any data source you want.

---

## 📌 Syntax Rules

- **IDENTIFIER** → Column names (`username`, `age`, `status`)
- **OPERATORS** → `==`, `!=`, `>`, `<`, `>=`, `<=`
- **LOGICAL** → `,` (OR), `;` (AND)
- **VALUE** → Column values (`heja`, `18`, `active`)

---

## 💡 Examples

```
username==heja
age>18;status==active
country!=us;score>=100
username==heja,username==corci
```

---

## 🎯 Benefits

- **Standardized Filtering** → A common language across all services.
- **Security** → Controlled parsing instead of raw query execution.
- **Portability** → One language for multiple data sources.
- **Easy Integration** → Adaptable to any system via adapters.

---

## 🔧 Installation

```bash
npm install flexql
```

---

## 📜 Usage

```javascript
import { FlexQL } from "flexql";

const query = "username==heja;age>18";
const ast = FlexQL.parse(query, { adapter: "raw-sql" });

console.log(ast);
// Convert with adapter to your desired format (currently only raw-sql supported)
```

---
