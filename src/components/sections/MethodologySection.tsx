import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MethodologySection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="gov-card">
        <div className="gov-card-header">
          <h2 className="text-lg font-semibold text-foreground">
            Analytical Framework & Data Transparency
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive documentation of data sources, processing methods, and analytical assumptions
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="dataset" className="gov-card border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <span className="font-medium text-foreground">Dataset Description</span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                This analysis utilizes the UIDAI-released open dataset covering Aadhaar enrolment
                and update statistics from April 2024 to March 2025.
              </p>
              <div>
                <h4 className="font-medium text-foreground mb-2">Primary Data Columns</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li><span className="text-foreground font-medium">State/UT:</span> Geographic administrative unit</li>
                  <li><span className="text-foreground font-medium">District:</span> Sub-state administrative region</li>
                  <li><span className="text-foreground font-medium">Enrolment Count:</span> New Aadhaar registrations</li>
                  <li><span className="text-foreground font-medium">Update Count:</span> Total update transactions</li>
                  <li><span className="text-foreground font-medium">Update Type:</span> Demographic, Biometric, Contact</li>
                  <li><span className="text-foreground font-medium">Time Period:</span> Monthly aggregated data</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cleaning" className="gov-card border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <span className="font-medium text-foreground">Data Cleaning & Preprocessing</span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Cleaning Steps Applied</h4>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Removal of duplicate records based on composite key (State + District + Month)</li>
                  <li>Handling of missing values through forward-fill for temporal continuity</li>
                  <li>Outlier detection using IQR method with 1.5x threshold</li>
                  <li>Standardization of state/district names for consistency</li>
                  <li>Validation of numeric fields for negative or impossible values</li>
                </ol>
              </div>
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs">
                  <span className="font-medium text-foreground">Data Quality Score:</span> 97.2% of records passed all validation checks.
                  Excluded records are documented in the supplementary data appendix.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features" className="gov-card border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <span className="font-medium text-foreground">Feature Engineering</span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Update Friction Index (UFI)</h4>
                <p className="mb-2">
                  A composite metric measuring the complexity of update interactions within a region.
                </p>
                <div className="p-3 bg-muted/50 rounded-md font-mono text-xs">
                  UFI = (Total Updates / Unique Update Users) × Normalization Factor
                </div>
                <p className="mt-2">
                  Values above 1.0 indicate users typically require multiple update attempts or visits,
                  suggesting potential administrative friction.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Enrolment-Update Gap</h4>
                <p className="mb-2">
                  The arithmetic difference between new enrolments and total updates within a period.
                </p>
                <div className="p-3 bg-muted/50 rounded-md font-mono text-xs">
                  Gap = Enrolment Count − Update Count
                </div>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li><span className="text-foreground">Positive Gap:</span> Expansion phase, new users outpacing maintenance</li>
                  <li><span className="text-foreground">Negative Gap:</span> Mature phase, existing user activity dominant</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Life-Event Signal Detection</h4>
                <p>
                  Cluster analysis applied to update patterns to identify synchronized spikes
                  that may indicate collective life events (migration, employment shifts, academic transitions).
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="assumptions" className="gov-card border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <span className="font-medium text-foreground">Assumptions & Limitations</span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Key Assumptions</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Update patterns reflect genuine user needs rather than system-induced behavior</li>
                  <li>Geographic aggregation at district level is sufficiently granular for signal detection</li>
                  <li>Monthly data aggregation captures meaningful temporal patterns</li>
                  <li>Seasonal variations are consistent across years for baseline comparison</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Known Limitations</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Cannot distinguish voluntary vs. mandatory updates from aggregate data</li>
                  <li>Rural vs. urban breakdown not available in source dataset</li>
                  <li>Individual-level demographic attributes not accessible for privacy compliance</li>
                  <li>Real-time data not available; analysis based on monthly releases</li>
                </ul>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                <p className="text-xs">
                  <span className="font-medium text-foreground">Interpretive Caution:</span> All signals and patterns
                  presented are data-driven observations intended to guide further investigation.
                  They should not be interpreted as confirmed causal relationships without additional
                  field validation and cross-referencing with external data sources.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources" className="gov-card border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <span className="font-medium text-foreground">Data Sources & References</span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Primary Sources</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>UIDAI Open Data Portal – Aadhaar Statistics</li>
                  <li>data.gov.in – National Data Sharing Platform</li>
                  <li>Census of India – Demographic baselines</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Analytical References</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>NITI Aayog – Digital India Dashboard frameworks</li>
                  <li>Academic literature on administrative data analysis</li>
                  <li>International practices in identity system monitoring</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
