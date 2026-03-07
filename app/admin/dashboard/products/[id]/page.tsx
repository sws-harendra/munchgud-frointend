"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/app/sercices/user/product.service";
import { variantService } from "@/app/services/admin/variant.service";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // new variant form state
  const [newVariant, setNewVariant] = useState({
    optionId: 0,
    sku: "",
    price: 0,
    stock: 0,
    image: undefined as File | undefined,
  });

  // edit modal state
  const [editVariant, setEditVariant] = useState<any>(null);

  // fetch product details
  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id as string);
      setProduct(data.product ?? data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // create variant
  const handleAddVariant = async () => {
    if (!id) return;
    try {
      await variantService.createProductVariant(Number(id), newVariant);
      setNewVariant({
        optionId: 0,
        sku: "",
        price: 0,
        stock: 0,
        image: undefined,
      });
      fetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  // delete variant
  const handleDeleteVariant = async (variantId: number) => {
    try {
      await variantService.deleteProductVariant(variantId);
      fetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  // update variant
  const handleUpdateVariant = async () => {
    if (!editVariant) return;
    try {
      await variantService.updateProductVariant(editVariant.id, {
        sku: editVariant.sku,
        price: editVariant.price,
        stock: editVariant.stock,
        image: editVariant.image,
      });
      setEditVariant(null); // close modal
      fetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Product Header */}
      <div className="flex items-start gap-6">
        <div className="flex gap-2 overflow-x-auto max-w-md">
          {product.images?.map((img: string, idx: number) => (
            <img
              key={idx}
              src={getImageUrl(img)}
              alt={product.name}
              className="h-32 w-32 object-cover rounded-lg border"
            />
          ))}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium">{product.Category?.name}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Price: <span className="font-medium">₹{product.originalPrice}</span>{" "}
            {product.discountPrice && (
              <span className="text-green-600 ml-2">
                (Discounted: ₹{product.discountPrice})
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Stock: <span className="font-medium">{product.stock}</span>
          </p>
        </div>
      </div>

      {/* Variants */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.ProductVariants?.map((variant: any) => (
            <div
              key={variant.id}
              className="p-4 border rounded-lg shadow-sm bg-white flex flex-col justify-between"
            >
              <div className="flex gap-4">
                {variant.image && (
                  <img
                    src={getImageUrl(variant?.image)}
                    alt={variant.sku || "variant"}
                    className="h-20 w-20 object-cover rounded-lg border"
                  />
                )}
                <div>
                  <p className="font-medium">
                    SKU:{" "}
                    {variant.sku || <span className="text-gray-400">N/A</span>}
                  </p>
                  <p>Price: ₹{variant.price}</p>
                  <p>Stock: {variant.stock}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    Options:{" "}
                    {variant.options?.map((opt: any) => (
                      <span
                        key={opt.id}
                        className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2"
                      >
                        {opt.name} ({opt.value})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setEditVariant(variant)}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="px-3 py-1 bg-red-100 text-green-700 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editVariant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Variant</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="SKU"
                value={editVariant.sku}
                onChange={(e) =>
                  setEditVariant({ ...editVariant, sku: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={editVariant.price}
                onChange={(e) =>
                  setEditVariant({
                    ...editVariant,
                    price: Number(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Stock"
                value={editVariant.stock}
                onChange={(e) =>
                  setEditVariant({
                    ...editVariant,
                    stock: Number(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="file"
                onChange={(e) =>
                  setEditVariant({
                    ...editVariant,
                    image: e.target.files?.[0],
                  })
                }
                className="w-full"
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setEditVariant(null)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVariant}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
