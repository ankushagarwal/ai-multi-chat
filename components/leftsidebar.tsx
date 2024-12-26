import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

export default function LeftSidebar() {
  return (
    <div className="z-30 sticky top-[57px] flex-shrink-0 border-r w-14 bg-background-100 px-4 md:flex flex-col items-center justify-between h-[calc(100dvh-57px)]">
      <div className="flex flex-col gap-3 sticky top-[57px] py-4">
        <Button size="icon" variant="ghost">
          <Plus />
        </Button>
        <Button size="icon" variant="ghost">
          <Settings />
        </Button>
      </div>
    </div>
  );
}
