import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export const SearchBar = ({ 
  placeholder = "Искать в магазине", 
  onSearch,
  onFilter 
}: SearchBarProps) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-10 bg-card border-0 shadow-sm"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <Button 
        variant="secondary" 
        size="icon" 
        className="flex-shrink-0 shadow-sm"
        onClick={onFilter}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};
