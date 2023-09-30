import { UpdatePassword } from "@/types/types";

export const putUpdatePassword = async (
  passwordFields: UpdatePassword
): Promise<Response> => {
  const response = await fetch("/auth/account/update-password", {
    method: "PUT",
    body: JSON.stringify(passwordFields),
  });

  return response;
};

export const deleteUserAccount = async (): Promise<Response> => {
  const response = await fetch("/auth/account/delete", {
    method: "DELETE",
  });

  return response;
};

export const putSetPassword = async (
  newPassword: string
): Promise<Response> => {
  const response = await fetch("/auth/account/set-password", {
    method: "PUT",
    body: JSON.stringify(newPassword),
  });

  return response;
};
