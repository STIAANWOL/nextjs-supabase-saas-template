import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <Button variant="outline">Logout</Button>
    </form>
  );
}
