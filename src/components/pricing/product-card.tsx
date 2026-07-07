import { formatPrice, type Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col border-t border-ink pt-6">
      <h3 className="flex items-baseline gap-2" aria-label={product.name}>
        <span className="font-serif text-3xl font-light text-ink">
          {product.nameEn}
        </span>
        <span className="text-sm text-muted">Type</span>
      </h3>

      {product.badge && (
        <p className="mt-2 text-xs text-muted">* {product.badge}</p>
      )}

      <ul className="mt-6 space-y-2.5 text-sm leading-6 text-body">
        {product.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <div className="mt-8">
        <p className="text-[13px] text-muted">
          <span className="mr-2">정상가</span>
          <del>{formatPrice(product.regularPrice)}</del>
        </p>
        <p className="mt-1">
          <span className="mr-2 text-[13px] text-muted">할인가</span>
          <strong className="text-xl font-medium text-ink">
            {formatPrice(product.salePrice)}
          </strong>
        </p>
      </div>

      <div className="mt-6 space-y-1.5 border-t border-line pt-4 text-xs leading-5 text-muted">
        {product.notes.map((note) => (
          <p key={note}>* {note}</p>
        ))}
        <p>* {product.reviewEvent}</p>
      </div>
    </article>
  );
}
