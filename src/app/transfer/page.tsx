"use client";
import MaterialCard from "@/components/transfer/MaterialCard";
import ProductCard, { Product } from "@/components/transfer/ProductCard";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

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

  return (
    <div>
      <div>nav</div>
      <div className="flex h-[80vh]">
        <div className="w-1/2 border-r border-gray-600 overflow-y-auto">
          {/* Search Bar */}
          <div className="p-4 pb-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search materials..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
          {loading ? (
            <div className="p-4 text-gray-500 text-center">
              Loading materials...
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">Error: {error}</div>
          ) : (
            <>
              <MaterialCard materials={paginatedMaterials} />
              {/* Pagination */}
              {filteredMaterials.length > PAGE_SIZE && (
                <div className="flex justify-center items-center gap-2 py-4">
                  <button
                    className="px-2 py-1 rounded border text-sm disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        className={`px-2 py-1 rounded text-sm border ${num === page ? "bg-blue-500 text-white border-blue-500" : "border-gray-300"}`}
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    )
                  )}
                  <button
                    className="px-2 py-1 rounded border text-sm disabled:opacity-50"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="w-1/2 flex flex-col h-full">
          {/* Product Search Bar */}
          <div className="p-4 pb-2">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {productLoading ? (
              <div className="p-4 text-gray-500 text-center">
                Loading products...
              </div>
            ) : productError ? (
              <div className="p-4 text-red-500 text-center">
                Error: {productError}
              </div>
            ) : (
              <>
                <ProductCard
                  products={paginatedProducts}
                  onProductClick={handleProductClick}
                />
                {/* Pagination */}
                {filteredProducts.length > PRODUCT_PAGE_SIZE && (
                  <div className="flex justify-center items-center gap-2 py-4">
                    <button
                      className="px-2 py-1 rounded border text-sm disabled:opacity-50"
                      onClick={() => setProductPage(productPage - 1)}
                      disabled={productPage === 1}
                    >
                      Prev
                    </button>
                    {Array.from(
                      { length: productTotalPages },
                      (_, i) => i + 1
                    ).map((num) => (
                      <button
                        key={num}
                        className={`px-2 py-1 rounded text-sm border ${num === productPage ? "bg-blue-500 text-white border-blue-500" : "border-gray-300"}`}
                        onClick={() => setProductPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      className="px-2 py-1 rounded border text-sm disabled:opacity-50"
                      onClick={() => setProductPage(productPage + 1)}
                      disabled={productPage === productTotalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Stock Modal */}
          <Modal
            open={showStockModal && !!selectedProduct}
            onClose={closeModal}
            aria-labelledby="stock-modal-title"
            aria-describedby="stock-modal-description"
            slots={{
              backdrop: (props) => (
                <div {...props} style={{ background: "transparent" }} />
              ),
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                minWidth: 320,
                maxWidth: 480,
                width: "90%",
              }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                onClick={closeModal}
              >
                &times;
              </button>
              {selectedProduct && (
                <>
                  <h2 className="text-lg font-bold mb-4" id="stock-modal-title">
                    {selectedProduct.name} Stocks
                  </h2>
                  <div className="space-y-4">
                    {selectedProduct.stocks.length === 0 && (
                      <div className="text-gray-500 text-center">
                        No stock available
                      </div>
                    )}
                    {selectedProduct.stocks.length === 1 && (
                      <StockCard
                        stock={selectedProduct.stocks[0]}
                        product={selectedProduct}
                      />
                    )}
                    {selectedProduct.stocks.length > 1 && (
                      <div className="grid grid-cols-1 gap-3">
                        {selectedProduct.stocks.map((stock) => (
                          <StockCard
                            key={stock.id}
                            stock={stock}
                            product={selectedProduct}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

// StockCard component for modal
function StockCard({ stock, product }: { stock: any; product: Product }) {
  // Find variation name if available
  let variation =
    stock.variation_stocks && stock.variation_stocks.length > 0
      ? stock.variation_stocks
          .map((vs: any) => vs.variation_option?.name)
          .join(", ")
      : null;
  return (
    <div className="flex items-center gap-4 border rounded-lg p-3">
      <div className="flex-shrink-0">
        {product.primary_image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}${product.primary_image}`}
            alt={product.name}
            className="w-16 h-16 object-cover rounded border"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 rounded border">
            <span className="text-2xl">🧈</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">
          {product.name}
        </div>
        {variation && <div className="text-xs text-gray-500">{variation}</div>}
        <div className="text-sm text-gray-700 mt-1">
          Price: <span className="font-bold">{stock.pos_price}</span>
        </div>
        <div className="text-xs text-gray-500">Quantity: {stock.quantity}</div>
      </div>
    </div>
  );
}
