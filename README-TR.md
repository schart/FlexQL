# 🧩 FlexQL

Karmaşık SQL veya ORM sorguları yazmadan **veri filtreleme** yapmanı sağlayan, hafif ama güçlü bir **sorgu dili motoru**.

> 🇬🇧 English version → [README.md](./README.md)

---

## 🚀 Genel Bakış

**FlexQL**, geliştiricilere **okunabilir ve basit** bir sorgu dili sunar.
SQL yazmadan, kolay anlaşılır filtreler oluşturabilirsin.

**Örnek sorgu:**

```
username==heja;age>18,status==active
```

Bu ifade şu anlama gelir:

```
(username == "heja" AND age > 18) OR (status == "active")
```

> ⚠️ **Not:** Boşluk (` `) ayırıcı olarak kullanılamaz.

---

## ✨ Özellikler

- 🧠 **Okunabilir sözdizimi** — basit ve sezgisel
- 🔀 **Esnek ayırıcılar** — `;`, `,` veya özel tanımlı karakterleri kullanabilirsin
- 🔒 **Güvenli ayrıştırma** — SQL enjeksiyonlarına karşı korumalı
- ⚙️ **Adapter tabanlı mimari** — SQL, MongoDB, Elasticsearch veya kendi sistemine entegre edilebilir
- 🧱 **Lexer → Parser → Adapter** yapısı — modüler ve genişletilebilir
- 🧪 **Doğrulanmış sözdizimi** ve tip kontrolü
- 🧰 **Kolay genişletme** — yeni adapter’lar hızlıca eklenebilir

---

## ⚙️ Nasıl Çalışır?

**Ana İş Akışı:**

```
+--------+       +--------+       +---------+
| Lexer  |  -->  | Parser |  -->  | Adapter |
+--------+       +--------+       +---------+
     |                |               |
   Tokens         N-ary Tree     SQL/Mongo/Elastic
```

1. **Lexer**: Sorgu metnini anlamlı parçalara böler (token’lar).
2. **Parser**: Söz dizimini doğrular ve bir **N-ary Tree (ANT)** yapısı oluşturur.
3. **Adapter**: Bu ağacı, hedef formata (örneğin SQL, MongoDB, Elasticsearch) dönüştürür.
   Dönüşüm süreci **parametreleştirilmiş sorgular** üzerinden yapılır, yani enjeksiyon güvenliği sağlanır.

---

## 🌳 AST Örneği

Sorgu:

```
username==heja;age>18,status==active
```

Üretilen AST (basitleştirilmiş):

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

> AST gösterimi, FlexQL’in “sadece string değil, gerçek bir parse engine” olduğunu net gösterir.

---

## 🧱 Standart Çıktı Örneği

Aşağıdaki sorgu:

```
CategoryName==Beverages ; age>10
```

**RawSQL** adapter’ı ile şu güvenli çıktıyı üretir:

```js
{
  type: 'raw-sql',
  payload: {
    conditions: 'WHERE CategoryName = ? AND age > ?',
    values: ['Beverages', '10']
  }
}
```

> ✅ **SQL enjeksiyonuna karşı güvenli.**
> Değerler hiçbir zaman doğrudan SQL string’ine eklenmez.

---

## 🔤 Sözdizimi Referansı

| Eleman            | Açıklama             | Örnekler                         |
| ----------------- | -------------------- | -------------------------------- |
| **Identifier**    | Alan / sütun adı     | `username`, `age`, `status`      |
| **Operator**      | Karşılaştırma işlemi | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **Mantık İşlemi** | Koşul birleştirme    | `;`, `,` veya özel tanımlı       |
| **Değer**         | Eşleşecek veri       | `"heja"`, `18`, `true`           |

---

## 🧩 Örnekler

Aşağıdaki tüm sorgular geçerlidir:

```
username==test ; age>10
username==test , status == false
```

**Özel ayırıcılarla:**

```js
FlexQL.parse(query1, { adapter: "raw-sql", separators: { and: "!", or: "," } });
```

```
username==heja ! age>18
username==heja ! status==active , score>=100
```

---

## 📦 Kurulum ve Kullanım

```bash
npm install flexql
```

```js
import { FlexQL } from "flexql";

// Varsayılan ayırıcılar (; ve ,)
const query = "username==heja;age>18";
const sql = FlexQL.parse(query, { adapter: "raw-sql" });

console.log(sql);
```

---

## 💡 Neden FlexQL?

- ✅ **Okunabilir** — karmaşık filtreler bile kolay yazılır
- 🧱 **Standart** — birden fazla veri kaynağı için tek dil
- 🧠 **Akıllı** — mantıksal öncelik kurallarını anlar (AND > OR)
- 🔒 **Güvenli** — parametreleştirilmiş sorgularla enjeksiyona karşı korumalı
- 🌍 **Taşınabilir** — her veritabanı için adapter tabanlı yapı
- 🧩 **Modüler** — kolayca genişletilebilir ve uyarlanabilir

---

## 🧑‍💻 Kullanım Senaryoları

- **Yönetim panelleri** veya **dashboard**’larda dinamik filtreleme
- **Kural motorları** veya **bonus sistemleri** gibi koşul tabanlı yapılar
- **API sorgu parametrelerini** güvenli şekilde çözümleme
- **Veritabanından bağımsız sorgu katmanı** oluşturma

---

## 🧭 Yol Haritası

- [ ] MongoDB ve Elasticsearch adapter’ları
- [ ] Parantezli (nested) sorgu desteği
- [ ] Alan-değer eşleşmeleri için tip çıkarımı
- [ ] Sorgu optimize edici (gereksiz koşulları birleştirme)
- [ ] Web tabanlı FlexQL Playground

---

## ⚖️ Lisans

MIT © 2025 Heja “xeja” Arslan
