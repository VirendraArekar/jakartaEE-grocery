'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, Leaf, AlertCircle, Code } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.organic && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 backdrop-blur-sm text-white shadow-sm">
            <Leaf className="w-3 h-3" />
            <span>Organic</span>
          </span>
        )}
        {product.categoryName && (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-900/60 backdrop-blur-sm text-white">
            {product.categoryName}
          </span>
        )}
      </div>

      {/* Jakarta EE hint button */}
      <button
        onClick={() => setShowAnnotation(!showAnnotation)}
        title="View Jakarta JPA Mapping for this Entity"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-indigo-600 shadow-sm backdrop-blur-sm transition-colors"
      >
        <Code className="w-4 h-4" />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            No Image
          </div>
        )}

        {/* Overlay showing Jakarta JPA mapping details */}
        {showAnnotation && (
          <div className="absolute inset-0 bg-gray-950/90 text-white p-3 text-[11px] font-mono overflow-y-auto z-20 flex flex-col justify-between">
            <div>
              <div className="text-emerald-400 font-bold mb-1">Jakarta Persistence (JPA)</div>
              <div className="text-gray-300">@Entity @Table(name=&quot;products&quot;)</div>
              <div className="text-gray-400">@Id @GeneratedValue(IDENTITY)</div>
              <div className="text-gray-400">@Version private Long version;</div>
              <div className="text-gray-400">@Column(precision=10, scale=2)</div>
              <div className="text-indigo-300">@Enumerated(EnumType.STRING) {product.unit}</div>
              <div className="text-teal-300">@ManyToOne @JoinColumn(category_id)</div>
            </div>
            <button
              onClick={() => setShowAnnotation(false)}
              className="mt-2 text-xs text-right text-gray-400 hover:text-white underline"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {product.description || 'Freshly stocked premium grocery item.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                / {product.unit.toLowerCase()}
              </span>
            </div>

            {/* Stock indicator */}
            <div className="text-[11px] font-medium mt-0.5">
              {isOutOfStock ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-amber-600">Only {product.stockQuantity} left</span>
              ) : (
                <span className="text-emerald-600">In Stock ({product.stockQuantity})</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow active:scale-95'
            }`}
          >
            {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

