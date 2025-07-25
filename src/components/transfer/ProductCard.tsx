"use client";
import React from "react";

export type Product = {
  id: number;
  name: string;
  primary_image?: string;
  stocks: any[];
};

type ProductCardProps = {
  products: Product[];
  onProductClick: (product: Product) => void;
};

export default function ProductCard({
  products,
  onProductClick,
}: ProductCardProps) {
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200 cursor-pointer hover:border-blue-400 group aspect-[3/4] flex flex-col items-center justify-center p-4 hover:bg-blue-50/30"
          title={product.name}
          onClick={() => onProductClick(product)}
        >
          {/* Image */}
          <div className="flex-shrink-0 flex items-center justify-center mb-2">
            {product.primary_image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}${product.primary_image}`}
                alt={product.name}
                className="w-40 h-40 object-cover rounded-lg border border-gray-200 group-hover:scale-110 transition-transform duration-200"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg border border-gray-200 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🧈</span>
              </div>
            )}
          </div>
          {/* Name */}
          <div className="text-center flex-1 min-w-0 w-full mt-1">
            <h3
              className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200 mb-2"
              title={product.name}
            >
              {product.name}
            </h3>
          </div>
        </div>
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-300 text-6xl mb-4">🧈</div>
          <p className="text-gray-400 text-base">No products found</p>
        </div>
      )}
    </div>
  );
}
