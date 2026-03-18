import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface SizeChartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sizeData = [
  { size: "75A", bust: "86-88", underbust: "73-77" },
  { size: "75B", bust: "88-90", underbust: "73-77" },
  { size: "75C", bust: "90-92", underbust: "73-77" },
  { size: "80A", bust: "91-93", underbust: "78-82" },
  { size: "80B", bust: "93-95", underbust: "78-82" },
  { size: "80C", bust: "95-97", underbust: "78-82" },
  { size: "85A", bust: "96-98", underbust: "83-87" },
  { size: "85B", bust: "98-100", underbust: "83-87" },
  { size: "85C", bust: "100-102", underbust: "83-87" },
];

export const SizeChartSheet = ({ open, onOpenChange }: SizeChartSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold">Таблица размеров</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Размер</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Обхват груди</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Под грудью</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row) => (
                <tr key={row.size} className="border-b border-border last:border-0">
                  <td className="py-2.5 px-3 font-medium text-foreground">{row.size}</td>
                  <td className="py-2.5 px-3 text-foreground">{row.bust}</td>
                  <td className="py-2.5 px-3 text-foreground">{row.underbust}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  );
};
