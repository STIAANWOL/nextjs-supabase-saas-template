import { AlertCircle, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type CalloutProps = {
  header: string;
  description: string;
  isError?: boolean;
};

export default function Callout({
  header,
  description,
  isError,
}: CalloutProps) {
  return (
    <Alert variant={isError ? "destructive" : "default"}>
      {isError ? (
        <AlertCircle height={16} width={16} />
      ) : (
        <Terminal height={16} width={16} />
      )}

      <AlertTitle>{header}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
