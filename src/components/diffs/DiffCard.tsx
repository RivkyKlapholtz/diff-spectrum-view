import { DiffItem } from "@/types/diff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface DiffCardProps {
  diff: DiffItem;
  onClick: () => void;
}

export function DiffCard({ diff, onClick }: DiffCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">{diff.jobName}</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {diff.diffType === "status_code" ? "Status Code" : "Body"}
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
