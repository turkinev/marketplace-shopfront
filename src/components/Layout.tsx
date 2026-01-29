import { ReactNode, useState } from "react";
import { DesktopHeader } from "./DesktopHeader";
import { MobileBurgerMenu } from "./MobileBurgerMenu";
import { SearchBar } from "./SearchBar";
import { Bell, User, ShoppingCart, Mail, Package, Gift, ListChecks, UserCircle, QrCode, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-primary shadow-sm">
        {/* Top Row: Logo and Icons */}
        <div className="flex items-center justify-between h-12 px-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LOGO</span>
            </div>
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9"
              onClick={() => setIsProfileMenuOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center px-0.5">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Second Row: Burger Menu + Search */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <MobileBurgerMenu />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Mobile Profile Menu */}
      <Sheet open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0">
          <SheetHeader className="p-4 border-b border-border bg-primary text-primary-foreground">
            <SheetTitle className="text-primary-foreground text-left">Профиль</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-[calc(100%-60px)] overflow-y-auto bg-background">
            {/* User Info */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">Иван Иванов</p>
                  <p className="text-sm text-muted-foreground">ivan@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1">
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Личные сообщения</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Избранные закупки</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Gift className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Список желаний</span>
              </button>

              <div className="h-2 bg-secondary" />

              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <ListChecks className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Личный кабинет</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Профиль</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Все заказы</span>
              </button>

              <div className="h-2 bg-secondary" />

              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">QR-код для получения заказа</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col items-start">
                  <span className="text-foreground">Пункт выдачи</span>
                  <span className="text-sm text-muted-foreground">ул. Примерная, д. 1</span>
                </div>
              </button>

              <div className="h-2 bg-secondary" />

              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors text-destructive"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>Выход</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      {children}
    </div>
  );
};
