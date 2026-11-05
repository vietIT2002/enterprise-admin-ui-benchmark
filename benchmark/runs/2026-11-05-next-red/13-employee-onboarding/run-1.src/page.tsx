import type { Metadata } from "next";
import { OnboardingForm } from "./_components/onboarding-form";

export const metadata: Metadata = { title: "New employee | Admin" };

export default function NewEmployeePage() {
  return <OnboardingForm />;
}
