import { useJobsStatus, useDiffStats } from "@/hooks/useDiffs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Activity, FileCode } from "lucide-react";

interface SummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SummaryDialog({ open, onOpenChange }: SummaryDialogProps) {
  const { data: jobsStatus } = useJobsStatus();
  const { data: diffStats } = useDiffStats();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Jobs Summary</DialogTitle>
          <DialogDescription>
            Complete overview of all jobs and diffs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Jobs Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Jobs Status</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Diffs</CardTitle>
                  <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobsStatus?.failedDiffs || 0}</div>
                  <p className="text-xs text-muted-foreground">Diffs that didn't match</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Succeeded Diffs</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobsStatus?.successedDiffs || 0}</div>
                  <p className="text-xs text-muted-foreground">Diffs that matched</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobsStatus?.failedJobs || 0}</div>
                  <p className="text-xs text-muted-foreground">Jobs that failed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobsStatus?.jobCounter || 0}</div>
                  <p className="text-xs text-muted-foreground">Total jobs executed</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Diffs by Category */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Diffs by Category</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {diffStats?.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{category.label}</CardTitle>
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{category.count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
