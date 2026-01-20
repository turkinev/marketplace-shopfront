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
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-3 h-9 bg-secondary border-0 rounded-lg"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
};
