"use client";
import React, { useEffect, useState } from "react";

type Material = {
  id: number;
  name: string;
  quantity?: number;
  image?: string;
};

type MaterialCardProps = {
  materials: Material[];
};

export default function MaterialCard({ materials }: MaterialCardProps) {
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
      {materials.map((material) => (
        <div
          key={material.id}
          className="bg-white  rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200 cursor-pointer hover:border-blue-400 group aspect-[3/4] flex flex-col items-center justify-center p-4 hover:bg-blue-50/30"
          title={material.name}
        >
          {/* Image */}
          <div className="flex-shrink-0 flex items-center justify-center mb-2">
            {material.image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}${material.image}`}
                alt={material.name}
                className="w-40 h-40 object-cover rounded-lg border border-gray-200 group-hover:scale-110 transition-transform duration-200"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg border border-gray-200 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🧵</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-center flex-1 min-w-0 w-full mt-1">
            <h3
              className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200 mb-2"
              title={material.name}
            >
              {material.name}
            </h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {material.quantity || 0} in stock
            </span>
          </div>
        </div>
      ))}

      {materials.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-300 text-6xl mb-4">📦</div>
          <p className="text-gray-400 text-base">No materials found</p>
        </div>
      )}
    </div>
  );
}
