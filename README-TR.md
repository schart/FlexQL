# 📄 FlexQL

**FlexQL**, veri filtreleme ve sorgulama işlemleri için tasarlanmış, basit ama güçlü bir sorgu dilidir.
Karmaşık SQL veya ORM sorgularını yazmadan, kolayca koşullar tanımlamanıza olanak tanır.

Örnek sorgu:

```
username==heja;age>18;status==active
```

---

## 🚀 Özellikler

- **Okunabilir Sözdizimi** → İnsan tarafından kolay anlaşılır.
- **Parser + Lexer Mimarisi** → Hızlı ve güvenli sorgu ayrıştırma.
- **Adapter Sistemi** → İstediğiniz veritabanı veya sorgu motoruna kolayca entegre olur.
- **Tip & Sözdizimi Doğrulama** → Hatalı sorgular daha çalışmadan yakalanır.

---

## 📦 Bileşenler

### 1️⃣ Lexer

Lexer, gelen sorgu metnini **token** adı verilen küçük anlamlı parçalara böler.
Örneğin:

```
username==heja;age>18
```

Lexer çıktısı:

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

🔹 Avantajı → Sorguyu güvenli ve yönetilebilir hale getirir.

---

### 2️⃣ Parser

Parser, Lexer’dan gelen token’ları alır ve **anlamsal olarak doğru** bir sorgu olup olmadığını kontrol eder.
Örneğin:

- `username==heja` ✅ Geçerli
- `==heja` ❌ Geçersiz (IDENTIFIER eksik)

Parser ayrıca token’ları **AST** (Abstract Syntax Tree) yapısına dönüştürerek, backend’de işlenebilir hale getirir.

---

### 3️⃣ Adapter

Adapter, Parser’dan çıkan yapıyı alır ve hedef sisteme uygun şekilde dönüştürür.
Örneğin:

- **SQL Adapter** → SQL `WHERE` ifadesi üretir.
- **MongoDB Adapter** → MongoDB query objesi oluşturur.
- **Elasticsearch Adapter** → Elasticsearch DSL formatına çevirir.

Bu sayede FlexQL’i istediğiniz veri kaynağına bağlayabilirsiniz.

---

## 📌 Sözdizimi Kuralları

- **IDENTIFIER** → Kolon adları (`username`, `age`, `status`)
- **OPERATORS** → `==`, `!=`, `>`, `<`, `>=`, `<=`
- **LOGICAL** → `,` (OR), `;` (AND)
- **VALUE** → Kolon değerleri (`heja`, `18`, `active`)

---

## 💡 Örnekler

```
username==heja
age>18;status==active
country!=us;score>=100
username==heja,username==corci
```

---

## 🎯 Faydaları

- **Standartlaştırılmış Filtreleme** → Tüm servislerde ortak dil.
- **Güvenlik** → Ham sorgu çalıştırmak yerine kontrollü parse.
- **Taşınabilirlik** → Farklı veri kaynakları için tek dil.
- **Kolay Entegrasyon** → Adapter ile her sisteme uyarlanabilir.

---

## 🔧 Kurulum

```bash
npm install flexql
```

---

## 📜 Kullanım

```javascript
import { FlexQL } from "flexql";

const query = "username==heja;age>18";
const ast = FlexQL.parse(query, { adapter: "raw-sql" });

console.log(ast);
// Adapter ile istediğiniz formata dönüştürün (suanlik sadece raw-sql destegi vardir)
```

---
