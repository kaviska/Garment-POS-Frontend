"use client";
import React from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export type Product = {
  id: number;
  name: string;
  primary_image?: string;
  stocks: any[];
};

type ProductCardProps = {
  products: Product[];
  onProductClick?: (product: Product) => void;
};

export default function ProductCard({
  products,
  onProductClick,
}: ProductCardProps) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 cursor-pointer hover:border-purple-400 group overflow-hidden"
            title={product.name}
            onClick={() => onProductClick && onProductClick(product)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50">
              {product.primary_image ? (
                <img
                  src={
                    product.primary_image.startsWith("http")
                      ? product.primary_image
                      : `${process.env.NEXT_PUBLIC_IMAGE_BASE || ""}${product.primary_image}`                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                 
                />
              ) : null}
              {/* Fallback icon - always present but hidden when image loads */}
              <div
                className={`w-full h-full flex items-center justify-center ${product.primary_image ? "hidden" : ""}`}
              >
                {/* <div className="p-2 sm:p-4 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div> */}
              </div>
              {/* Overlay on hover */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" /> */}

              {/* Stock count badge */}
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 backdrop-blur-sm">
                  {product.stocks.length}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-2 sm:p-4">
              <h3
                className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-200 mb-2 text-xs sm:text-sm"
                title={product.name}
              >
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors duration-200">
                  ID: {product.id}
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">
                  Click to select
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-300 text-6xl mb-4">🧈</div>
          <p className="text-gray-500 text-lg font-medium mb-2">
            No products found
          </p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
