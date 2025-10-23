import { useDiffsByCategory } from "@/hooks/useDiffs";
import { DiffCard } from "./DiffCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DiffListProps {
  category: string | null;
  onDiffSelect: (diffId: string) => void;
}

export function DiffList({ category, onDiffSelect }: DiffListProps) {
  const { data: diffs, isLoading, error } = useDiffsByCategory(category);

  if (!category) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">Welcome to Diff Dashboard</h2>
          <p className="mt-2 text-muted-foreground">
            Select a category from the sidebar to view diffs
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading diffs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load diffs. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!diffs || diffs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No diffs found for this category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">
          {category.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Diffs
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {diffs.length} diff{diffs.length !== 1 ? "s" : ""} found
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {diffs.map((diff) => (
          <DiffCard key={diff.id} diff={diff} onClick={() => onDiffSelect(diff.id)} />
        ))}
      </div>
    </div>
  );
}
