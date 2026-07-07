type SectionTitleProps = {
  en: string;
  ko?: string;
  as?: "h1" | "h2";
  className?: string;
};

export default function SectionTitle({
  en,
  ko,
  as: Tag = "h2",
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`text-center ${className}`}>
      <Tag className="font-serif text-3xl font-light tracking-[0.3em] text-ink md:text-4xl">
        {en}
      </Tag>
      {ko && <p className="mt-3 text-sm text-muted">{ko}</p>}
    </div>
  );
}

/** Shared top title for subpages — includes padding to offset the fixed header */
export function PageTitle({ en, ko }: { en: string; ko?: string }) {
  return (
    <div className="px-5 pb-12 pt-28 md:pb-16 md:pt-40">
      <SectionTitle as="h1" en={en} ko={ko} />
    </div>
  );
}
