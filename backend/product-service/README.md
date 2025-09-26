# Product Service

Product Service, DDD (Domain-Driven Design) ve Hexagonal Architecture prensipleriyle geliştirilmiş modern bir ürün yönetim sistemidir. Spring Boot 3.5.6 ve Java 21 kullanılarak geliştirilmiştir.

## 🏗️ Mimarî Yapı

Bu proje Clean Architecture ve Hexagonal Architecture prensiplerine uygun olarak katmanlı bir yapıya sahiptir:

### Katmanlar

```
com.turkcell.product.service/
├── domain/                    # İş kuralları ve domain mantığı
│   ├── model/                # Aggregate'ler ve Value Object'ler
│   │   ├── Product.java      # Product Aggregate Root
│   │   ├── ProductId.java    # ProductId Value Object
│   │   ├── Money.java        # Money Value Object
│   │   └── ProductStatus.java # ProductStatus Enum
│   ├── port/                 # Port interface'leri
│   │   ├── repository/       # Repository port'ları
│   │   └── usecase/          # Use case port'ları
│   └── exception/            # Domain exception'ları
├── application/              # Use case implementasyonları
│   └── service/              # Application service'leri
├── infrastructure/           # External adapter'lar
│   ├── persistence/          # JPA ve persistence
│   │   ├── entity/           # JPA entity'leri
│   │   ├── repository/       # Repository implementasyonları
│   │   └── mapper/           # Persistence mapper'ları
│   └── config/               # Configuration sınıfları
└── interfaces/               # Input adapter'lar
    ├── rest/                 # REST controller'lar
    │   ├── dto/              # Request/Response DTO'ları
    │   └── mapper/           # DTO mapper'ları
    └── error/                # Global error handling
```

### Domain Model

#### Product Aggregate
- **ProductId**: UUID tabanlı benzersiz tanımlayıcı
- **name**: Ürün adı (2-128 karakter, benzersiz)
- **description**: Ürün açıklaması (max 1000 karakter, opsiyonel)
- **price**: Money value object (amount + currency)
- **stockQuantity**: Stok miktarı (>= 0)
- **status**: ACTIVE/INACTIVE
- **createdAt/updatedAt**: Otomatik timestamp'ler
- **version**: Optimistic locking için

#### Value Objects
- **ProductId**: UUID wrapper
- **Money**: BigDecimal amount + String currency (default: TRY)

## 🚀 Özellikler

- ✅ **CRUD Operations**: Create, Read, Update, Delete
- ✅ **Pagination**: Sayfalı listeleme desteği
- ✅ **Validation**: Comprehensive input validation
- ✅ **Error Handling**: Standardized error responses
- ✅ **Optimistic Locking**: Version-based concurrency control
- ✅ **Auditing**: Automatic timestamps
- ✅ **OpenAPI/Swagger**: API documentation
- ✅ **MapStruct**: Type-safe mapping
- ✅ **JPA/Hibernate**: Database abstraction
- ✅ **PostgreSQL**: Production-ready database

## 🛠️ Teknolojiler

- **Java 21**
- **Spring Boot 3.5.6**
- **Spring Data JPA**
- **PostgreSQL**
- **MapStruct 1.5.5**
- **Lombok**
- **SpringDoc OpenAPI**
- **Maven**

## 📋 Gereksinimler

- Java 21+
- Maven 3.6+
- PostgreSQL 13+
- Docker (opsiyonel)

## 🏃‍♂️ Kurulum ve Çalıştırma

### 1. PostgreSQL Kurulumu

#### Docker ile:
```bash
docker run --name product-postgres \
  -e POSTGRES_DB=product_db \
  -e POSTGRES_USER=product_user \
  -e POSTGRES_PASSWORD=product_pass \
  -p 5432:5432 \
  -d postgres:15
```

#### Manuel Kurulum:
```sql
CREATE DATABASE product_db;
CREATE USER product_user WITH PASSWORD 'product_pass';
GRANT ALL PRIVILEGES ON DATABASE product_db TO product_user;
```

### 2. Uygulamayı Çalıştırma

