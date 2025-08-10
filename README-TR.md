# FlexQL

Karmaşık SQL veya ORM sorguları yazmadan veri filtreleme için basit ve güçlü bir sorgu dili.

**Sorgu örneği:** `username==heja;age>18;status==active`

## Özellikler

- **Okunabilir söz dizimi** ile sezgisel operatörler
- **Güvenli ayrıştırma** lexer/parser mimarisi ile
- **Uyarlanabilir** adapter sistemi ile herhangi bir veritabanına
- **Doğrulanmış** söz dizimi ve tip kontrolü

## Nasıl Çalışır

### Lexer → Parser → Adapter

1. **Lexer** sorgu dizelerini anlamlı bileşenlere ayırır
2. **Parser** söz dizimini doğrular ve Soyut Söz Dizimi Ağacı (AST) oluşturur
3. **Adapter** AST'yi hedef formata dönüştürür (SQL, MongoDB, Elasticsearch vb.)

### Söz Dizimi

| Öğe                | Amaç                | Örnekler                         |
| ------------------ | ------------------- | -------------------------------- |
| **Tanımlayıcılar** | Sütun isimleri      | `username`, `age`, `status`      |
| **Operatörler**    | Karşılaştırmalar    | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **Mantık**         | Koşulları birleştir | `;` (VE), `,` (VEYA)             |
| **Değerler**       | Eşleştirilecek veri | `"heja"`, `18`, `true`           |

## Örnekler

```
username==heja
age>18;status==active
country!=us;score>=100
username==heja,username==admin
```

## Kurulum ve Kullanım

```bash
npm install flexql
```

```javascript
import { FlexQL } from "flexql";

const query = "username==heja;age>18";
const ast = FlexQL.parse(query, { adapter: "raw-sql" });
console.log(ast);
```

## Faydalar

- **Standartlaştırılmış** servisler arası filtreleme
- **Güvenli** - ham sorgu enjeksiyonu yok
- **Taşınabilir** - birden fazla veritabanı için tek söz dizimi
- **Genişletilebilir** - herhangi bir veri kaynağı için adapter ekle
