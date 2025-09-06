# FlexQL

FlexQL projesine hoş geldiniz!

İngilizce sürüm için bkz. [README.md](./README.md).

## Genel Bakış

**FlexQL**, karmaşık SQL veya ORM sorgularına ihtiyaç duymadan veri filtrelemek için basit ve güçlü bir sorgu dilidir.

**Örnek sorgu:**

```
username==heja;age>18 status==active
```

> ⚠️ **Not:** Boşluk (` `) ayraç olarak kullanılamaz.

---

## Özellikler

- **İnsan tarafından okunabilir sözdizimi** ve sezgisel operatörler
- **Esnek ayraçlar** — `;`, `,` veya özel tanımlı ayraçlar kullanılabilir
- **Güvenli ayrıştırma** lexer/parser mimarisi ile
- **Uyarlanabilir** — adapter sistemi aracılığıyla herhangi bir veritabanına entegre edilebilir
- **Doğrulanan** sözdizimi ve tip kontrolü

---

## Nasıl Çalışır?

**Adım zinciri:** Lexer → Parser → Adapter

1. **Lexer**, sorgu ifadelerini anlamlı bileşenlere ayırır
2. **Parser**, sözdizimini doğrular ve Soyut Sözdizim Ağacı (AST) oluşturur
3. **Adapter**, AST’yi hedef formata dönüştürür (SQL, MongoDB, Elasticsearch, vb.)

---

## Sözdizimi

| Eleman          | Amaç                  | Örnekler                         |
| --------------- | --------------------- | -------------------------------- |
| **Identifier**  | Kolon adları          | `username`, `age`, `status`      |
| **Operatörler** | Karşılaştırmalar      | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **Mantık**      | Koşulları birleştirme | `;`, `,` veya özel tanımlı       |
| **Değerler**    | Eşleşecek veriler     | `"heja"`, `18`, `true`           |

---

## Örnekler

Aşağıdaki tüm sorgular geçerlidir:

```
username==heja
age>18;status==active
country!=us,score>=100
username==heja;status==active
username==heja, status==active;score>=100
```

Özel ayraçlarla:

```
username==heja!age>18
username==heja! status==active,score>=100
```

---

## Kurulum ve Kullanım

```bash
npm install flexql
```

```javascript
import { FlexQL } from "flexql";

// Varsayılan ayraçları kullanma (; veya ,)
const sorgu1 = "username==heja;age>18";
const ast1 = FlexQL.parse(sorgu1, { adapter: "raw-sql" });

// Özel ayraçlarla kullanma
const sorgu2 = "username==heja!age>18";
const ast2 = FlexQL.parse(sorgu2, {
  adapter: "raw-sql",
  separators: { and: "!", or: "," },
});

console.log(ast1, ast2);
```

---

## Avantajlar

- **Standartlaştırılmış** filtreleme — tüm servislerde ortak dil
- **Esnek** — ihtiyacınıza uygun ayraçları seçin (`;`, `,` veya özel)
- **Güvenli** — ham sorgu enjeksiyonu yok
- **Taşınabilir** — tek sözdizimi ile birden fazla veritabanı
- **Genişletilebilir** — her veri kaynağı için adapter eklenebilir

---
