import { FileJson, Hash, Network, Search, FileText, Clock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useDiffStats } from "@/hooks/useDiffs";

const categoryIcons: Record<string, any> = {
  json_response: FileJson,
  status_code: Hash,
  headers: Network,
  query_params: Search,
  request_body: FileText,
  timing: Clock,
};

interface AppSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

export function AppSidebar({ selectedCategory, onCategorySelect }: AppSidebarProps) {
  const { state } = useSidebar();
  const { data: stats, isLoading } = useDiffStats();
  const isCollapsed = state === "collapsed";
  
  // Get deleted diffs with their categories from localStorage
  const deletedDiffsWithCategories = (() => {
    const stored = localStorage.getItem('deletedDiffsWithCategories');
    return stored ? JSON.parse(stored) : {};
  })();
  
  const deletedDiffsCount = Object.keys(deletedDiffsWithCategories).length;
  
  // Adjust counts based on deleted diffs
  const adjustedCategories = stats?.categories.map(cat => {
    if (cat.id === 'deleted_diffs') {
      return { ...cat, count: deletedDiffsCount };
    }
    // For other categories, subtract their deleted diffs
    const deletedInThisCategory = Object.values(deletedDiffsWithCategories).filter(
      (category) => category === cat.id
    ).length;
    return { ...cat, count: Math.max(0, cat.count - deletedInThisCategory) };
  }) || [];

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            {!isCollapsed && "Diff Categories"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : (
                adjustedCategories.map((category) => {
                  const Icon = categoryIcons[category.id] || FileJson;
                  const isActive = selectedCategory === category.id;
                  const displayCount = category.id === 'deleted_diffs' ? deletedDiffsCount : category.count;

                  return (
                    <SidebarMenuItem key={category.id}>
                      <SidebarMenuButton
                        onClick={() => onCategorySelect(category.id)}
                        className={isActive ? "bg-primary text-primary-foreground" : ""}
                      >
                        <Icon className="h-4 w-4" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{category.label}</span>
                            <Badge variant="secondary" className="ml-auto">
                              {displayCount}
                            </Badge>
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
