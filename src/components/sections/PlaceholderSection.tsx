import { Construction } from "lucide-react";

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="gov-card">
        <div className="gov-card-body flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Construction className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Select "Overview" from the sidebar to view the main dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
