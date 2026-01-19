import { useState, useRef, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Search,
  X
} from "lucide-react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

interface LargeResponseViewerProps {
  prodValue: string;
  integValue: string;
}

// Thresholds for different handling modes
const TRUNCATE_THRESHOLD = 50000; // 50KB - show truncated with "show more"
const WARNING_THRESHOLD = 200000; // 200KB - show warning and offer download
const MAX_LINES_INITIAL = 500; // Show first 500 lines initially

export function LargeResponseViewer({ prodValue, integValue }: LargeResponseViewerProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"diff" | "side-by-side-virtual">("diff");
  
  const prodSize = prodValue.length;
  const integSize = integValue.length;
  const totalSize = prodSize + integSize;
  const isLarge = totalSize > TRUNCATE_THRESHOLD;
  const isVeryLarge = totalSize > WARNING_THRESHOLD;

  const prodLines = useMemo(() => prodValue.split("\n"), [prodValue]);
  const integLines = useMemo(() => integValue.split("\n"), [integValue]);
  const maxLines = Math.max(prodLines.length, integLines.length);

  // Filter lines based on search term
  const filteredLineIndices = useMemo(() => {
    if (!searchTerm) return null;
    const indices: number[] = [];
    const searchLower = searchTerm.toLowerCase();
    for (let i = 0; i < maxLines; i++) {
      const prodLine = prodLines[i] || "";
      const integLine = integLines[i] || "";
      if (prodLine.toLowerCase().includes(searchLower) || integLine.toLowerCase().includes(searchLower)) {
        indices.push(i);
      }
    }
    return indices;
  }, [searchTerm, prodLines, integLines, maxLines]);

  // Truncate content for initial view
  const truncatedProdValue = useMemo(() => {
    if (showFullContent || !isLarge) return prodValue;
    return prodLines.slice(0, MAX_LINES_INITIAL).join("\n") + 
      (prodLines.length > MAX_LINES_INITIAL ? `\n\n... (${prodLines.length - MAX_LINES_INITIAL} more lines)` : "");
  }, [prodValue, prodLines, showFullContent, isLarge]);

  const truncatedIntegValue = useMemo(() => {
    if (showFullContent || !isLarge) return integValue;
    return integLines.slice(0, MAX_LINES_INITIAL).join("\n") + 
      (integLines.length > MAX_LINES_INITIAL ? `\n\n... (${integLines.length - MAX_LINES_INITIAL} more lines)` : "");
  }, [integValue, integLines, showFullContent, isLarge]);

  const downloadResponse = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Default behavior: always show truncated view with expand option

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Response Comparison: Production vs Integration</CardTitle>
          <div className="flex items-center gap-2">
            {isLarge && (
              <Badge variant="secondary">
                {formatBytes(totalSize)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search within response */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש בתוך ה-Response..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {filteredLineIndices !== null && (
            <Badge variant="outline">
              {filteredLineIndices.length} תוצאות
            </Badge>
          )}
        </div>

        {/* Show truncation notice */}
        {isLarge && !showFullContent && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>תוכן מקוצר</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>מוצגות {MAX_LINES_INITIAL} שורות ראשונות מתוך {maxLines} שורות</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFullContent(true)}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  הצג הכל
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadResponse(prodValue, "production-response.json")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  הורד
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Collapse button when showing full content */}
        {isLarge && showFullContent && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFullContent(false)}
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              הצג פחות
            </Button>
          </div>
        )}

        {/* Diff viewer */}
        <div className="rounded-lg overflow-hidden border max-h-[600px] overflow-y-auto">
          <ReactDiffViewer
            oldValue={truncatedProdValue}
            newValue={truncatedIntegValue}
            splitView={true}
            compareMethod={DiffMethod.WORDS}
            leftTitle="Production (Normalized)"
            rightTitle="Integration (Normalized)"
            useDarkTheme={false}
            hideLineNumbers={false}
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
  );
}

// Virtualized side-by-side viewer for very large content
interface VirtualizedSideBySideProps {
  prodLines: string[];
  integLines: string[];
  searchTerm: string;
  filteredLineIndices: number[] | null;
}

function VirtualizedSideBySide({ 
  prodLines, 
  integLines, 
  searchTerm,
  filteredLineIndices 
}: VirtualizedSideBySideProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const displayLines = filteredLineIndices || Array.from({ length: Math.max(prodLines.length, integLines.length) }, (_, i) => i);

  const virtualizer = useVirtualizer({
    count: displayLines.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    overscan: 20,
  });

  const highlightSearch = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={i} className="bg-yellow-300 dark:bg-yellow-700">{part}</mark>
        : part
    );
  };

  return (
    <div 
      ref={parentRef} 
      className="h-[500px] overflow-auto border rounded-lg"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-2 bg-muted border-b">
          <div className="px-4 py-2 font-semibold text-sm border-r">Production</div>
          <div className="px-4 py-2 font-semibold text-sm">Integration</div>
        </div>

        {virtualizer.getVirtualItems().map((virtualItem) => {
          const lineIndex = displayLines[virtualItem.index];
          const prodLine = prodLines[lineIndex] || "";
          const integLine = integLines[lineIndex] || "";
          const isDifferent = prodLine !== integLine;

          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start + 32}px)`, // +32 for header
              }}
              className="grid grid-cols-2"
            >
              <div 
                className={`px-2 py-0.5 font-mono text-xs border-r truncate ${
                  isDifferent ? "bg-red-50 dark:bg-red-950" : ""
                }`}
                title={prodLine}
              >
                <span className="text-muted-foreground mr-2 select-none">
                  {lineIndex + 1}
                </span>
                {highlightSearch(prodLine)}
              </div>
              <div 
                className={`px-2 py-0.5 font-mono text-xs truncate ${
                  isDifferent ? "bg-green-50 dark:bg-green-950" : ""
                }`}
                title={integLine}
              >
                <span className="text-muted-foreground mr-2 select-none">
                  {lineIndex + 1}
                </span>
                {highlightSearch(integLine)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