```bash
# Proje kök dizininde
cd backend/product-service

# Bağımlılıkları yükle
mvn clean install

# Uygulamayı başlat
mvn spring-boot:run

# Veya profil belirleyerek
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Profiller

- **dev**: Development (localhost PostgreSQL)
- **docker**: Docker ortamı için
- **prod**: Production

## 📚 API Dokümantasyonu

Uygulama çalıştırıldıktan sonra:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## 🔌 API Endpoints

### Base URL: `/api/v1/products`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/` | Yeni ürün oluştur | 201, 400, 409 |
| GET | `/` | Tüm ürünleri listele | 200, 400 |
| GET | `/{id}` | ID'ye göre ürün getir | 200, 404, 400 |
| PUT | `/{id}` | Ürünü güncelle | 200, 400, 404, 409 |
| DELETE | `/{id}` | Ürünü sil | 204, 404, 400 |

## 📝 API Kullanım Örnekleri

### 1. Yeni Ürün Oluşturma

```bash
curl -X POST "http://localhost:8080/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "priceAmount": 29999.99,
    "priceCurrency": "TRY",
    "stockQuantity": 100,
    "status": "ACTIVE"
  }'
```

**Response (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "priceAmount": 29999.99,
  "priceCurrency": "TRY",
  "priceDisplay": "29999.99 TRY",
  "stockQuantity": 100,
  "status": "ACTIVE",
  "available": true,
  "createdAt": "2023-12-01T10:00:00Z",
  "updatedAt": "2023-12-01T10:00:00Z",
  "version": 0
}
```

### 2. Ürün Listesi (Sayfalı)

```bash
curl "http://localhost:8080/api/v1/products?page=0&size=10&sortBy=name&sortDir=asc"
```

### 3. ID'ye Göre Ürün Getirme

```bash
curl "http://localhost:8080/api/v1/products/123e4567-e89b-12d3-a456-426614174000"
```

### 4. Ürün Güncelleme

```bash
curl -X PUT "http://localhost:8080/api/v1/products/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro Max",
    "priceAmount": 32999.99,
    "version": 0
  }'
```

### 5. Ürün Silme

```bash
curl -X DELETE "http://localhost:8080/api/v1/products/123e4567-e89b-12d3-a456-426614174000"
```

## ⚠️ Hata Kodları ve Durumları

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_FAILED | Input validation hatası |
| 400 | INVALID_INPUT | Geçersiz input |
| 400 | DOMAIN_ERROR | Domain kuralı ihlali |
| 404 | RESOURCE_NOT_FOUND | Kaynak bulunamadı |
| 409 | CONFLICT | İsim çakışması |
| 409 | VERSION_CONFLICT | Optimistic locking hatası |
| 500 | INTERNAL_ERROR | Sunucu hatası |

### Örnek Hata Yanıtı

```json
{
  "status": 400,
  "code": "VALIDATION_FAILED",
  "message": "Validation failed for one or more fields",
  "path": "/api/v1/products",
  "timestamp": "2023-12-01T10:00:00Z",
  "fieldErrors": {
    "name": ["Product name must be between 2 and 128 characters"],
    "priceAmount": ["Price amount must be non-negative"]
  }
}
```

## 🧪 Test Etme

```bash
# Unit testleri çalıştır
mvn test

# Integration testleri çalıştır
mvn verify

# Test coverage raporu
mvn jacoco:report
```

## 🐳 Docker Desteği

### Dockerfile Oluşturma

```dockerfile
FROM openjdk:21-jdk-slim
COPY target/product-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar", "--spring.profiles.active=docker"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: product_db
      POSTGRES_USER: product_user
      POSTGRES_PASSWORD: product_pass
    ports:
      - "5432:5432"
      
  product-service:
    build: .
    depends_on:
      - postgres
    environment:
      SPRING_PROFILES_ACTIVE: docker
    ports:
      - "8080:8080"
```

## 🔧 Geliştirme Notları

### Domain Rules
1. Product name benzersiz olmalı
2. Price amount >= 0 olmalı
3. Stock quantity >= 0 olmalı
4. Default currency: TRY
5. Default status: ACTIVE

### Optimistic Locking
- Her update işleminde version kontrolü yapılır
- Version mismatch durumunda 409 Conflict döner
- Frontend'in refresh yapıp tekrar denemesi gerekir

### Validation Rules
- Name: 2-128 karakter arası, boş olamaz
- Description: Max 1000 karakter, opsiyonel
- Price amount: >= 0, zorunlu
- Currency: 3 karakter, uppercase
- Stock quantity: >= 0, zorunlu

## 🤝 Katkıda Bulunma

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Geliştirici Ekibi

- Turkcell Development Team
- Email: dev@turkcell.com.tr

---

**Not**: Bu proje eğitim ve demo amaçlı geliştirilmiştir. Production kullanımı için ek güvenlik ve performans optimizasyonları gerekebilir.
