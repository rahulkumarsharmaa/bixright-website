import { Suspense } from "react";
import Login from "@/app/user/login/Login";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
