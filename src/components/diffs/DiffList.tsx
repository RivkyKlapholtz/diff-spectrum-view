import { useDiffsByCategory } from "@/hooks/useDiffs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

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

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      variant: "default" as const,
      label: "Completed",
    },
    failed: {
      icon: XCircle,
      variant: "destructive" as const,
      label: "Failed",
    },
    pending: {
      icon: AlertCircle,
      variant: "secondary" as const,
      label: "Pending",
    },
  };

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

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Job Name</TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diffs.map((diff) => {
              const config = statusConfig[diff.status];
              const StatusIcon = config.icon;

              return (
                <TableRow
                  key={diff.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onDiffSelect(diff.id)}
                >
                  <TableCell>
                    <Badge variant={config.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{diff.jobName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {diff.jobId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {diff.metadata?.endpoint || "-"}
                  </TableCell>
                  <TableCell>
                    {diff.metadata?.method ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {diff.metadata.method}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(diff.timestamp), "MMM d, h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {diff.metadata?.duration ? `${diff.metadata.duration}ms` : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
