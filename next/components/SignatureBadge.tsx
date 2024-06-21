import { UserState } from "@/lib/hooks/use-user";
import { Badge } from "./ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SignatureBadge = ({
  signature,
}: {
  signature: UserState["signature"];
}) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-2">
      {signature?.hex && (
        <Badge
          className={
            signature?.valid ? "bg-lime-700 dark:bg-lime-400" : "bg-red-500"
          }
        >
          <div
            className={cn(
              "flex gap-[2px] ml-1",
              signature.valid
                ? "text-lime-50 dark:text-lime-950"
                : "text-red-800 dark:text-red-500",
            )}
          >
            <p className="text-xs">{signature.valid ? "Valid" : "Invalid"}</p>
            {signature.valid ? (
              <Check className="h-4 w-4 " />
            ) : (
              <X className="h-4 w-4 " />
            )}
          </div>
        </Badge>
      )}
    </div>
    {signature?.hex && (
      <p className="text-[10px] max-w-sm break-all mt-2 leading-[12px]">
        Length: {signature?.hex ? signature.hex.length : ""}
        <br />
        {signature?.hex || ""}
      </p>
    )}
  </div>
);

export default SignatureBadge;
