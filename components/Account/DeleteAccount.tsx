"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { deleteUserAccount } from "@/services/clientServices";
import Callout from "../Callout";

export default function DeleteAccount() {
  const router = useRouter();

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const deleteAccount = async () => {
    const response = await deleteUserAccount();

    if (response.status !== 200) {
      const responseBody: string = await response.json();

      setError(true);
      setErrorText(responseBody);
    }

    if (response.status === 200) {
      router.push("/sign-up");
    }
  };

  return (
    <>
      <div className="pb-3">
        <Separator className="mt-5 mb-2 w-full" />
        <h3 className="text-md md:text-lg text-destructive">Danger zone</h3>
      </div>

      {error && (
        <div className="pb-3">
          <Callout isError header="Error" description={errorText} />
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <Trash2 strokeWidth={1.5} height={24} width={24} />
            <span className="pl-2">Delete account</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAccount}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
