"use client";

import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] ?? "");

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm leading-6 text-slate-500">
        Фотографии товара пока не добавлены. Можно уточнить внешний вид
        устройства перед покупкой через контакты.
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[4/3] w-full bg-white">
        <img
          src={activeImage}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-3 sm:grid-cols-4">
          {images.map((image, index) => {
            const isActive = image === activeImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`overflow-hidden rounded-2xl border bg-white text-left transition ${
                  isActive
                    ? "border-slate-900 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-400"
                }`}
                aria-label={`Показать изображение ${index + 1}`}
                aria-pressed={isActive}
              >
                <div className="aspect-square">
                  <img
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
