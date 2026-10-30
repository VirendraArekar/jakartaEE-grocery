package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.service.JakartaScopeDemoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jakarta-guide")
public class JakartaGuideController {

    private final JakartaScopeDemoService.AppScopedBean appScopedBean;
    private final JakartaScopeDemoService.RequestScopedBean requestScopedBean;
    private final JakartaScopeDemoService.SessionScopedBean sessionScopedBean;

    public JakartaGuideController(
            JakartaScopeDemoService.AppScopedBean appScopedBean,
            JakartaScopeDemoService.RequestScopedBean requestScopedBean,
            JakartaScopeDemoService.SessionScopedBean sessionScopedBean) {
        this.appScopedBean = appScopedBean;
        this.requestScopedBean = requestScopedBean;
        this.sessionScopedBean = sessionScopedBean;
    }

    /**
     * Demonstrates live CDI Scopes in action:
     * - AppScopedBean maintains total counter across requests and static instance ID.
     * - RequestScopedBean generates a brand new instance ID on EVERY hit.
     * - SessionScopedBean tracks session requests.
     */
    @GetMapping("/scopes/live")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLiveScopesDemo() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("applicationScopedBean", appScopedBean.getScopeInfo());
        response.put("requestScopedBean", requestScopedBean.getScopeInfo());
        response.put("sessionScopedBean", sessionScopedBean.getScopeInfo());
        return ResponseEntity.ok(ApiResponse.ok("Live Jakarta EE / CDI Bean Scopes Data", response));
    }

    /**
     * Provides a structured dictionary of all major Jakarta EE annotations,
     * their purposes, packages, lifecycle, and best practices for revision.
     */
    @GetMapping("/annotations")
    public ResponseEntity<ApiResponse<Map<String, List<Map<String, String>>>>> getAnnotationsCatalog() {
        Map<String, List<Map<String, String>>> catalog = new LinkedHashMap<>();

        // 1. Jakarta Persistence (JPA)
        List<Map<String, String>> jpaList = new ArrayList<>();
        jpaList.add(annotationEntry("@Entity", "jakarta.persistence.Entity", "Marks a POJO as a persistent domain entity. Requires a no-arg constructor and primary key (@Id)."));
        jpaList.add(annotationEntry("@Table", "jakarta.persistence.Table", "Customizes table name, schema, catalogs, indexes, and unique constraints in SQL Server."));
        jpaList.add(annotationEntry("@Id", "jakarta.persistence.Id", "Declares the primary key property or field of an entity."));
        jpaList.add(annotationEntry("@GeneratedValue", "jakarta.persistence.GeneratedValue", "Defines the primary key generation strategy (IDENTITY, SEQUENCE, TABLE, AUTO). In SQL Server, IDENTITY corresponds to IDENTITY(1,1)."));
        jpaList.add(annotationEntry("@Column", "jakarta.persistence.Column", "Maps a persistent field to a column (nullable, length, precision, scale, unique, updatable)."));
        jpaList.add(annotationEntry("@Version", "jakarta.persistence.Version", "Enables Optimistic Locking. Hibernate compares this value during UPDATE to prevent concurrent lost updates without pessimistic locks."));
        jpaList.add(annotationEntry("@Enumerated", "jakarta.persistence.Enumerated", "Maps Java Enum. EnumType.STRING stores the name, avoiding bugs when enum order changes."));
        jpaList.add(annotationEntry("@OneToMany", "jakarta.persistence.OneToMany", "One-to-many relationship. Parameters include mappedBy, cascade, orphanRemoval, and fetch."));
        jpaList.add(annotationEntry("@ManyToOne", "jakarta.persistence.ManyToOne", "Many-to-one relationship (the owning side). Foreign key column is defined via @JoinColumn."));
        jpaList.add(annotationEntry("@JoinColumn", "jakarta.persistence.JoinColumn", "Specifies the physical foreign key column name and constraints in SQL Server."));
        jpaList.add(annotationEntry("@MappedSuperclass", "jakarta.persistence.MappedSuperclass", "Inheritance mapping where parent class attributes are mapped onto subclass tables without a parent table."));
        jpaList.add(annotationEntry("@PrePersist / @PreUpdate", "jakarta.persistence.PrePersist", "Entity lifecycle callbacks triggered immediately before INSERT or UPDATE SQL statements are executed."));
        catalog.put("Jakarta Persistence (JPA)", jpaList);

        // 2. Jakarta Validation (Bean Validation)
        List<Map<String, String>> valList = new ArrayList<>();
        valList.add(annotationEntry("@NotNull", "jakarta.validation.constraints.NotNull", "Field must not be null (can be empty string)."));
        valList.add(annotationEntry("@NotBlank", "jakarta.validation.constraints.NotBlank", "String must not be null and must contain at least one non-whitespace character."));
        valList.add(annotationEntry("@NotEmpty", "jakarta.validation.constraints.NotEmpty", "String, Collection, Map, or Array must not be null and size > 0."));
        valList.add(annotationEntry("@Size", "jakarta.validation.constraints.Size", "Boundaries for String length or Collection size (min, max)."));
        valList.add(annotationEntry("@Min / @Max", "jakarta.validation.constraints.Min", "Numerical boundaries (inclusive) for integral values."));
        valList.add(annotationEntry("@DecimalMin / @DecimalMax", "jakarta.validation.constraints.DecimalMin", "Numerical boundaries for BigDecimal or double monetary values."));
        valList.add(annotationEntry("@Email", "jakarta.validation.constraints.Email", "Verifies valid email address format according to RFC specifications."));
        valList.add(annotationEntry("@Valid", "jakarta.validation.Valid", "Cascades validation into nested objects or collection elements."));
        catalog.put("Jakarta Bean Validation", valList);

        // 3. Jakarta CDI & Scopes
        List<Map<String, String>> cdiList = new ArrayList<>();
        cdiList.add(annotationEntry("@ApplicationScoped", "jakarta.enterprise.context.ApplicationScoped", "Single shared bean instance for the entire application lifetime. Thread safety required."));
        cdiList.add(annotationEntry("@RequestScoped", "jakarta.enterprise.context.RequestScoped", "New instance per HTTP request. Automatically destroyed when response returns."));
        cdiList.add(annotationEntry("@SessionScoped", "jakarta.enterprise.context.SessionScoped", "One instance per HTTP session. Preserved across requests from the same user."));
        cdiList.add(annotationEntry("@ConversationScoped", "jakarta.enterprise.context.ConversationScoped", "Explicit boundary scope spanning multiple pages/requests via Conversation.begin() and end()."));
        cdiList.add(annotationEntry("@Dependent", "jakarta.enterprise.context.Dependent", "Default CDI pseudo-scope. Lifecycle is tightly bound to the enclosing bean that injects it."));
        cdiList.add(annotationEntry("@PostConstruct", "jakarta.annotation.PostConstruct", "Executed after all dependency injections and bean constructor calls finish."));
        cdiList.add(annotationEntry("@PreDestroy", "jakarta.annotation.PreDestroy", "Executed right before the container discards and destroys the bean instance."));
        catalog.put("Jakarta CDI & Scopes", cdiList);

        // 4. Jakarta Transactions
        List<Map<String, String>> txList = new ArrayList<>();
        txList.add(annotationEntry("@Transactional", "jakarta.transaction.Transactional", "Demarcates transaction boundaries. Controls propagation (REQUIRED, REQUIRES_NEW, etc.) and rollbackOn."));
        catalog.put("Jakarta Transactions", txList);

        return ResponseEntity.ok(ApiResponse.ok("Jakarta EE Revision Reference", catalog));
    }

    private Map<String, String> annotationEntry(String name, String pkg, String desc) {
        Map<String, String> m = new HashMap<>();
        m.put("name", name);
        m.put("package", pkg);
        m.put("description", desc);
        return m;
    }
}

