"use client";
import MaterialCard from "@/components/transfer/MaterialCard";
import ProductCard, { Product } from "@/components/transfer/ProductCard";
import ProductAddModal from "@/components/transfer/ProductAddModal";
import StockAddModal from "@/components/transfer/StockAddModal";
import MaterialAddModal from "@/components/transfer/MaterialAddModal";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

type Material = {
  id: number;
  name: string;
  description?: string;
  type?: string;
  unit?: string;
  cost?: number;
  quantity?: number;
  supplier?: string;
  gsm?: string;
  color?: string;
  image?: string;
};

type Supplier = {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  bank_name?: string;
  bank_account_number?: string;
  created_at: string;
  updated_at: string;
};

// Add type for selected item
type SelectedItem = {
  id: number;
  name: string;
  type: "material" | "product";
  quantity: number;
  price: number;
  small?: string;
  medium?: string;
  large?: string;
  xlarge?: string;
  xxlarge?: string;
};

export default function Main() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productPage, setProductPage] = useState(1);
  const PRODUCT_PAGE_SIZE = 10;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);

  // Selected items state (synced with localStorage)
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("selectedItems");
      return data ? JSON.parse(data) : [];
    }
    return [];
  });
  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    }
  }, [selectedItems]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/materials`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch materials");
        return res.json();
      })
      .then((data) => {
        setMaterials(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch products
  useEffect(() => {
    setProductLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products?with=all`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.data || []);
        setProductLoading(false);
      })
      .catch((err) => {
        setProductError(err.message);
        setProductLoading(false);
      });
  }, []);

  // Fetch suppliers
  useEffect(() => {
    setSupplierLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/suppliers`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        return res.json();
      })
      .then((data) => {
        setSuppliers(data.data || []);
        setSupplierLoading(false);
      })
      .catch((err) => {
        setSupplierError(err.message);
        setSupplierLoading(false);
      });
  }, []);

  // Filter materials by search
  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / PAGE_SIZE);
  const paginatedMaterials = filteredMaterials.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  // Reset to page 1 if search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Filter and paginate products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );
  const productTotalPages = Math.ceil(
    filteredProducts.length / PRODUCT_PAGE_SIZE
  );
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * PRODUCT_PAGE_SIZE,
    productPage * PRODUCT_PAGE_SIZE
  );
  useEffect(() => {
    setProductPage(1);
  }, [productSearch]);

  // Modal open handler
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowStockModal(true);
  };
  const closeModal = () => {
    setShowStockModal(false);
    setSelectedProduct(null);
  };

  // Material click handler
  const handleMaterialClick = (material: Material) => {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (item) => item.id === material.id && item.type === "material"
      );
      if (exists) {
        // Increase quantity
        return prev.map((item) =>
          item.id === material.id && item.type === "material"
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: material.id,
            name: material.name,
            type: "material",
            quantity: 1,
            price: material.cost || 0,
          },
        ];
      }
    });
  };

  // Product stock click handler (for modal)
  const handleStockClick = (stock: any, product: Product) => {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (item) => item.id === stock.id && item.type === "product"
      );
      if (exists) {
        // Increase quantity
        return prev.map((item) =>
          item.id === stock.id && item.type === "product"
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: stock.id,
            name: product.name,
            type: "product",
            quantity: 1,
            price: stock.pos_price || 0,
            small: "",
            medium: "",
            large: "",
            xlarge: "",
            xxlarge: "",
          },
        ];
      }
    });
    closeModal();
  };

  // Transfer modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferDescription, setTransferDescription] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState("");

  // Supplier state
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierLoading, setSupplierLoading] = useState(true);
  const [supplierError, setSupplierError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | "">("");

  // Add modals state
  const [showProductAddModal, setShowProductAddModal] = useState(false);
  const [showStockAddModal, setShowStockAddModal] = useState(false);
  const [showMaterialAddModal, setShowMaterialAddModal] = useState(false);

  // Transfer submit handler
  async function handleTransferSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTransferLoading(true);
    setTransferError("");
    try {
      // Prepare payload
      const transfer_items = selectedItems.map((item) => ({
        id_cloth: item.type === "product" ? String(item.id) : "",
        id_material: item.type === "material" ? String(item.id) : "",
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        small: Number(item.small) || 0,
        medium: Number(item.medium) || 0,
        large: Number(item.large) || 0,
        xlarge: Number(item.xlarge) || 0,
        xxlarge: Number(item.xxlarge) || 0,
      }));
      const payload = {
        description: transferDescription,
        supplier_id: selectedSupplier,
        transfer_items,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/tranfers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to transfer");
      const blob = await res.blob();
      // Open PDF in new tab
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setShowTransferModal(false);
      setTransferDescription("");
      setSelectedSupplier("");
      setSelectedItems([]);
    } catch (err: any) {
      setTransferError(err.message || "Transfer failed");
    } finally {
      setTransferLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <InventoryIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Transfer Management
              </h1>
              <p className="text-sm text-gray-500">
                Select materials and products for transfer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Selected:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              {selectedItems.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Add Buttons Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowProductAddModal(true)}
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <AddIcon className="w-4 h-4" />
            Add Product
          </button>
          <button
            onClick={() => setShowStockAddModal(true)}
            className="px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <AddIcon className="w-4 h-4" />
            Add Stock
          </button>
          <button
            onClick={() => setShowMaterialAddModal(true)}
            className="px-4 py-2 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <AddIcon className="w-4 h-4" />
            Add Material
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Materials Section */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <InventoryIcon className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Materials</h2>
            </div>
            {/* Enhanced Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search materials..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading materials...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-600 text-sm">Error: {error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto min-h-0">
                  <MaterialCard
                    materials={paginatedMaterials}
                    onMaterialClick={handleMaterialClick}
                  />
                </div>
                {/* Enhanced Pagination */}
                {filteredMaterials.length > PAGE_SIZE && (
                  <div className="p-4 border-t border-gray-100 flex-shrink-0">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((num) => (
                          <button
                            key={num}
                            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                              num === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setPage(num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <button
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <ShoppingBagIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            </div>
            {/* Enhanced Product Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {productLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading products...</p>
                </div>
              </div>
            ) : productError ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-600 text-sm">Error: {productError}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto min-h-0">
                  <ProductCard
                    products={paginatedProducts}
                    onProductClick={handleProductClick}
                  />
                </div>
                {/* Enhanced Product Pagination */}
                {filteredProducts.length > PRODUCT_PAGE_SIZE && (
                  <div className="p-4 border-t border-gray-100 flex-shrink-0">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => setProductPage(productPage - 1)}
                        disabled={productPage === 1}
                      >
                        Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from(
                          { length: productTotalPages },
                          (_, i) => i + 1
                        ).map((num) => (
                          <button
                            key={num}
                            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                              num === productPage
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setProductPage(num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <button
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        onClick={() => setProductPage(productPage + 1)}
                        disabled={productPage === productTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Selected Items Section - Always Visible */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Items
              </h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {selectedItems.length} items
              </span>
            </div>
            {selectedItems.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowTransferModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
                startIcon={<InventoryIcon className="w-4 h-4" />}
              >
                Transfer Items
              </Button>
            )}
          </div>

          {selectedItems.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-gray-300 text-4xl mb-3">📦</div>
              <p className="text-gray-500 text-sm">No items selected</p>
              <p className="text-gray-400 text-xs mt-1">
                Select materials and products from above
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        ID
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        Name
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        Type
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        Quantity
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        Price
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        Small
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        Medium
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        Large
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        XLarge
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        XXLarge
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, idx) => (
                      <tr
                        key={item.type + "-" + item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                          {item.id}
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3 font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === "material"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3">
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                              onClick={() =>
                                setSelectedItems((items) =>
                                  items.map((it, i) =>
                                    i === idx
                                      ? {
                                          ...it,
                                          quantity: Math.max(
                                            1,
                                            it.quantity - 1
                                          ),
                                        }
                                      : it
                                  )
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => {
                                const value = Math.max(
                                  1,
                                  Number(e.target.value)
                                );
                                setSelectedItems((items) =>
                                  items.map((it, i) =>
                                    i === idx ? { ...it, quantity: value } : it
                                  )
                                );
                              }}
                              className="w-16 border border-gray-300 rounded-lg text-center px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                              onClick={() =>
                                setSelectedItems((items) =>
                                  items.map((it, i) =>
                                    i === idx
                                      ? { ...it, quantity: it.quantity + 1 }
                                      : it
                                  )
                                )
                              }
                            >
                              <AddIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3 text-center text-sm font-medium text-gray-900">
                          LKR {item.price}
                        </td>
                        {item.type === "product" ? (
                          <>
                            {[
                              "small",
                              "medium",
                              "large",
                              "xlarge",
                              "xxlarge",
                            ].map((size) => (
                              <td
                                className="border-b border-gray-100 px-4 py-3"
                                key={size}
                              >
                                <input
                                  type="number"
                                  min={0}
                                  value={item[size as keyof SelectedItem] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedItems((items) =>
                                      items.map((it, i) =>
                                        i === idx
                                          ? { ...it, [size]: value }
                                          : it
                                      )
                                    );
                                  }}
                                  className="w-16 border border-gray-300 rounded-lg text-center px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </td>
                            ))}
                          </>
                        ) : (
                          <>
                            <td
                              className="border-b border-gray-100 px-4 py-3 text-center text-gray-300"
                              colSpan={5}
                            >
                              N/A
                            </td>
                          </>
                        )}
                        <td className="border-b border-gray-100 px-4 py-3 text-center">
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                            onClick={() =>
                              setSelectedItems((items) =>
                                items.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {selectedItems.map((item, idx) => (
                  <div
                    key={item.type + "-" + item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === "material"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {item.id} • Price: LKR {item.price}
                        </div>
                      </div>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                        onClick={() =>
                          setSelectedItems((items) =>
                            items.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() =>
                            setSelectedItems((items) =>
                              items.map((it, i) =>
                                i === idx
                                  ? {
                                      ...it,
                                      quantity: Math.max(1, it.quantity - 1),
                                    }
                                  : it
                              )
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value));
                            setSelectedItems((items) =>
                              items.map((it, i) =>
                                i === idx ? { ...it, quantity: value } : it
                              )
                            );
                          }}
                          className="w-16 border border-gray-300 rounded-lg text-center px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() =>
                            setSelectedItems((items) =>
                              items.map((it, i) =>
                                i === idx
                                  ? { ...it, quantity: it.quantity + 1 }
                                  : it
                              )
                            )
                          }
                        >
                          <AddIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {item.type === "product" && (
                      <div className="grid grid-cols-5 gap-2">
                        {["S", "M", "L", "XL", "XXL"].map((size, sizeIdx) => (
                          <div key={size} className="text-center">
                            <label className="block text-xs text-gray-600 mb-1">
                              {size}
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={
                                item[
                                  [
                                    "small",
                                    "medium",
                                    "large",
                                    "xlarge",
                                    "xxlarge",
                                  ][sizeIdx] as keyof SelectedItem
                                ] || ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                const sizeKey = [
                                  "small",
                                  "medium",
                                  "large",
                                  "xlarge",
                                  "xxlarge",
                                ][sizeIdx];
                                setSelectedItems((items) =>
                                  items.map((it, i) =>
                                    i === idx ? { ...it, [sizeKey]: value } : it
                                  )
                                );
                              }}
                              className="w-full border border-gray-300 rounded-lg text-center px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stock Modal */}
      <Modal
        open={showStockModal && !!selectedProduct}
        onClose={closeModal}
        aria-labelledby="stock-modal-title"
        aria-describedby="stock-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 0,
            minWidth: 320,
            maxWidth: 480,
            width: "90%",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-bold text-gray-900"
                id="stock-modal-title"
              >
                {selectedProduct?.name} Stocks
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={closeModal}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {selectedProduct && (
              <div className="space-y-4">
                {selectedProduct.stocks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-300 text-4xl mb-3">📦</div>
                    <p className="text-gray-500 text-sm">No stock available</p>
                  </div>
                )}
                {selectedProduct.stocks.length === 1 && (
                  <StockCard
                    stock={selectedProduct.stocks[0]}
                    product={selectedProduct}
                    onSelect={() =>
                      handleStockClick(
                        selectedProduct.stocks[0],
                        selectedProduct
                      )
                    }
                  />
                )}
                {selectedProduct.stocks.length > 1 && (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedProduct.stocks.map((stock) => (
                      <StockCard
                        key={stock.id}
                        stock={stock}
                        product={selectedProduct}
                        onSelect={() =>
                          handleStockClick(stock, selectedProduct)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Enhanced Transfer Modal */}
      <Modal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        aria-labelledby="transfer-modal-title"
        aria-describedby="transfer-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 0,
            minWidth: 320,
            maxWidth: 480,
            width: "90%",
          }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-bold text-gray-900"
                id="transfer-modal-title"
              >
                Transfer Items
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setShowTransferModal(false)}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleTransferSubmit} className="p-6">
            <TextField
              label="Transfer Description"
              fullWidth
              multiline
              minRows={3}
              value={transferDescription}
              onChange={(e) => setTransferDescription(e.target.value)}
              className="mb-6"
              placeholder="Enter transfer description..."
            />

            <FormControl fullWidth className="mb-6" required>
              <InputLabel id="supplier-select-label">Select Factory</InputLabel>
              <Select
                labelId="supplier-select-label"
                id="supplier-select"
                className="my-6"
                value={selectedSupplier}
                label="Select Factory"
                onChange={(e) =>
                  setSelectedSupplier(e.target.value as number | "")
                }
                disabled={supplierLoading}
              >
                {supplierLoading ? (
                  <MenuItem disabled>Loading suppliers...</MenuItem>
                ) : supplierError ? (
                  <MenuItem disabled>Error loading suppliers</MenuItem>
                ) : suppliers.length === 0 ? (
                  <MenuItem disabled>No suppliers available</MenuItem>
                ) : (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                      {supplier.email && ` (${supplier.email})`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={transferLoading || !selectedSupplier}
              className="bg-blue-600 hover:bg-blue-700 py-3"
              startIcon={<InventoryIcon className="w-4 h-4" />}
            >
              {transferLoading ? "Processing Transfer..." : "Confirm Transfer"}
            </Button>
            {transferError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{transferError}</p>
              </div>
            )}
          </form>
        </Box>
      </Modal>

      {/* Add Modals */}
      <ProductAddModal
        open={showProductAddModal}
        onClose={() => setShowProductAddModal(false)}
        onSuccess={() => {
          // Refresh products data
          window.location.reload();
        }}
      />

      <StockAddModal
        open={showStockAddModal}
        onClose={() => setShowStockAddModal(false)}
        onSuccess={() => {
          // Refresh products data
          window.location.reload();
        }}
      />

      <MaterialAddModal
        open={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
        onSuccess={() => {
          // Refresh materials data
          window.location.reload();
        }}
      />
    </div>
  );
}

// Enhanced StockCard component
function StockCard({
  stock,
  product,
  onSelect,
}: {
  stock: any;
  product: Product;
  onSelect: () => void;
}) {
  let variation =
    stock.variation_stocks && stock.variation_stocks.length > 0
      ? stock.variation_stocks
          .map((vs: any) => vs.variation_option?.name)
          .join(", ")
      : null;

  return (
    <div
      className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
      onClick={onSelect}
    >
      <div className="flex-shrink-0">
        {product.primary_image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}${product.primary_image}`}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg border border-gray-200">
            <span className="text-2xl">🧈</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">
          {product.name}
        </div>
        {variation && (
          <div className="text-xs text-gray-500 mt-1">
            <span className="bg-gray-100 px-2 py-1 rounded-full">
              {variation}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-700">
            Price:{" "}
            <span className="font-bold text-green-600">
              LKR {stock.pos_price}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Stock: <span className="font-medium">{stock.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
