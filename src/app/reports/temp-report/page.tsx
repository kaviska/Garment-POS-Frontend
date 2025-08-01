"use client";
import { useState } from "react";
import Title from "@/components/main/Title";

export default function TransferReport() {
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (index: number, value: string) => {
    setDateRange((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated as [string, string];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reports/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
          body: JSON.stringify({
            date_range:
              dateRange[0] && dateRange[1]
                ? [dateRange[0], dateRange[1]]
                : undefined,
          }),
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
      console.error("Error fetching transfer report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title
        title="Transfer Report"
        breadCrumbs={[
          { label: "Transfers", href: "/transfers" },
          { label: "Reports", href: "/reports/transfer" },
        ]}
        active="Transfer Report"
      />
      <div className="max-w-lg mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange[0]}
                onChange={(e) => handleDateChange(0, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange[1]}
               onChange={(e) => handleDateChange(1, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 cursor-pointer text-white py-2 px-4 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {loading ? "Generating..." : "Generate Transfer Report"}
          </button>
        </form>
      </div>
    </div>
  );
}