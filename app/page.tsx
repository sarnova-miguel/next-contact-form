import { SignUpForm } from "@/components/signup-form";

export default function Home() {
  return (
    <main className="my-20 px-4 flex flex-col gap-5 justify-center items-center">
      <h1 className="text-2xl">Newsletter Sign Up Form</h1>
      <SignUpForm />
      {/* <BugReportForm /> */}
    </main>
  );
}
