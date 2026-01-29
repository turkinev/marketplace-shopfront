import { ReactNode } from "react";
import { DesktopHeader } from "./DesktopHeader";
import { MobileBurgerMenu } from "./MobileBurgerMenu";
import { SearchBar } from "./SearchBar";
import { Bell, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-primary shadow-sm">
        {/* Top Row */}
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2">
            <MobileBurgerMenu />
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-foreground">63pokupki</span>
            </a>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Search Row */}
        <div className="px-4 pb-3">
          <SearchBar />
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
};
