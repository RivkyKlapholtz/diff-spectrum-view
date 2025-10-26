import { useJobsStatus } from "@/hooks/useDiffs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Activity } from "lucide-react";

export function JobsSummary() {
  const { data: status, isLoading } = useJobsStatus();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!status) return null;

  const stats = [
    {
      title: "Failed Diffs",
      value: status.failedDiffs,
      icon: XCircle,
      color: "text-destructive",
      description: "Diffs that didn't match",
    },
    {
      title: "Succeeded Diffs",
      value: status.successedDiffs,
      icon: CheckCircle2,
      color: "text-green-500",
      description: "Diffs that matched",
    },
    {
      title: "Failed Jobs",
      value: status.failedJobs,
      icon: AlertCircle,
      color: "text-orange-500",
      description: "Jobs that failed",
    },
    {
      title: "Total Jobs",
      value: status.jobCounter,
      icon: Activity,
      color: "text-primary",
      description: "Total jobs executed",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
