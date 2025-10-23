import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DiffList } from "@/components/diffs/DiffList";
import { DiffDetail } from "@/components/diffs/DiffDetail";
import { FileCode } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDiffId, setSelectedDiffId] = useState<string | null>(null);

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
            <div className="flex items-center gap-2">
              <FileCode className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Diff Dashboard</h1>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {selectedDiffId ? (
              <DiffDetail diffId={selectedDiffId} onBack={handleBack} />
            ) : (
              <DiffList category={selectedCategory} onDiffSelect={handleDiffSelect} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
