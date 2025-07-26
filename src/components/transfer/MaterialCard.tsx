"use client";
import React, { useEffect, useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";

type Material = {
  id: number;
  name: string;
  quantity?: number;
  image?: string;
};

type MaterialCardProps = {
  materials: Material[];
  onMaterialClick?: (material: Material) => void;
};

export default function MaterialCard({
  materials,
  onMaterialClick,
}: MaterialCardProps) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 cursor-pointer hover:border-green-400 group overflow-hidden"
            title={material.name}
            onClick={() => onMaterialClick && onMaterialClick(material)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
              {material.image ? (
                <img
                  src={
                    material.image.startsWith("http")
                      ? material.image
                      : `${process.env.NEXT_PUBLIC_IMAGE_BASE || ""}${material.image}`
                  }
                  alt={material.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                
                
                />
              ) : null}
              {/* Fallback icon - always present but hidden when image loads */}
              <div
                className={`w-full h-full flex items-center justify-center ${material.image ? "hidden" : ""}`}
              >
                {/* <div className="p-2 sm:p-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <InventoryIcon className="w-6 h-6 sm:w-8 sm:h-8 tasqsdssdext-green-600" />
                </div> */}
              </div>
              {/* Overlay on hover */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" /> */}
            </div>

            {/* Content */}
            <div className="p-2 sm:p-4">
              <h3
                className="font-semibold text-gray-900 truncate group-hover:text-green-700 transition-colors duration-200 mb-2 text-xs sm:text-sm"
                title={material.name}
              >
                {material.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 group-hover:bg-green-200 transition-colors duration-200">
                  {material.quantity || 0}
                </span>
                <div className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                  ID: {material.id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-300 text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg font-medium mb-2">
            No materials found
          </p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
