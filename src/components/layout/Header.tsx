import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onFilterChange?: (filters: FilterState) => void;
}

export function Header({ title, subtitle, onFilterChange }: HeaderProps) {
  return (
    <header className="bg-card/95 border-b border-border backdrop-blur-md">
      <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/aadhaar-logo.png"
              alt="Aadhaar Drishti"
              className="h-12 w-auto drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground gradient-text">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <GlobalFilters onFilterChange={onFilterChange} />
    </header>
  );
}
