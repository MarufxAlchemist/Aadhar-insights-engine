import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onFilterChange?: (filters: FilterState) => void;
}

export function Header({ title, subtitle, onFilterChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/aadhaar-logo.png"
              alt="Aadhaar Insights Engine"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <GlobalFilters onFilterChange={onFilterChange} />
    </header>
  );
}
