# FlexQL

FlexQL projesine hoş geldiniz!

## Genel Bakış

**FlexQL**, karmaşık SQL veya ORM sorgularına ihtiyaç duymadan veri filtrelemek için basit ve güçlü bir sorgu dilidir.

**Örnek sorgu:**

```
username==heja;age>18 status==active
```

> ⚠️ **Not:** Ayırıcı olarak boşluk (` `) kullanılamaz.

---

## Özellikler

- **Sezgisel operatörlerle **insan tarafından okunabilir sözdizimi\*\*
- **Esnek ayırıcılar** — `;`, `,` veya özel tanımlı sınırlayıcılar kullanılabilir
- **Lexer/Parser mimarisi aracılığıyla güvenli ayrıştırma**
- **Önlenmiş SQL enjeksiyonları** — ham dize birleştirme yerine parametreli sorgular kullanır
- **Uyarlanabilir** — adaptör sistemi aracılığıyla herhangi bir veritabanına entegre edilebilir
- **Doğrulanmış** sözdizimi ve tür denetimi

---

## Nasıl Çalışır

**Pipeline:** Lexer → Parser → Adapter

1. **Lexer**, sorgu dizelerini anlamlı bileşenlere ayırır
2. **Parser**, sözdizimini doğrular ve Soyut Sözdizimi Ağacı (AST) oluşturur
3. **Adapter**, AST'yi güvenli bir şekilde hedef biçime (SQL, MongoDB, Elasticsearch vb) dönüştürür **parametreli sorgular**

---

## Standartlaştırılmış Çıktı Örneği

Ham bir SQL sorgusu için FlexQL, standartlaştırılmış, enjeksiyona karşı güvenli bir yük üretir:

```javascript
{
type: 'raw-sql',
payload: {
conditions: 'WHERE CategoryName = ? AND age > ?',
values: [ 'Beverages', '10' ]
}
}
```

> ⚠️ Kullanıcı girdileri hiçbir zaman doğrudan SQL'e eklenmez. SQL enjeksiyonunu önlemek için değerler güvenli bir şekilde parametrelendirilir.

---

## Sözdizimi

| Öğe                | Amaç                   | Örnekler                         |
| ------------------ | ---------------------- | -------------------------------- |
| **Tanımlayıcılar** | Sütun adları           | `kullanıcı adı`, `yaş`, `durum`  |
| **İşleçler**       | Karşılaştırmalar       | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **Mantık**         | Birleştirme koşulları  | `;`, `,` veya özel tanımlı       |
| **Değerler**       | Eşleştirilecek veriler | `"heja"`, `18`, `true`           |

---

## Örnekler

Aşağıdaki sorguların tümü geçerlidir:

```
username==heja
age>18;status==active
country!=us,score>=100
username==heja;status==active
username==heja, status==active;score>=100
```

Özel ayırıcılarla:

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

// Varsayılan ayırıcılar (; veya ,) kullanılarak
const query1 = "username==heja;age>18";
const ast1 = FlexQL.parse(query1, { adapter: "raw-sql" });

// Özel ayırıcılar kullanılıyor
const query2 = "username==heja!age>18";
const ast2 = FlexQL.parse(query2, {
  adapter: "raw-sql",
  separators: { and: "!", or: "," },
});

console.log(ast1, ast2);
```

---

## Avantajlar

- **Standartlaştırılmış** filtreleme — hizmetler genelinde ortak bir dil
- **Esnek** — ihtiyaçlarınıza uygun ayırıcılar seçin (`;`, `,` veya özel)
- **Güvenli** — parametreli sorgular aracılığıyla SQL enjeksiyonunu önler
- **Taşınabilir** — birden fazla veritabanı için tek sözdizimi
- **Genişletilebilir** — herhangi bir veri kaynağı için adaptörler ekleyin

---
