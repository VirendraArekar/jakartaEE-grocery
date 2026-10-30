'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { LiveScopesResponse } from '@/lib/types';
import {
  BookOpen,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
  RefreshCw,
  Code,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';

export default function JakartaGuidePage() {
  const [liveScopes, setLiveScopes] = useState<LiveScopesResponse | null>(null);
  const [loadingScope, setLoadingScope] = useState(false);
  const [pingCount, setPingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'scopes' | 'jpa' | 'validation' | 'cheatsheet'>('scopes');

  const fetchLiveScopes = async () => {
    setLoadingScope(true);
    try {
      const data = await api.getLiveScopes();
      setLiveScopes(data);
      setPingCount((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to query live scopes', err);
    } finally {
      setLoadingScope(false);
    }
  };

  useEffect(() => {
    fetchLiveScopes();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Jakarta EE 10 / 11 Comprehensive Revision Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Jakarta EE Annotations &amp; Scopes Masterclass
          </h1>
          <p className="text-sm sm:text-base text-indigo-200">
            Interactive guide covering CDI Bean Scopes, JPA 3.1 Relationships &amp; Lifecycle Callbacks, Bean Validation, Transactions, and Spring Boot 3 namespace migration.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-8 pt-6 border-t border-indigo-800/60">
          <button
            onClick={() => setActiveTab('scopes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scopes'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-700/50'
            }`}
          >
            1. CDI Scopes &amp; Live Demo
          </button>
          <button
            onClick={() => setActiveTab('jpa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'jpa'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-700/50'
            }`}
          >
            2. JPA Persistence Annotations
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'validation'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-700/50'
            }`}
          >
            3. Bean Validation Constraints
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cheatsheet'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-700/50'
            }`}
          >
            4. Interview Cheat Sheet &amp; Gotchas
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CDI SCOPES & LIVE DEMO */}
      {/* ========================================================================= */}
      {activeTab === 'scopes' && (
        <div className="space-y-6">
          {/* Live Scope Diagnostic Box */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <span>Live CDI / Spring Scopes Diagnostic Console</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Click the button below to issue an HTTP request to <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">/api/jakarta-guide/scopes/live</code>. Observe how RequestScoped produces a new ID on every click while ApplicationScoped retains identity!
                </p>
              </div>

              <button
                onClick={fetchLiveScopes}
                disabled={loadingScope}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loadingScope ? 'animate-spin' : ''}`} />
                <span>Send Request ({pingCount} pings)</span>
              </button>
            </div>

            {liveScopes ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Application Scoped */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      Application Scope
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">Singleton</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">@ApplicationScoped</h4>
                  <div className="text-xs space-y-1.5 font-mono text-gray-600">
                    <div>
                      <strong className="text-gray-900">Instance UUID:</strong>{' '}
                      <span className="text-indigo-600 truncate block text-[11px]">
                        {liveScopes.applicationScopedBean.instanceId}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Total Global Visits:</strong>{' '}
                      <span className="text-emerald-600 font-bold text-sm">
                        {liveScopes.applicationScopedBean.totalVisitsAcrossAllUsers}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 pt-2 border-t border-slate-200">
                    {liveScopes.applicationScopedBean.description}
                  </p>
                </div>

                {/* Request Scoped */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Request Scope
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">New per Ping</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">@RequestScoped</h4>
                  <div className="text-xs space-y-1.5 font-mono text-gray-600">
                    <div>
                      <strong className="text-gray-900">Request UUID:</strong>{' '}
                      <span className="text-emerald-700 truncate block text-[11px]">
                        {liveScopes.requestScopedBean.requestId}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Spawned At:</strong>{' '}
                      <span className="text-gray-600 text-[11px]">
                        {liveScopes.requestScopedBean.createdAt?.split('T')[1]}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 pt-2 border-t border-slate-200">
                    {liveScopes.requestScopedBean.description}
                  </p>
                </div>

                {/* Session Scoped */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Session Scope
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">Per User</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">@SessionScoped</h4>
                  <div className="text-xs space-y-1.5 font-mono text-gray-600">
                    <div>
                      <strong className="text-gray-900">Session UUID:</strong>{' '}
                      <span className="text-amber-700 truncate block text-[11px]">
                        {liveScopes.sessionScopedBean.sessionId}
                      </span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Requests in Session:</strong>{' '}
                      <span className="text-indigo-600 font-bold">
                        {liveScopes.sessionScopedBean.requestsInThisSession}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 pt-2 border-t border-slate-200">
                    {liveScopes.sessionScopedBean.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs">Connecting to backend CDI endpoints...</div>
            )}
          </div>

          {/* Scopes Comparison Table */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Comprehensive Jakarta EE CDI vs Spring Framework Scope Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                    <th className="p-3">Jakarta CDI Annotation</th>
                    <th className="p-3">Spring Boot Equivalent</th>
                    <th className="p-3">Lifecycle &amp; Scope Boundary</th>
                    <th className="p-3">Thread Safety Requirement</th>
                    <th className="p-3">Common Real-World Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-700">@ApplicationScoped</td>
                    <td className="p-3 font-mono text-gray-800">@ApplicationScope / Singleton</td>
                    <td className="p-3">Matches entire application JVM lifetime</td>
                    <td className="p-3 text-rose-600 font-semibold">Must be Thread-Safe (concurrent)</td>
                    <td className="p-3">Stateless Services, Cache Repositories, Configs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">@RequestScoped</td>
                    <td className="p-3 font-mono text-gray-800">@RequestScope</td>
                    <td className="p-3">Bound to a single HTTP request-response cycle</td>
                    <td className="p-3 text-emerald-600 font-semibold">Thread-Safe by default (1 thread)</td>
                    <td className="p-3">Request context, audit correlation IDs, tracing tokens</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-amber-700">@SessionScoped</td>
                    <td className="p-3 font-mono text-gray-800">@SessionScope</td>
                    <td className="p-3">Bound to user&apos;s HTTP session across multiple requests</td>
                    <td className="p-3 text-amber-600 font-semibold">Must implement Serializable</td>
                    <td className="p-3">Shopping cart state, multi-step wizards, user auth info</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-purple-700">@ConversationScoped</td>
                    <td className="p-3 font-mono text-gray-800">Custom Spring Scope / Flash</td>
                    <td className="p-3">Explicit boundaries: conversation.begin() / end()</td>
                    <td className="p-3 text-purple-600 font-semibold">Must implement Serializable</td>
                    <td className="p-3">Multi-step checkout (Step 1 &rarr; Step 2 &rarr; Payment)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-gray-700">@Dependent (Default)</td>
                    <td className="p-3 font-mono text-gray-800">@Scope(&quot;prototype&quot;)</td>
                    <td className="p-3">Tied directly to the lifecycle of the injecting bean</td>
                    <td className="p-3">Inherits target bean&apos;s concurrency rules</td>
                    <td className="p-3">Non-reusable helper objects, transient data builders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: JPA PERSISTENCE ANNOTATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'jpa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-indigo-700">
              <Database className="w-5 h-5" />
              <h3 className="font-bold text-base text-gray-900">Entity &amp; Primary Key Mapping</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@Entity</span>
                <p className="text-gray-600">
                  Specifies that the class is a Jakarta JPA entity. Requirements: public no-arg constructor, non-final class, and an @Id field.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@Table(name, indexes, uniqueConstraints)</span>
                <p className="text-gray-600">
                  Configures the underlying SQL Server table name, schemas, and clustered/non-clustered indexes.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@GeneratedValue(strategy = IDENTITY)</span>
                <p className="text-gray-600">
                  Relies on MS SQL Server&apos;s native <code className="font-mono bg-white px-1">IDENTITY(1,1)</code> auto-increment column. Contrast with SEQUENCE (Oracle/PostgreSQL) and AUTO.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-emerald-600 text-sm">@Version (Optimistic Locking)</span>
                <p className="text-gray-600">
                  Automates concurrency check without row locks. Hibernate adds <code className="font-mono bg-white px-1">WHERE version = :currentVersion</code> during UPDATE. If row was already changed, throws <code className="font-mono bg-white px-1">OptimisticLockException</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-emerald-700">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-base text-gray-900">Relationships &amp; Cascade Semantics</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@ManyToOne(fetch = FetchType.LAZY / EAGER)</span>
                <p className="text-gray-600">
                  The owning side of the association that contains the foreign key column. Always pair with <code className="font-mono bg-white px-1">@JoinColumn(name = &quot;..._id&quot;)</code>.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@OneToMany(mappedBy = &quot;...&quot;, orphanRemoval = true)</span>
                <p className="text-gray-600">
                  The inverse side. <code className="font-mono bg-white px-1">mappedBy</code> specifies the field in the child entity. Setting <code className="font-mono bg-white px-1">orphanRemoval = true</code> automatically issues a DELETE statement if an item is removed from the collection.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@Enumerated(EnumType.STRING)</span>
                <p className="text-gray-600">
                  Persists enum constant name as VARCHAR. <em>Never use ORDINAL in production:</em> reordering or inserting enum values causes silent, catastrophic database data corruption!
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-indigo-600 text-sm">@PrePersist &amp; @PreUpdate</span>
                <p className="text-gray-600">
                  Lifecycle callback methods in <code className="font-mono bg-white px-1">@MappedSuperclass BaseEntity</code> automatically updating <code className="font-mono bg-white px-1">createdAt</code> and <code className="font-mono bg-white px-1">updatedAt</code> timestamps before SQL execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BEAN VALIDATION */}
      {/* ========================================================================= */}
      {activeTab === 'validation' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Jakarta Bean Validation 3.0 (<code className="font-mono text-emerald-700">jakarta.validation.*</code>)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Standardized declarative validation executed at Controller request binding (@Valid) and EntityManager persist time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@NotNull</span>
              <p className="text-gray-600">Value must not be null. (Empty string &quot;&quot; is accepted!).</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@NotEmpty</span>
              <p className="text-gray-600">Target string, Collection, Map, or array cannot be null and length/size &gt; 0.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@NotBlank</span>
              <p className="text-gray-600">String must not be null and must contain at least one non-whitespace character.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@Size(min, max)</span>
              <p className="text-gray-600">Validates length of Strings or element count of Collections/Arrays.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@DecimalMin / @DecimalMax</span>
              <p className="text-gray-600">Strict boundary checking for BigDecimal monetary fields (e.g., &gt;= 0.01).</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@PositiveOrZero</span>
              <p className="text-gray-600">Ensures integer stock quantity is greater than or equal to 0.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@Email</span>
              <p className="text-gray-600">Verifies customer email format according to RFC 5322 specs.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@Pattern(regexp)</span>
              <p className="text-gray-600">Custom regular expression validation (e.g. international phone formats).</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-mono font-bold text-emerald-700 text-sm">@Valid</span>
              <p className="text-gray-600">Cascades validation into nested DTOs (e.g. OrderRequest -&gt; List&lt;OrderItemRequest&gt;).</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CHEATSHEET & INTERVIEW GOTCHAS */}
      {/* ========================================================================= */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gotcha 1: N+1 Problem */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <HelpCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-gray-900">JPA Interview Gotcha: The N+1 Problem</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                When fetching 100 Categories with lazy-loaded Products, iterating over each triggers 100 additional queries (<code className="bg-gray-100 px-1 font-mono">1 + N queries</code>), destroying DB throughput.
              </p>
              <div className="p-3 bg-gray-950 text-emerald-400 font-mono text-[11px] rounded-xl">
                // Solution: Use JPQL JOIN FETCH in Repository<br />
                @Query(&quot;SELECT c FROM Category c LEFT JOIN FETCH c.products WHERE c.id = :id&quot;)
              </div>
            </div>

            {/* Gotcha 2: Javax vs Jakarta */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-indigo-600">
                <HelpCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-gray-900">Migration: javax.* vs jakarta.*</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Starting with <strong>Spring Boot 3</strong> and <strong>Jakarta EE 9+</strong>, Oracle transferred Java EE rights to the Eclipse Foundation. All packages changed from <code className="bg-gray-100 px-1 font-mono">javax.persistence.*</code> to <code className="bg-gray-100 px-1 font-mono">jakarta.persistence.*</code>.
              </p>
              <div className="p-3 bg-gray-950 text-indigo-300 font-mono text-[11px] rounded-xl">
                import jakarta.persistence.*;<br />
                import jakarta.validation.constraints.*;<br />
                import jakarta.transaction.Transactional;
              </div>
            </div>

            {/* Gotcha 3: Optimistic vs Pessimistic */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-amber-600">
                <HelpCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-gray-900">Optimistic vs Pessimistic Locking</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Optimistic (@Version):</strong> Assumes conflicts are rare. No locks held. Throws OptimisticLockException on commit if modified. Ideal for web browsing.<br />
                <strong>Pessimistic (LockModeType.PESSIMISTIC_WRITE):</strong> Locks row in SQL Server via <code className="bg-gray-100 px-1 font-mono">WITH (UPDLOCK, ROWLOCK)</code>. Used during checkout to prevent negative inventory.
              </p>
            </div>

            {/* Gotcha 4: Cascade vs orphanRemoval */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-teal-600">
                <HelpCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-gray-900">CascadeType.REMOVE vs orphanRemoval = true</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>CascadeType.REMOVE:</strong> If parent Order is deleted, all its OrderItems are deleted.<br />
                <strong>orphanRemoval = true:</strong> If an OrderItem is removed from <code className="bg-gray-100 px-1 font-mono">order.getItems().remove(item)</code>, JPA issues an immediate SQL DELETE for that detached child!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

