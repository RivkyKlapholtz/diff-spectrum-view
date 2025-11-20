import { useState } from "react";
import { useDiffsByType } from "@/hooks/useDiffs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertCircle, Clock, Code, Trash2, ExternalLink, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DiffListProps {
  category: string | null;
  onDiffSelect: (diffId: string) => void;
}

export function DiffList({ category, onDiffSelect }: DiffListProps) {
  const { data: diffs, isLoading, error } = useDiffsByType(category);
  const [selectedCurl, setSelectedCurl] = useState<{ prod: string; integ: string } | null>(null);
  const [deletedDiffs, setDeletedDiffs] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('deletedDiffs');
    return new Set(stored ? JSON.parse(stored) : []);
  });
  const [checkedDiffs, setCheckedDiffs] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('checkedDiffs');
    return new Set(stored ? JSON.parse(stored) : []);
  });
  const [filters, setFilters] = useState({
    jobId: "",
    diffType: "",
    timestamp: "",
    duration: "",
    response: "",
  });
  const { toast } = useToast();

  const handleDeleteDiff = (diffId: string) => {
    // Find the diff to get its category
    const diff = diffs?.find(d => d.id === diffId);
    if (!diff) return;
    
    const newDeleted = new Set(deletedDiffs);
    newDeleted.add(diffId);
    setDeletedDiffs(newDeleted);
    
    // Store deleted diffs with their categories
    const deletedWithCategories = JSON.parse(localStorage.getItem('deletedDiffsWithCategories') || '{}');
    deletedWithCategories[diffId] = diff.category;
    localStorage.setItem('deletedDiffsWithCategories', JSON.stringify(deletedWithCategories));
    localStorage.setItem('deletedDiffs', JSON.stringify([...newDeleted]));
    
    toast({
      title: "Diff deleted",
      description: "The diff has been moved to deleted diffs",
    });
  };

  const handleRestoreDiff = (diffId: string) => {
    const newDeleted = new Set(deletedDiffs);
    newDeleted.delete(diffId);
    setDeletedDiffs(newDeleted);
    
    // Remove from deleted with categories
    const deletedWithCategories = JSON.parse(localStorage.getItem('deletedDiffsWithCategories') || '{}');
    delete deletedWithCategories[diffId];
    localStorage.setItem('deletedDiffsWithCategories', JSON.stringify(deletedWithCategories));
    localStorage.setItem('deletedDiffs', JSON.stringify([...newDeleted]));
    
    toast({
      title: "Diff restored",
      description: "The diff has been restored",
    });
  };

  const handleToggleChecked = (diffId: string) => {
    const newChecked = new Set(checkedDiffs);
    if (newChecked.has(diffId)) {
      newChecked.delete(diffId);
    } else {
      newChecked.add(diffId);
    }
    setCheckedDiffs(newChecked);
    localStorage.setItem('checkedDiffs', JSON.stringify([...newChecked]));
  };

  const handleOpenJiraTicket = (diff: any) => {
    const ticketBody = `
Diff ID: ${diff.id}
Job ID: ${diff.jobId}
Diff Type: ${diff.diffType}
Timestamp: ${format(new Date(diff.timestamp), "MMM d, yyyy h:mm a")}

Production Normalized Response:
${diff.prodNormalizedResponse}

Integration Normalized Response:
${diff.integNormalizedResponse}

Production cURL:
${diff.prodCurlRequest}

Integration cURL:
${diff.integCurlRequest}
    `.trim();

    // Open Jira with pre-filled data - adjust URL based on your Jira instance
    const jiraUrl = `https://your-jira-instance.atlassian.net/secure/CreateIssue!default.jspa?description=${encodeURIComponent(ticketBody)}`;
    window.open(jiraUrl, '_blank');
  };

  const isDeletedCategory = category === "deleted_diffs";
  const filteredDiffs = diffs?.filter(diff => {
    const isInCategory = isDeletedCategory ? deletedDiffs.has(diff.id) : !deletedDiffs.has(diff.id);
    if (!isInCategory) return false;
    
    // Apply individual column filters
    if (filters.jobId && !diff.jobId.toLowerCase().includes(filters.jobId.toLowerCase())) {
      return false;
    }
    
    if (filters.diffType) {
      const diffTypeDisplay = diff.diffType === "status_code" ? "Status Code" : "Body";
      if (!diffTypeDisplay.toLowerCase().includes(filters.diffType.toLowerCase())) {
        return false;
      }
    }
    
    if (filters.timestamp) {
      const formattedTimestamp = format(new Date(diff.timestamp), "MMM d, h:mm a");
      if (!formattedTimestamp.toLowerCase().includes(filters.timestamp.toLowerCase())) {
        return false;
      }
    }
    
    if (filters.duration) {
      const durationText = diff.metadata?.duration ? `${diff.metadata.duration}ms` : "-";
      if (!durationText.toLowerCase().includes(filters.duration.toLowerCase())) {
        return false;
      }
    }
    
    if (filters.response) {
      const responseLower = filters.response.toLowerCase();
      const matchesProd = diff.prodNormalizedResponse.toLowerCase().includes(responseLower);
      const matchesInteg = diff.integNormalizedResponse.toLowerCase().includes(responseLower);
      if (!matchesProd && !matchesInteg) {
        return false;
      }
    }
    
    return true;
  });


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

  if (!filteredDiffs || filteredDiffs.length === 0) {
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
          {filteredDiffs.length} diff{filteredDiffs.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder="Filter by Response content..."
            value={filters.response}
            onChange={(e) => setFilters({ ...filters, response: e.target.value })}
            className="flex-1"
          />
          {filters.response && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3"
              onClick={() => setFilters({ ...filters, response: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {(filters.jobId || filters.diffType || filters.timestamp || filters.duration || filters.response) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ jobId: "", diffType: "", timestamp: "", duration: "", response: "" })}
          >
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Checked</TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Diff Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <Input
                  type="text"
                  placeholder="Filter..."
                  value={filters.jobId}
                  onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
                  className="h-8 text-xs"
                />
              </TableHead>
              <TableHead>
                <Input
                  type="text"
                  placeholder="Filter..."
                  value={filters.diffType}
                  onChange={(e) => setFilters({ ...filters, diffType: e.target.value })}
                  className="h-8 text-xs"
                />
              </TableHead>
              <TableHead>
                <Input
                  type="text"
                  placeholder="Filter..."
                  value={filters.timestamp}
                  onChange={(e) => setFilters({ ...filters, timestamp: e.target.value })}
                  className="h-8 text-xs"
                />
              </TableHead>
              <TableHead className="text-right">
                <Input
                  type="text"
                  placeholder="Filter..."
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                  className="h-8 text-xs"
                />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiffs.map((diff) => {
              return (
                <TableRow key={diff.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={checkedDiffs.has(diff.id)}
                      onCheckedChange={() => handleToggleChecked(diff.id)}
                    />
                  </TableCell>
                  <TableCell
                    className="font-mono text-xs text-muted-foreground cursor-pointer"
                    onClick={() => onDiffSelect(diff.id)}
                  >
                    {diff.jobId}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => onDiffSelect(diff.id)}
                  >
                    <Badge variant="outline" className="font-mono text-xs">
                      {diff.diffType === "status_code" ? "Status Code" : "Body"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-sm cursor-pointer"
                    onClick={() => onDiffSelect(diff.id)}
                  >
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(diff.timestamp), "MMM d, h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-right text-sm text-muted-foreground cursor-pointer"
                    onClick={() => onDiffSelect(diff.id)}
                  >
                    {diff.metadata?.duration ? `${diff.metadata.duration}ms` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCurl({
                            prod: diff.prodCurlRequest,
                            integ: diff.integCurlRequest
                          });
                        }}
                      >
                        <Code className="h-4 w-4 mr-1" />
                        cURL
                      </Button>
                      {isDeletedCategory ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenJiraTicket(diff);
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Jira
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreDiff(diff.id);
                            }}
                          >
                            Restore
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDiff(diff.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

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
