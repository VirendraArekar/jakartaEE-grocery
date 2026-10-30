package com.grocery.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.ApplicationScope;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.context.annotation.SessionScope;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: CDI Bean Scopes & Lifecycle Callbacks
 * ============================================================================
 * 1. Scopes in Jakarta EE (CDI Specification):
 *    - @ApplicationScoped (jakarta.enterprise.context.ApplicationScoped):
 *        * Lifetime: Matches application lifecycle. Shared across all users/threads.
 *        * Spring Equivalent: @ApplicationScope or default Singleton.
 *    - @RequestScoped (jakarta.enterprise.context.RequestScoped):
 *        * Lifetime: Spans a single HTTP request-response cycle. Destroyed when request finishes.
 *        * Spring Equivalent: @RequestScope.
 *    - @SessionScoped (jakarta.enterprise.context.SessionScoped):
 *        * Lifetime: Bound to an HTTP session. State preserved across multiple requests from same user.
 *        * Spring Equivalent: @SessionScope.
 *    - @ConversationScoped:
 *        * Unique to Jakarta EE / JSF: Spans multiple requests demarcated by begin() and end().
 *    - @Dependent (Default CDI pseudo-scope):
 *        * Created new whenever injected into another bean. No shared proxy.
 *        * Spring Equivalent: Prototype scope (@Scope("prototype")).
 *
 * 2. Jakarta Lifecycle Annotations:
 *    - @PostConstruct (jakarta.annotation.PostConstruct):
 *        * Invoked right after dependency injection is complete and bean is initialized.
 *    - @PreDestroy (jakarta.annotation.PreDestroy):
 *        * Invoked right before the bean container releases and destroys the bean instance.
 * ============================================================================
 */
public class JakartaScopeDemoService {

    private static final Logger log = LoggerFactory.getLogger(JakartaScopeDemoService.class);

    // ==========================================
    // 1. APPLICATION SCOPED BEAN
    // ==========================================
    @Service
    @ApplicationScope
    public static class AppScopedBean {
        private final String instanceId = UUID.randomUUID().toString();
        private final LocalDateTime initializedAt = LocalDateTime.now();
        private int visitCounter = 0;

        @PostConstruct
        public void init() {
            log.info("[@PostConstruct] AppScopedBean initialized with ID: {}", instanceId);
        }

        @PreDestroy
        public void cleanup() {
            log.info("[@PreDestroy] AppScopedBean destroying: {}", instanceId);
        }

        public synchronized int incrementAndGetVisits() {
            return ++visitCounter;
        }

        public Map<String, Object> getScopeInfo() {
            Map<String, Object> info = new HashMap<>();
            info.put("scope", "Jakarta @ApplicationScoped (Spring @ApplicationScope / Singleton)");
            info.put("instanceId", instanceId);
            info.put("initializedAt", initializedAt.toString());
            info.put("totalVisitsAcrossAllUsers", incrementAndGetVisits());
            info.put("description", "Single instance shared across the entire application and all concurrent user threads.");
            return info;
        }
    }

    // ==========================================
    // 2. REQUEST SCOPED BEAN
    // ==========================================
    @Service
    @RequestScope
    public static class RequestScopedBean {
        private final String requestId = UUID.randomUUID().toString();
        private final LocalDateTime createdAt = LocalDateTime.now();

        @PostConstruct
        public void init() {
            log.info("[@PostConstruct] RequestScopedBean spawned for HTTP request: {}", requestId);
        }

        @PreDestroy
        public void cleanup() {
            log.info("[@PreDestroy] RequestScopedBean being destroyed at request completion: {}", requestId);
        }

        public Map<String, Object> getScopeInfo() {
            Map<String, Object> info = new HashMap<>();
            info.put("scope", "Jakarta @RequestScoped (Spring @RequestScope)");
            info.put("requestId", requestId);
            info.put("createdAt", createdAt.toString());
            info.put("description", "A fresh new instance is instantiated for each incoming HTTP request and destroyed when done.");
            return info;
        }
    }

    // ==========================================
    // 3. SESSION SCOPED BEAN
    // ==========================================
    @Service
    @SessionScope
    public static class SessionScopedBean {
        private final String sessionId = UUID.randomUUID().toString();
        private final LocalDateTime sessionStarted = LocalDateTime.now();
        private int requestCountInSession = 0;

        @PostConstruct
        public void init() {
            log.info("[@PostConstruct] SessionScopedBean started for user session: {}", sessionId);
        }

        @PreDestroy
        public void cleanup() {
            log.info("[@PreDestroy] SessionScopedBean invalidated on session expiry: {}", sessionId);
        }

        public Map<String, Object> getScopeInfo() {
            requestCountInSession++;
            Map<String, Object> info = new HashMap<>();
            info.put("scope", "Jakarta @SessionScoped (Spring @SessionScope)");
            info.put("sessionId", sessionId);
            info.put("sessionStarted", sessionStarted.toString());
            info.put("requestsInThisSession", requestCountInSession);
            info.put("description", "Maintains state across multiple requests from the same HTTP user session (e.g. shopping cart state).");
            return info;
        }
    }
}

