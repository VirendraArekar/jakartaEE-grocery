'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Filter, Database, Zap, BookOpen, RefreshCw } from 'lucide-react';
import { Category, Product } from '@/lib/types';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);

  const loadData = async (catId: number | null = selectedCategoryId, query: string = searchQuery) => {
    setLoading(true);
    const start = performance.now();
    try {
      const [cats, prods] = await Promise.all([
        api.getCategories(),
        api.getProducts(catId || undefined, query || undefined),
      ]);
      setCategories(cats);
      setProducts(prods);
      setLoadTimeMs(Math.round(performance.now() - start));
    } catch (err) {
      console.error('Error fetching data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategorySelect = (id: number | null) => {
    setSelectedCategoryId(id);
    loadData(id, searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(selectedCategoryId, searchQuery);
  };

  const filteredProducts = products.filter((p) => {
    if (organicOnly && !p.organic) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 opacity-15 hidden lg:block text-9xl font-black select-none tracking-tighter">
          JAKARTA EE
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fullstack Architecture &amp; Revision Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Farm-Fresh Groceries, <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Enterprise Resilience.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300">
            Powered by <strong>Spring Boot 3 (Jakarta EE)</strong>, <strong>Microsoft SQL Server</strong> with persistent storage, <strong>Redis Cache</strong> acceleration, and full <strong>Kubernetes &amp; Docker</strong> orchestration.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/jakarta-guide"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Jakarta EE Scopes &amp; Annotations</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/10 transition-all backdrop-blur-md"
            >
              <span>Manage Products &amp; Test Redis</span>
            </Link>
          </div>
        </div>

        {/* Feature Badges at bottom of hero */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2 text-gray-300">
            <Database className="w-4 h-4 text-sky-400" />
            <span>MS SQL Server (ACID + PVC)</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Redis Cache Layer</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Jakarta Persistence 3.1</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>K8s Deployments &amp; Pods</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organic apples, milk, artisan sourdough..."
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {/* Organic toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                organicOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Organic Only</span>
            </button>

            {/* Response speed timer (Redis effect indicator) */}
            {loadTimeMs !== null && (
              <span className="hidden sm:inline-flex items-center space-x-1 text-xs text-gray-400 bg-white border border-gray-100 px-2.5 py-2 rounded-xl">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Backend: {loadTimeMs} ms</span>
              </span>
            )}
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategoryId
              ? categories.find((c) => c.id === selectedCategoryId)?.name || 'Products'
              : 'All Groceries'}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 h-72 animate-pulse flex flex-col justify-between"
              >
                <div className="bg-gray-200 h-36 rounded-xl w-full" />
                <div className="space-y-2 mt-4">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                </div>
                <div className="flex justify-between items-center pt-3">
                  <div className="bg-gray-200 h-6 rounded w-1/4" />
                  <div className="bg-gray-200 h-8 rounded-xl w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No groceries found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search query, selecting another category, or disable the organic filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                setSearchQuery('');
                setOrganicOnly(false);
                loadData(null, '');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

