'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Category, Product, ProductUnit } from '@/lib/types';
import { Layers, Plus, Trash2, ArrowUpRight, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '3.99',
    stockQuantity: '50',
    unit: 'KG' as ProductUnit,
    imageUrl: '',
    organic: false,
    categoryId: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
      if (cats.length > 0 && !form.categoryId) {
        setForm((prev) => ({ ...prev, categoryId: cats[0].id.toString() }));
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load inventory' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockUpdate = async (productId: number, delta: number) => {
    try {
      const updated = await api.updateStock(productId, delta);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updated : p))
      );
      setMessage({
        type: 'success',
        text: `Updated stock for "${updated.name}". Redis cache evicted automatically!`,
      });
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Stock update failed' });
    }
  };

  const handleDelete = async (productId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setMessage({ type: 'success', text: `Product "${name}" deleted successfully.` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Product> = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        unit: form.unit,
        imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
        organic: form.organic,
        categoryId: parseInt(form.categoryId, 10),
      };

      await api.createProduct(payload);
      setShowAddModal(false);
      setForm({
        name: '',
        description: '',
        price: '3.99',
        stockQuantity: '50',
        unit: 'KG',
        imageUrl: '',
        organic: false,
        categoryId: categories[0]?.id.toString() || '',
      });
      setMessage({
        type: 'success',
        text: 'Product successfully created and persisted in MS SQL Server! Redis cache refreshed.',
      });
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Validation failed on server' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>Grocery Inventory &amp; Cache Manager</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Test Jakarta Validation rules (@NotBlank, @DecimalMin) and observe Redis cache invalidation (@CacheEvict) upon inventory mutation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center space-x-3 text-sm animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          )}
          <span className="flex-1 font-medium">{message.text}</span>
        </div>
      )}

      {/* Redis Cache Note Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex items-start space-x-3">
        <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-xs text-amber-900 space-y-1">
          <h4 className="font-bold text-sm text-amber-950">Active Redis 7.x In-Memory Caching</h4>
          <p>
            Catalog queries (<code className="bg-white/80 px-1 py-0.5 rounded font-mono">@Cacheable</code>) are cached in Redis with a 15-minute TTL.
            Clicking restock buttons or adding items immediately triggers <code className="bg-white/80 px-1 py-0.5 rounded font-mono">@CacheEvict(allEntries=true)</code>, demonstrating real-world cache coherency.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Unit</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4 text-center">Quick Restock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Loading inventory data...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No products found. Click &apos;Add New Product&apos; above.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                              Item
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center space-x-1.5">
                            <span>{product.name}</span>
                            {product.organic && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                BIO
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">ID: #{product.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.categoryName || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      ${product.price.toFixed(2)}{' '}
                      <span className="text-xs text-gray-400 font-normal">
                        / {product.unit.toLowerCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.stockQuantity <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : product.stockQuantity < 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.stockQuantity} in stock
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleStockUpdate(product.id, 5)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
                          title="Restock +5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleStockUpdate(product.id, 25)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
                          title="Restock +25 units"
                        >
                          +25
                        </button>
                        <button
                          onClick={() => handleStockUpdate(product.id, -1)}
                          disabled={product.stockQuantity <= 0}
                          className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-bold transition-colors"
                          title="Decrement -1 unit"
                        >
                          -1
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Add New Grocery Product</h2>
            <p className="text-xs text-gray-500">
              Validates inputs against Jakarta EE annotations (@NotBlank, @NotNull, @DecimalMin).
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name (@NotBlank, 2-120 chars)
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Organic Blueberries"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (@DecimalMin &gt;= 0.01)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Initial Stock (@PositiveOrZero)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category (@ManyToOne)
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Unit (@Enumerated)
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value as ProductUnit })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="KG">KG</option>
                    <option value="GRAM">GRAM</option>
                    <option value="PIECE">PIECE</option>
                    <option value="LITER">LITER</option>
                    <option value="PACKET">PACKET</option>
                    <option value="DOZEN">DOZEN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Fresh organic produce sourced directly from farmers."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="organic"
                  checked={form.organic}
                  onChange={(e) => setForm({ ...form, organic: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor="organic" className="text-xs font-medium text-gray-700">
                  Certified Organic Produce
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                >
                  Save to MS SQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

