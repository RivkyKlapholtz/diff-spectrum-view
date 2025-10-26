import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DiffList } from "@/components/diffs/DiffList";
import { DiffDetail } from "@/components/diffs/DiffDetail";
import { JobsSummary } from "@/components/dashboard/JobsSummary";
import { SummaryDialog } from "@/components/dashboard/SummaryDialog";
import { Button } from "@/components/ui/button";
import { FileCode, BarChart3 } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDiffId, setSelectedDiffId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedDiffId(null);
  };

  const handleDiffSelect = (diffId: string) => {
    setSelectedDiffId(diffId);
  };

  const handleBack = () => {
    setSelectedDiffId(null);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2 flex-1">
              <FileCode className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Diff Dashboard</h1>
            </div>
            <Button variant="outline" onClick={() => setShowSummary(true)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Summary
            </Button>
          </header>
          
          <main className="flex-1 overflow-auto">
            {selectedDiffId ? (
              <DiffDetail diffId={selectedDiffId} onBack={handleBack} />
            ) : selectedCategory ? (
              <DiffList category={selectedCategory} onDiffSelect={handleDiffSelect} />
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome to Diff Dashboard</h2>
                  <p className="text-muted-foreground">
                    Select a category from the sidebar to view diffs
                  </p>
                </div>
                <JobsSummary />
              </div>
            )}
          </main>
        </div>
        
        <SummaryDialog open={showSummary} onOpenChange={setShowSummary} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
