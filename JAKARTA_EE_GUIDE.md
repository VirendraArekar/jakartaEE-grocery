# 🏛️ Complete Jakarta EE Comprehensive Revision Guide & Cheatsheet

> **Targeted Revision Reference for Enterprise Java Developers**  
> Covers **Jakarta EE 10 / 11**, **CDI 4.0 Bean Scopes**, **Jakarta Persistence (JPA 3.1)**, **Bean Validation 3.0**, **Transactions**, and **Spring Boot 3 migration**.

---

## 📑 Table of Contents
1. [The Jakarta EE Evolution & Namespace Migration](#1-the-jakarta-ee-evolution--namespace-migration)
2. [Contexts and Dependency Injection (CDI) & Bean Scopes](#2-contexts-and-dependency-injection-cdi--bean-scopes)
3. [Jakarta Persistence API (JPA 3.1) Deep Dive](#3-jakarta-persistence-api-jpa-31-deep-dive)
4. [Jakarta Bean Validation 3.0](#4-jakarta-bean-validation-30)
5. [Jakarta Transactions (JTA) & ACID Demarcation](#5-jakarta-transactions-jta--acid-demarcation)
6. [Jakarta EE vs. Spring Framework Architecture Mapping](#6-jakarta-ee-vs-spring-framework-architecture-mapping)
7. [Top 15 Jakarta EE Technical Interview Questions & Answers](#7-top-15-jakarta-ee-technical-interview-questions--answers)

---

## 1. The Jakarta EE Evolution & Namespace Migration

### From J2EE to Java EE to Jakarta EE
* **1999–2006:** **J2EE** (Java 2 Platform, Enterprise Edition) managed by Sun Microsystems. Heavyweight EJBs, deployment descriptors (`ejb-jar.xml`).
* **2006–2017:** **Java EE** (Java EE 5 to 8). Introduced annotations, lightweight POJO models, JPA, and CDI.
* **2017–Present:** Oracle transferred Java EE to the **Eclipse Foundation**. Due to trademark restrictions on the "Java" brand, the platform was renamed **Jakarta EE**.

### The Critical Package Rename: `javax.*` ➔ `jakarta.*`
With **Jakarta EE 9** (and enforced in **Spring Boot 3.0+** / **Hibernate 6.0+**), all namespace references were migrated:

| Java EE 8 (Legacy) | Jakarta EE 9 / 10 / 11 (Modern) | Purpose |
| :--- | :--- | :--- |
| `javax.persistence.*` | `jakarta.persistence.*` | ORM, Entities, EntityManager, JPQL |
| `javax.validation.*` | `jakarta.validation.*` | Bean Validation constraints (`@NotNull`, `@Valid`) |
| `javax.transaction.*` | `jakarta.transaction.*` | Declarative Transactions (`@Transactional`) |
| `javax.enterprise.context.*` | `jakarta.enterprise.context.*` | CDI Bean Scopes (`@RequestScoped`, `@SessionScoped`) |
| `javax.inject.*` | `jakarta.inject.*` | Standard Dependency Injection (`@Inject`, `@Named`) |
| `javax.servlet.*` | `jakarta.servlet.*` | HTTP Servlets, Filters, Listeners |
| `javax.ws.rs.*` | `jakarta.ws.rs.*` | Jakarta RESTful Web Services (JAX-RS) |

> ⚠️ **Key Rule:** In any modern Spring Boot 3+ or Jakarta EE 10+ project, never import `javax.persistence` or `javax.validation`. All enterprise artifacts must import `jakarta.*`.

---

## 2. Contexts and Dependency Injection (CDI) & Bean Scopes

CDI manages the lifecycle and contextual interaction of stateful and stateless beans.

### CDI Scope Comparison Matrix

| Jakarta CDI Annotation | Package | Spring Equivalent | Lifecycle / Boundary | Thread Safety Required? | Serializable? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `@ApplicationScoped` | `jakarta.enterprise.context` | `@ApplicationScope` / Singleton | Application JVM lifetime; shared across all users and threads | **YES** (Concurrent access) | No |
| `@RequestScoped` | `jakarta.enterprise.context` | `@RequestScope` | Single HTTP request-response cycle; destroyed on response commit | No (Thread-confined) | No |
| `@SessionScoped` | `jakarta.enterprise.context` | `@SessionScope` | Bound to an HTTP session; spans multiple requests from one user | Handled per session | **YES** (Clustering/Passivation) |
| `@ConversationScoped`| `jakarta.enterprise.context` | Custom / Wizard scope | Explicit boundary managed via `Conversation.begin()` / `end()` | Managed per conversation | **YES** |
| `@Dependent` *(Default)*| `jakarta.enterprise.context`| `@Scope("prototype")` | No contextual proxy. Created anew for each injection; shares caller's life | Inherits caller | If caller is |

### Normal Scopes vs. Pseudo Scopes
1. **Normal Scopes** (`@ApplicationScoped`, `@RequestScoped`, `@SessionScoped`):
   - Injected as a **client proxy** (bytecode-generated delegate).
   - Allows injecting a short-lived bean (e.g. `@RequestScoped`) into a long-lived bean (e.g. `@ApplicationScoped`) safely. The proxy delegates each method call to the current thread's active contextual instance!
2. **Pseudo Scopes** (`@Dependent`, `@Singleton`):
   - Direct reference is injected without a client proxy.

### CDI Dependency Injection Annotations
* `@Inject`: Standard dependency injection point (constructors, fields, setter methods).
* `@Named`: Exposes a bean to expression languages (EL) or clarifies qualifier names.
* `@Produces`: Producer method or field used to create objects that are not managed beans (e.g., third-party library classes, connection factories).
* `@Disposes`: Cleanup counterpart to a `@Produces` method when the context terminates.
* `@Qualifier`: Custom meta-annotation used to distinguish between multiple implementations of the same interface.
* `@Alternative`: Allows substituting an implementation at deployment/test time via configuration.
* `@PostConstruct`: Executed after dependency injection is complete.
* `@PreDestroy`: Executed right before the bean instance is dismantled by the container.

---

## 3. Jakarta Persistence API (JPA 3.1) Deep Dive

### 3.1 Entity Mapping Annotations
* `@Entity`: Declares a POJO as an entity.
  * *Rules:* Must have a no-argument constructor (can be `protected`), cannot be `final`, methods/fields cannot be `final`, must designate a primary key.
* `@Table(name = "...", indexes = {...}, uniqueConstraints = {...})`: Customizes database table name, schema, catalog, and indices in SQL Server.
* `@Id`: Declares the primary key field.
* `@GeneratedValue(strategy = ...)`:
  * `GenerationType.IDENTITY`: Uses MS SQL Server `IDENTITY(1,1)` auto-increment column.
  * `GenerationType.SEQUENCE`: Uses a database sequence object (Oracle, Postgres).
  * `GenerationType.TABLE`: Simulates sequences using a dedicated counter table (slowest).
  * `GenerationType.AUTO`: Allows Hibernate to select the dialect's default.
* `@Column`:
  * `name`: Column name in database.
  * `nullable`: Adds `NOT NULL` constraint at DDL generation.
  * `unique`: Adds unique constraint.
  * `length`: String length (`NVARCHAR(length)` in MS SQL).
  * `precision`, `scale`: Crucial for monetary amounts (e.g. `@Column(precision = 10, scale = 2)` with `BigDecimal`).
  * `updatable = false`: Prevents column from being included in SQL `UPDATE` statements (e.g. `createdAt`).
* `@Enumerated(EnumType.STRING)`:
  * `EnumType.STRING`: Stores the string name (e.g. `'CONFIRMED'`). **Always prefer this.**
  * `EnumType.ORDINAL`: Stores the 0-based integer index. **Avoid:** Adding a new enum constant or changing order silently corrupts all existing data!
* `@Transient`: Field is ignored by JPA and never mapped to a database column.
* `@Lob`: Large Object (mapped to `NVARCHAR(MAX)` or `VARBINARY(MAX)` in SQL Server).

---

### 3.2 Inheritance Strategies in JPA
1. `@MappedSuperclass`:
   - Parent class contains common attributes (e.g., `id`, `version`, `createdAt`, `updatedAt`).
   - Does **not** have its own table. Subclasses generate separate tables containing all mapped columns.
2. `InheritanceType.SINGLE_TABLE` *(Default)*:
   - One single table contains all fields from parent and all subclasses.
   - Includes a discriminator column (`@DiscriminatorColumn(name = "type")`).
   - Columns specific to subclasses must be nullable.
3. `InheritanceType.JOINED`:
   - Each class in the hierarchy has its own table. Subclass tables join with parent table using foreign key primary key. Normalized, but requires multi-table SQL JOINs on query.
4. `InheritanceType.TABLE_PER_CLASS`:
   - Each concrete subclass has its own independent table containing both inherited and distinct columns.

---

### 3.3 Associations & Relationships

```
Parent: Category  (1) <---------> (*) Product : Child (Owning Side)
Parent: Order     (1) <---------> (*) OrderItem : Child (Owning Side)
```

#### Owning Side vs. Inverse Side
* **Owning Side:** The entity that contains the foreign key in the physical database schema. Holds `@ManyToOne` or `@JoinColumn`.
* **Inverse (Non-Owning) Side:** Contains the `mappedBy` attribute referencing the field name on the owning entity.

#### Relationship Annotations
* `@ManyToOne(fetch = FetchType.LAZY / EAGER, optional = false)`: Defines the owning association.
* `@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)`: Defines the collection side.
* `@JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "fk_prod_cat"))`: Specifies foreign key column name.
* `@ManyToMany`: Many-to-many relationship; mapped using `@JoinTable(name = "...", joinColumns = ..., inverseJoinColumns = ...)`.

#### Cascade Types (`jakarta.persistence.CascadeType`)
* `ALL`: Propagates all operations.
* `PERSIST`: When parent is saved, unsaved children are saved.
* `MERGE`: When parent is merged, detached children are merged.
* `REMOVE`: When parent is deleted, child records are deleted via `DELETE` statements.
* `REFRESH`: Reloads parent and child entity states from database.
* `DETACH`: Detaches parent and children from the Persistence Context.

#### `orphanRemoval = true` vs. `CascadeType.REMOVE`
* `CascadeType.REMOVE`: Only triggers when the **parent entity itself is deleted** (`entityManager.remove(parent)`).
* `orphanRemoval = true`: Triggers when an entity is **removed from the parent collection** (e.g., `order.getItems().remove(item)`). JPA will automatically issue a SQL `DELETE` for the removed item!

---

### 3.4 Concurrency & Locking Strategies
1. **Optimistic Locking (`@Version`):**
   - Non-blocking. An integer or timestamp field annotated with `@Version`.
   - On `UPDATE`, JPA executes: `UPDATE products SET stock = ?, version = ? WHERE id = ? AND version = ?`.
   - If another transaction already bumped the version, rows affected = 0, and JPA throws `jakarta.persistence.OptimisticLockException`.
2. **Pessimistic Locking (`LockModeType`):**
   - Acquires actual row/table locks in MS SQL Server.
   - `PESSIMISTIC_READ`: Shared lock (`HOLDLOCK`).
   - `PESSIMISTIC_WRITE`: Exclusive lock (`UPDLOCK, ROWLOCK`). Used in `OrderServiceImpl.placeOrder` to prevent inventory race conditions!

---

### 3.5 Entity Lifecycle Callbacks

```
New/Transient  ---> [persist()] ---> Managed (Persistence Context)
                                         |
                                    [flush()/commit()]
                                         |
                                         v
                                      Database
```

* `@PrePersist`: Called before `persist()` writes entity.
* `@PostPersist`: Called after database `INSERT`.
* `@PreUpdate`: Called before database `UPDATE`.
* `@PostUpdate`: Called after database `UPDATE`.
* `@PreRemove`: Called before entity is deleted.
* `@PostRemove`: Called after database `DELETE`.
* `@PostLoad`: Called after entity state is loaded into memory from SQL `SELECT`.

---

## 4. Jakarta Bean Validation 3.0

Provides declarative constraint validation:

| Annotation | Allowed Target Types | Validation Rule |
| :--- | :--- | :--- |
| `@NotNull` | Any Object | Must not be `null` (empty string `""` is allowed). |
| `@NotEmpty` | `CharSequence`, `Collection`, `Map`, Array | Must not be `null` and size/length must be `> 0`. |
| `@NotBlank` | `CharSequence` | Must not be `null` and must contain at least one non-whitespace character. |
| `@Size(min, max)` | `CharSequence`, `Collection`, `Map`, Array | Length or element count must be within inclusive bounds. |
| `@Min(value)` / `@Max(value)` | Integral numbers (`long`, `int`, etc.) | Boundary check for integral fields. |
| `@DecimalMin` / `@DecimalMax` | `BigDecimal`, `BigInteger`, `String` | Monetary/decimal boundary checking (inclusive by default). |
| `@Positive` / `@PositiveOrZero` | Numeric types | Value must be strictly `> 0` or `>= 0`. |
| `@Email` | `CharSequence` | String must conform to RFC 5322 email syntax. |
| `@Pattern(regexp = "...")` | `CharSequence` | String must match the compiled Regular Expression. |
| `@Past` / `@Future` | Date / Time (`LocalDate`, `Instant`, etc.) | Date must be strictly in the past or future. |
| `@Valid` | Object references, Collections | **Cascades** validation into nested child objects. |

---

## 5. Jakarta Transactions (JTA) & ACID Demarcation

The `@Transactional` annotation (`jakarta.transaction.Transactional`) manages transactional boundaries around business methods.

### Transaction Attributes (`TxType`)
1. `TxType.REQUIRED` *(Default)*: Runs inside an existing transaction if one exists; otherwise starts a new transaction.
2. `TxType.REQUIRES_NEW`: Suspends any current transaction and always creates a brand new, independent transaction.
3. `TxType.MANDATORY`: Requires an existing active transaction; throws `TransactionRequiredException` if none exists.
4. `TxType.SUPPORTS`: Runs inside transaction if present; otherwise runs non-transactionally.
5. `TxType.NOT_SUPPORTED`: Suspends active transaction and executes non-transactionally.
6. `TxType.NEVER`: Throws exception if an active transaction is detected.

### Rollback Semantics
* By default in Jakarta Transactions, transactions roll back on unchecked exceptions (`RuntimeException` and `Error`).
* `rollbackOn = {Exception.class}`: Forces rollback on checked exceptions.
* `dontRollbackOn = {...}`: Specifies exceptions that should not trigger rollback.

---

## 6. Jakarta EE vs. Spring Framework Architecture Mapping

| Layer / Concern | Pure Jakarta EE Specification | Spring Framework / Spring Boot |
| :--- | :--- | :--- |
| **Dependency Injection** | CDI 4.0 (`@Inject`, `@Named`, `@Produces`) | Spring IoC (`@Autowired`, `@Component`, `@Bean`) |
| **Bean Scopes** | `@ApplicationScoped`, `@RequestScoped`, `@SessionScoped` | `@ApplicationScope`, `@RequestScope`, `@SessionScope` |
| **Persistence / ORM** | Jakarta Persistence (JPA), `EntityManager` | Spring Data JPA (`JpaRepository`), Hibernate |
| **REST APIs** | Jakarta REST (JAX-RS) (`@Path`, `@GET`, `@POST`) | Spring MVC (`@RestController`, `@GetMapping`) |
| **Validation** | Jakarta Bean Validation (`@Valid`, `@NotNull`) | Spring Validation (`@Valid`, MethodValidationPostProcessor) |
| **Transactions** | Jakarta Transactions (`jakarta.transaction.Transactional`) | Spring Tx (`org.springframework.transaction.annotation.Transactional`) |
| **Servlet Specification** | Jakarta Servlet 6.0 (`HttpServlet`, `@WebFilter`) | Spring `DispatcherServlet`, `OncePerRequestFilter` |

---

## 7. Top 15 Jakarta EE Technical Interview Questions & Answers

### Q1: What is the N+1 select problem in JPA and how do you resolve it?
> **Answer:** The N+1 select problem occurs when fetching an entity with lazy relationships. Querying 100 Categories executes 1 initial SQL query; subsequently accessing each category's products executes 100 additional queries ($1 + 100 = 101$ queries).  
> **Resolution:**
> 1. Use **JPQL `JOIN FETCH`**: `SELECT c FROM Category c LEFT JOIN FETCH c.products`.
> 2. Use **`@EntityGraph`** to declaratively specify associations to fetch eagerly in that specific query.

### Q2: Why did Java EE change to Jakarta EE and what happened to the package names?
> **Answer:** Oracle transferred Java EE to the Eclipse Foundation in 2017 but retained the legal trademark on the name "Java". Consequently, the specification was renamed Jakarta EE. In Jakarta EE 9, all standard package names shifted from `javax.*` to `jakarta.*`. Spring Boot 3+ requires Jakarta EE 10+ (`jakarta.*`).

### Q3: What is the difference between `@ApplicationScoped` and `@Singleton`?
> **Answer:**
> - `@ApplicationScoped` is a normal CDI scope. The container injects a **client proxy** (lazy proxy). It supports interception, decorators, and lifecycle callbacks.
> - `@Singleton` is a pseudo-scope. The container injects a direct reference without a proxy.

### Q4: Explain the difference between `FetchType.LAZY` and `FetchType.EAGER`.
> **Answer:**
> - `FetchType.LAZY`: Associated entity or collection is not loaded until its getter method is invoked. If invoked outside an open persistence context/transaction, throws `LazyInitializationException`.
> - `FetchType.EAGER`: Association is loaded immediately with the parent via SQL JOIN or secondary SELECT. Best practice: Default to LAZY for all collections (`@OneToMany`, `@ManyToMany`) to avoid performance bottlenecks.

### Q5: How does Optimistic Locking with `@Version` prevent lost updates?
> **Answer:** An entity defines an `@Version` column (e.g. `Long version`). When an UPDATE statement is issued, Hibernate appends `WHERE id = :id AND version = :version` and increments the version by 1. If another transaction committed first, the WHERE clause matches 0 rows, and an `OptimisticLockException` is thrown, aborting the transaction cleanly without database row lock contention.

### Q6: When would you use Pessimistic Locking instead of Optimistic Locking?
> **Answer:** When concurrency is high and collision conflicts would cause frequent rollbacks (e.g., flash-sale grocery stock deduction or banking balance transfers). In our project, `ProductRepository.findByIdWithLock` uses `LockModeType.PESSIMISTIC_WRITE` to issue `SELECT ... WITH (UPDLOCK, ROWLOCK)` in MS SQL Server, blocking other checkout threads until the active transaction completes.

### Q7: What is the difference between `EntityManager.persist()` and `EntityManager.merge()`?
> **Answer:**
> - `persist(entity)`: Transitions a *new/transient* entity to *managed*. Entity becomes tracked by the persistence context; ID is generated.
> - `merge(entity)`: Takes a *detached* entity (exists in DB but outside current session), copies its state onto a managed entity instance, and returns the managed instance. The original passed object remains detached!

### Q8: What does `orphanRemoval = true` do?
> **Answer:** When an element is removed from a parent entity's collection (e.g., `category.getProducts().remove(product)`), `orphanRemoval = true` instructs JPA to automatically issue a SQL `DELETE` for the removed child row in the database table.

### Q9: Why should you avoid `@Enumerated(EnumType.ORDINAL)`?
> **Answer:** `ORDINAL` saves the integer position of the enum. If a developer rearranges the enum constants, adds an entry at the beginning, or deprecates an entry, every existing row in the database will point to the wrong enum constant, leading to silent, irreversible data corruption. Always use `EnumType.STRING`.

### Q10: What is the difference between `@NotNull`, `@NotEmpty`, and `@NotBlank`?
> **Answer:**
> - `@NotNull`: Value cannot be `null`. (Allows `""` and `"   "`).
> - `@NotEmpty`: Value cannot be `null` and `length > 0`. (Allows `"   "` whitespace).
> - `@NotBlank`: Value cannot be `null`, and trimmed length must be `> 0` (contains at least one non-whitespace character).

### Q11: What is the purpose of `@MappedSuperclass`?
> **Answer:** Designates a class that supplies mapping information (columns, ID, lifecycle callbacks, version) to inheriting child entities without creating a physical table for the parent class itself. Ideal for reusable base entities (`BaseEntity`).

### Q12: How do `@PrePersist` and `@PreUpdate` lifecycle callbacks work?
> **Answer:** Methods annotated with `@PrePersist` and `@PreUpdate` are invoked automatically by JPA immediately before an entity row is inserted or updated in the database. In our `BaseEntity`, they populate `createdAt` and `updatedAt` timestamps automatically without manual controller code.

### Q13: What is the CDI `@Dependent` pseudo-scope?
> **Answer:** The default scope in CDI if no scope annotation is specified. A `@Dependent` bean has no client proxy. Its lifecycle is bound directly to the lifecycle of the parent bean that injected it, and it is instantiated once per injection point.

### Q14: How does `@Valid` work on nested objects?
> **Answer:** Without `@Valid`, Bean Validation will only validate the immediate fields of the target object. Adding `@Valid` onto a member object or a collection (e.g., `@Valid private List<OrderItemRequest> items`) instructs the validator to cascade into each nested child object and validate its constraints recursively.

### Q15: What is the difference between `jakarta.transaction.Transactional` and Spring's `@Transactional`?
> **Answer:**
> - `jakarta.transaction.Transactional` is the standard specification annotation from JTA (Jakarta Transactions 2.0).
> - Spring's `@Transactional` (`org.springframework.transaction.annotation.Transactional`) is Spring's proprietary annotation offering extra features like `readOnly = true`, `timeout`, and custom transaction manager qualification. Spring Boot seamlessly supports both!

