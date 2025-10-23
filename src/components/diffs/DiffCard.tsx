import { DiffItem } from "@/types/diff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface DiffCardProps {
  diff: DiffItem;
  onClick: () => void;
}

export function DiffCard({ diff, onClick }: DiffCardProps) {
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

  const config = statusConfig[diff.status];
  const StatusIcon = config.icon;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">{diff.jobName}</CardTitle>
          <Badge variant={config.variant}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-3.5 w-3.5" />
            <span>{format(new Date(diff.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
          {diff.metadata?.endpoint && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {diff.metadata.method || "GET"}
              </Badge>
              <span className="text-muted-foreground truncate">{diff.metadata.endpoint}</span>
            </div>
          )}
          <div className="text-xs text-muted-foreground">Job ID: {diff.jobId}</div>
        </div>
      </CardContent>
    </Card>
  );
}
