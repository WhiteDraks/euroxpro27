import type { Metadata } from "next";
import { ErrorScreen } from "@/components/common/ErrorScreen";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      title="Lost in Kaleiçi?"
      text="This page doesn't exist. Let's get you back."
    />
  );
}
