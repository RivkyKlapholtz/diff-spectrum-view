import { useDiffById } from "@/hooks/useDiffs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

interface DiffDetailProps {
  diffId: string | null;
  onBack: () => void;
}

export function DiffDetail({ diffId, onBack }: DiffDetailProps) {
  const { data: diff, isLoading, error } = useDiffById(diffId);

  if (!diffId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading diff details...</p>
        </div>
      </div>
    );
  }

  if (error || !diff) {
    return (
      <div className="p-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load diff details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Try to parse and format JSON if applicable
  const formatValue = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value;
    }
  };

  const oldValue = formatValue(diff.oldValue);
  const newValue = formatValue(diff.newValue);

  return (
    <div className="p-6 space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{diff.jobName}</CardTitle>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    {format(new Date(diff.timestamp), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    {format(new Date(diff.timestamp), "h:mm a")}
                  </div>
                </div>
              </div>
              <Badge variant={diff.status === "completed" ? "default" : "destructive"}>
                {diff.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {diff.metadata?.endpoint && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {diff.metadata.method || "GET"}
                </Badge>
                <span className="text-sm font-mono text-muted-foreground">
                  {diff.metadata.endpoint}
                </span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Job ID: <span className="font-mono">{diff.jobId}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border">
            <ReactDiffViewer
              oldValue={oldValue}
              newValue={newValue}
              splitView={true}
              compareMethod={DiffMethod.WORDS}
              leftTitle="Previous Value"
              rightTitle="Current Value"
              useDarkTheme={false}
              styles={{
                variables: {
                  light: {
                    diffViewerBackground: "hsl(var(--card))",
                    diffViewerColor: "hsl(var(--foreground))",
                    addedBackground: "hsl(var(--addition))",
                    addedColor: "hsl(var(--foreground))",
                    removedBackground: "hsl(var(--deletion))",
                    removedColor: "hsl(var(--foreground))",
                    wordAddedBackground: "hsl(var(--addition-border))",
                    wordRemovedBackground: "hsl(var(--deletion-border))",
                    addedGutterBackground: "hsl(var(--addition-border))",
                    removedGutterBackground: "hsl(var(--deletion-border))",
                    gutterBackground: "hsl(var(--muted))",
                    gutterBackgroundDark: "hsl(var(--muted))",
                    highlightBackground: "hsl(var(--accent))",
                    highlightGutterBackground: "hsl(var(--accent))",
                  },
                },
                contentText: {
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "13px",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
