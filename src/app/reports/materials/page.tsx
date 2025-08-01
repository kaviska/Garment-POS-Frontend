"use client";
import { useState } from "react";
import Title from "@/components/main/Title";

export default function MaterialReport() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reports/material-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
        }
      );

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
        if (iframe.contentWindow) {
          iframe.contentWindow.onafterprint = () => {
            document.body.removeChild(iframe);
          };
        }
      };
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title
        title="Material Report"
        breadCrumbs={[
          { label: "Materials", href: "/materials" },
          { label: "Reports", href: "/reports/materials" },
        ]}
        active="Material Report"
      />
      <div className="max-w-lg mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="submit"
            className="w-full bg-green-600 cursor-pointer text-white py-2 px-4 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
          Generate Material Report
          </button>
        </form>
      </div>
    </div>
  );
}