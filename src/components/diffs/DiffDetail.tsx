import { useDiffById } from "@/hooks/useDiffs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Code } from "lucide-react";
import { format } from "date-fns";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DiffDetailProps {
  diffId: string | null;
  onBack: () => void;
}

export function DiffDetail({ diffId, onBack }: DiffDetailProps) {
  const { data: diff, isLoading, error } = useDiffById(diffId);
  const [selectedCurl, setSelectedCurl] = useState<{ prod: string; integ: string } | null>(null);

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

  const prodValue = formatValue(diff.prodNormalizedResponse);
  const integValue = formatValue(diff.integNormalizedResponse);

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
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Job ID</div>
                <div className="text-sm font-mono">{diff.jobId}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Diff Type</div>
                <Badge variant="outline" className="font-mono text-xs">
                  {diff.diffType === "status_code" ? "Status Code" : "Body"}
                </Badge>
              </div>
            </div>
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCurl({
                    prod: diff.prodCurlRequest,
                    integ: diff.integCurlRequest
                  });
                }}
              >
                <Code className="h-4 w-4 mr-2" />
                View cURL Requests
              </Button>
            </div>
            {(diff.prodIgnoredFields && diff.prodIgnoredFields.length > 0) || 
             (diff.integIgnoredFields && diff.integIgnoredFields.length > 0) ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Ignored Fields</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Production</div>
                    {diff.prodIgnoredFields && diff.prodIgnoredFields.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {diff.prodIgnoredFields.map((field, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">None</div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Integration</div>
                    {diff.integIgnoredFields && diff.integIgnoredFields.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {diff.integIgnoredFields.map((field, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">None</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Comparison: Production vs Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border">
            <ReactDiffViewer
              oldValue={prodValue}
              newValue={integValue}
              splitView={true}
              compareMethod={DiffMethod.WORDS}
              leftTitle="Production (Normalized)"
              rightTitle="Integration (Normalized)"
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

      <Dialog open={!!selectedCurl} onOpenChange={() => setSelectedCurl(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>cURL Requests - Production vs Integration</DialogTitle>
            <DialogDescription>
              Compare the cURL commands sent to both environments
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Production cURL</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap break-all">
                {selectedCurl?.prod}
              </pre>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedCurl?.prod || "");
                  }}
                >
                  Copy Prod
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([selectedCurl?.prod || ""], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "prod-curl-request.sh";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Integration cURL</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap break-all">
                {selectedCurl?.integ}
              </pre>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedCurl?.integ || "");
                  }}
                >
                  Copy Integ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([selectedCurl?.integ || ""], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "integ-curl-request.sh";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
