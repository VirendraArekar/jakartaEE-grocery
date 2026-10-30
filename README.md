# 🛒 FreshCart Enterprise Grocery Platform
### Spring Boot 3 &bull; Microsoft SQL Server &bull; Redis Cache &bull; Next.js &bull; Docker &bull; Kubernetes &bull; Jakarta EE Masterclass

![FreshCart Platform Banner](https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview

**FreshCart** is a complete, enterprise-grade fullstack grocery e-commerce and inventory platform built with:
* **Backend:** Spring Boot 3.3.4 (Java 17/21) running on the modern **Jakarta EE 10** specification (`jakarta.*` namespace).
* **Database:** **Microsoft SQL Server 2022** with **Persistent Storage** (Docker named volumes & Kubernetes `PersistentVolumeClaim`).
* **In-Memory Caching:** **Redis 7** cache layer providing sub-millisecond grocery catalog lookups and automated cache eviction upon stock changes.
* **Frontend:** Modern **Next.js** (App Router, React 18, TypeScript, Tailwind CSS, Lucide icons) featuring real-time cart, checkout flow, administrative inventory restocker, and an interactive **Jakarta EE Revision Dashboard**.
* **DevOps & Cloud Native:** Production-ready **Docker Compose** multi-container setup and modular **Kubernetes** manifests (`k8s/`) orchestrated via Kustomize.

---

## 🏗️ Architecture Diagram

```
                              [ User Web Browser ]
                                       |
                                       v
               +-----------------------------------------------+
               |           Next.js 14 Frontend UI             |
               |       Port 3000 / Ingress / Route '/'         |
               +-----------------------------------------------+
                                       |
                               (HTTP REST / JSON)
                                       v
               +-----------------------------------------------+
               |        Spring Boot 3 Backend Service         |
               |      Port 8088 / Ingress / Route '/api'       |
               +-----------------------+-----------------------+
                                       |
                     +-----------------+-----------------+
                     |                                   |
                     v                                   v
+---------------------------------------+   +---------------------------------------+
|          Redis 7.x Cache             |   |     Microsoft SQL Server 2022         |
|  - In-Memory Key-Value Caching        |   |  - ACID Relational Database           |
|  - AOF Log Persistence                |   |  - Clustered / Non-Clustered Indexes  |
|  - Volume: redis-pvc / redis_data     |   |  - Volume: mssql-pvc / mssql_data     |
+---------------------------------------+   +---------------------------------------+
```

---

## 📚 Jakarta EE Revision Highlights

This codebase is specifically designed to double as an **interactive Jakarta EE revision companion**. Every entity, DTO, service, and controller features explicit code comments detailing the underlying enterprise specifications:

1. **Jakarta Persistence (JPA 3.1) (`jakarta.persistence.*`)**:
   * `@Entity`, `@Table(indexes = ...)`: Clustered and non-clustered index declaration in MS SQL.
   * `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Relies on SQL Server's native `IDENTITY(1,1)` column.
   * `@MappedSuperclass`: Base entity inheritance providing `id`, `version`, and audit timestamps without an extra table.
   * `@Version`: **Optimistic Locking** to detect concurrent edits and prevent lost updates without row locks.
   * `@Enumerated(EnumType.STRING)`: Avoids ordinal-shift data corruption bugs when enums are modified.
   * `@OneToMany(mappedBy = "...", cascade = CascadeType.ALL, orphanRemoval = true)`: Cascade and automatic detached child deletion.
   * `@ManyToOne(fetch = FetchType.LAZY / EAGER)`: Foreign key association owning side.
   * `@PrePersist` & `@PreUpdate`: Entity lifecycle callbacks updating timestamps before DB write.
   * `@Lock(LockModeType.PESSIMISTIC_WRITE)`: Acquires MS SQL Server `UPDLOCK, ROWLOCK` during checkout to eliminate inventory race conditions.
2. **Jakarta Bean Validation 3.0 (`jakarta.validation.*`)**:
   * `@NotNull`, `@NotBlank`, `@Size`, `@DecimalMin`, `@PositiveOrZero`, `@Email`, `@Pattern`.
   * `@Valid`: Cascades validation into nested objects and collections.
3. **Contexts and Dependency Injection (CDI 4.0) & Scopes**:
   * `@ApplicationScoped` vs `@RequestScoped` vs `@SessionScoped` vs `@ConversationScoped` vs `@Dependent`.
   * Live interactive inspector at `/jakarta-guide` showing real-time instance lifecycle generation!
4. **Jakarta Transactions (JTA) (`jakarta.transaction.Transactional`)**:
   * ACID transaction demarcation, rollback rules, and atomic order placements.

> 📖 **Full Deep-Dive:** Read [`JAKARTA_EE_GUIDE.md`](./JAKARTA_EE_GUIDE.md) for the complete 15-question interview cheat sheet and annotation reference table!

---

## ⚡ Redis In-Memory Caching Strategy

* **Product Catalog (`productList`):** Cached in Redis with a 5-minute TTL.
* **Product Details (`products`):** Cached in Redis with a 15-minute TTL.
* **Categories (`categories`):** Cached in Redis with a 1-hour TTL.
* **Automated Cache Invalidation:**
  * Creating or modifying products automatically executes `@CacheEvict(value = {"productList", "products", "categories"}, allEntries = true)`.
  * Placing an order automatically deducts stock and flushes the Redis catalog cache, ensuring real-time consistency.

---

## 💾 Database Persistence Guarantee

Data durability is enforced at both container and Kubernetes cluster levels:

1. **Docker Compose:**
   * Uses named volume `mssql_data:/var/opt/mssql`.
   * Even if you run `docker compose down`, your products, categories, customers, and orders remain intact when you start up again (`docker compose up`).
2. **Kubernetes:**
   * Utilizes a `PersistentVolumeClaim` (`k8s/10-mssql-pvc.yaml` requesting `10Gi` storage).
   * Pod restarts, upgrades, or rolling updates unmount and reattach the storage volume without data loss.

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

Make sure Docker is running on your machine, then execute:

```bash
# Clone or navigate to the repository directory
cd "/Users/apple/Desktop/Antigravity/Jakarta EE"

# Build and start all 4 containers (MS SQL, Redis, Spring Boot Backend, Next.js Frontend)
docker compose up --build -d
```

#### Access Endpoints:
* **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
* **Backend REST APIs:** [http://localhost:8088/api/products](http://localhost:8088/api/products)
* **Interactive Jakarta EE Guide:** [http://localhost:3000/jakarta-guide](http://localhost:3000/jakarta-guide)
* **Admin Inventory & Cache Manager:** [http://localhost:3000/admin](http://localhost:3000/admin)
* **Spring Actuator Health Probes:** [http://localhost:8088/actuator/health](http://localhost:8088/actuator/health)

To view logs:
```bash
docker compose logs -f
```

To stop:
```bash
docker compose down
```

---

### Option 2: Deploy on Kubernetes (`k8s/`)

You can deploy the complete stack onto **Minikube**, **Kind**, **Docker Desktop Kubernetes**, **EKS**, or **GKE**:

```bash
# Automated deployment script:
./k8s/deploy-k8s.sh
```

Or manually via `kubectl`:

```bash
# 1. Apply all manifests via Kustomize in dependency order
kubectl apply -k ./k8s

# 2. Verify all pods are running in the 'grocery-system' namespace
kubectl get pods -n grocery-system -w

# 3. Access frontend service via port-forwarding
kubectl port-forward svc/frontend-service 3000:80 -n grocery-system
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

### Option 3: Run Locally for Development

#### 1. Start MS SQL Server & Redis via Docker
```bash
docker run -d --name local-mssql -p 1433:1433 -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Grocery@2026StrongPass" mcr.microsoft.com/mssql/server:2022-latest
docker run -d --name local-redis -p 6379:6379 redis:7-alpine
```

#### 2. Start Spring Boot Backend
```bash
cd backend
mvn clean spring-boot:run
```

#### 3. Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 📡 REST API Reference

| Method | Endpoint | Description | Cache Behavior |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all grocery categories | `@Cacheable("categories")` |
| `POST` | `/api/categories` | Create a new category | `@CacheEvict` |
| `GET` | `/api/products` | Search/filter products by category & keyword | `@Cacheable("productList")` |
| `GET` | `/api/products/{id}` | Get product details by ID | `@Cacheable("products")` |
| `POST` | `/api/products` | Create product (Jakarta validated) | `@CacheEvict` |
| `PUT` | `/api/products/{id}` | Update product | `@CacheEvict` |
| `DELETE` | `/api/products/{id}` | Delete product | `@CacheEvict` |
| `PATCH` | `/api/products/{id}/stock` | Quick restock / decrement | `@CacheEvict` |
| `POST` | `/api/orders` | Place customer order (ACID Transaction) | Deducts stock & evicts cache |
| `GET` | `/api/orders` | List order history & tracking | Live DB Query |
| `GET` | `/api/jakarta-guide/scopes/live` | Live CDI / Spring Scope diagnostic probe | Fresh per hit |
| `GET` | `/api/jakarta-guide/annotations` | Complete Jakarta EE annotation dictionary | Static JSON |

---

## 🧪 Testing Backend Build

To re-compile and verify the Spring Boot backend artifacts:

```bash
cd backend
mvn clean package -DskipTests
```

---

## 👨‍💻 Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/grocery/
│       ├── config/        # RedisConfig, WebCorsConfig
│       ├── controller/    # Category, Product, Order, JakartaGuide Controllers
│       ├── dto/           # Request/Response DTOs with @Valid constraints
│       ├── exception/     # GlobalExceptionHandler handling Jakarta errors
│       ├── model/         # BaseEntity, Category, Product, Customer, Order
│       ├── repository/    # JPA repositories with pessimistic locks & JPQL
│       ├── service/       # Business logic with @Cacheable & @Transactional
│       └── util/          # DataInitializer (pre-seeds organic grocery catalog)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx            # Storefront with organic filter & search
│       │   ├── admin/page.tsx      # Inventory manager & Redis restocker
│       │   ├── orders/page.tsx     # Order history & receipts
│       │   └── jakarta-guide/page.tsx # Interactive Jakarta EE Revision Hub
│       ├── components/    # Navbar, ProductCard, CartDrawer, CheckoutModal
│       ├── context/       # CartContext with persistent cart state
│       └── lib/           # TypeScript interfaces & API client
├── k8s/                   # Production Kubernetes Manifests (PVCs, Ingress, Deployments)
├── docker-compose.yml     # Multi-container orchestration with persistent volumes
├── JAKARTA_EE_GUIDE.md    # In-depth Jakarta EE 10 revision guide & interview FAQ
└── README.md              # Project documentation
```

