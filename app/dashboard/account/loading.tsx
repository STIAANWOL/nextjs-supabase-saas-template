import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <ScrollArea className="h-[calc(100%-200px)] mb-[200px] w-full">
      <div className="flex justify-center">
        <Skeleton className="h-16 w-64" />
      </div>
      <div className="flex justify-center pt-5 pb-10">
        <Skeleton className="h-6 w-72" />
      </div>
    </ScrollArea>
  );
}
