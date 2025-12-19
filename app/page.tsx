import { BugReportForm } from "@/components/original-contact-form";
import { SignUpForm } from "@/components/signup-form";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mt-20 flex flex-col gap-5 justify-center items-center">
      <h1 className="text-2xl">Newsletter Sign Up Form</h1>
      <SignUpForm />
      {/* <BugReportForm /> */}
    </main>
  );
}
