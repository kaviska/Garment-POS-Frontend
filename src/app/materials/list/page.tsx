"use client";
import { useEffect, useState } from "react";
import DataTableMy from "@/components/main/DataTable";
import Title from "@/components/main/Title";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import ViewModal from "@/components/main/ViewModal";
import DeleteModal from "@/components/main/DeleteModal";
import ToastMessage from "@/components/dashboard/ToastMessage";
import { AlertColor } from "@mui/material";
import MaterialUpdate from "@/components/UpdateModels/MaterialUpdate";
import Image from "next/image";

interface Material {
  id: number | string;
  name: string;
  description: string;
  type: string;
  unit: string;
  cost: string;
  quantity: string;
  supplier: string;
  gsm: string;
  color: string;
  image?: string;
}

export default function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialModelOpen, setMaterialModelOpen] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const columns = [
    {
      name: "Actions",
      style: {
        maxWidth: "150px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      cell: (row: Material) => (
        <div className="flex gap-2 cursor-pointer">
          <button
            className="cursor-pointer"
            onClick={() => {
              setSelectedMaterial(row);
              setMaterialModelOpen(true);
            }}
          >
            <EditIcon fontSize="small" color="primary" />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => {
              setSelectedMaterial(row);
              setViewModalOpen(true);
            }}
          >
            <RemoveRedEyeIcon fontSize="small" color="action" />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => {
              setDeleteModalOpen(true);
              setSelectedMaterial(row);
            }}
          >
            <HighlightOffIcon fontSize="small" color="error" />
          </button>
        </div>
      ),
    },
    {
      name: "Image",
      style: {
        maxWidth: "150px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      cell: (row: Material) =>
        row.image ? (
          <img
            src={
              (process.env.NEXT_PUBLIC_IMAGE_BASE || "") +
              row.image +
              `?t=${new Date().getTime()}`
            }
            alt={row.name}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    {
      name: "Name",
      style: {
        maxWidth: "150px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      style: {
        maxWidth: "300px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.description,
    },
    {
      name: "Type",
      style: {
        maxWidth: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.type,
    },
    {
      name: "Unit",
      style: {
        maxWidth: "80px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.unit,
    },
    {
      name: "Cost",
      style: {
        maxWidth: "80px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.cost,
    },
    {
      name: "Quantity",
      style: {
        maxWidth: "80px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.quantity,
    },
    {
      name: "Supplier",
      style: {
        maxWidth: "120px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.supplier,
    },
    {
      name: "GSM",
      style: {
        maxWidth: "80px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.gsm,
    },
    {
      name: "Color",
      style: {
        maxWidth: "80px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      selector: (row: Material) => row.color,
    },
  ];

  const fetchMaterials = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "/materials?all-materials",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
              "Bearer 3|85MPD3fuiEGXIJYlvgV0PCOhLPVEzLL2JBBJl349f9ff23f6",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }
      const result = await response.json();
      if (result.status === "success") {
        setMaterials(result.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div>
      <Title
        title="Material List"
        breadCrumbs={[
          { label: "Material", href: "/materials" },
          { label: "List", href: "/materials/list" },
        ]}
        active="list of materials"
      />
      {materials.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl text-gray-500">No materials found</h1>
        </div>
      ) : (
        <div className="mt-8">
          <DataTableMy columns={columns} data={materials} />
        </div>
      )}

      {viewModalOpen && (
        <ViewModal
          onClose={() => setViewModalOpen(false)}
          title="Material Details"
          data={materials}
          fields={[
            { label: "Name", value: selectedMaterial?.name || "N/A" },
            {
              label: "Description",
              value: selectedMaterial?.description || "N/A",
            },
            { label: "Type", value: selectedMaterial?.type || "N/A" },
            { label: "Unit", value: selectedMaterial?.unit || "N/A" },
            { label: "Cost", value: selectedMaterial?.cost || "N/A" },
            { label: "Quantity", value: selectedMaterial?.quantity || "N/A" },
            { label: "Supplier", value: selectedMaterial?.supplier || "N/A" },
            { label: "GSM", value: selectedMaterial?.gsm || "N/A" },
            { label: "Color", value: selectedMaterial?.color || "N/A" },
          ]}
        />
      )}

      {materialModelOpen && (
        <MaterialUpdate
          materialModelOpen={materialModelOpen}
          handleCloseUpdateModal={() => setMaterialModelOpen(false)}
          initialData={selectedMaterial}
          onUpdateSuccess={() => {
            setMaterials([]);
            fetchMaterials();
          }}
        />
      )}

      <ToastMessage
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />

      {deleteModalOpen && (
        <DeleteModal
          id={String(selectedMaterial?.id || "")}
          title="material"
          url="materials"
          onClose={() => setDeleteModalOpen(false)}
          setToast={setToast}
          onDeleteSuccess={() => {
            setMaterials([]);
            fetchMaterials();
          }}
        />
      )}
    </div>
  );
}
