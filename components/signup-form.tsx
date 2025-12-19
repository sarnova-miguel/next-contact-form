"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { createContact } from "@/server/contact";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(7, "Phone Number must be at least 7 characters.")
    .max(10, "Phone Number must be at most 10 characters."),
  message: z.string().max(1000, "Message must be at most 1000 characters."),
});

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState<string>("");

  async function onSignUpSubmit(data: z.infer<typeof formSchema>) {
    // toast("You submitted the following values:", {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: "bottom-right",
    //   classNames: {
    //     content: "flex flex-col gap-2",
    //   },
    //   style: {
    //     "--border-radius": "calc(var(--radius)  + 4px)",
    //   } as React.CSSProperties,
    // });

    setIsSubmitting(true);
    setFormStatus("");

    try {
      await createContact(data.username, data.email, data.phone, data.message);
      toast.success("You have successfully signed up for our newsletter!");
      setFormStatus("Success! You have successfully signed up for our newsletter.");
      form.reset();
    } catch {
      toast.error("Failed to submit form");
      setFormStatus("Error: Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full sm:max-w-md" role="region" aria-labelledby="form-title">
      <CardHeader>
        <CardTitle id="form-title">Sign Up Form</CardTitle>
        <CardDescription id="form-description">
          Join our newsletter to get the latest news and discounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-rhf-newsletter"
          onSubmit={form.handleSubmit(onSignUpSubmit)}
          aria-describedby="form-description"
          noValidate
        >
          {/* Live region for form status announcements */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {formStatus}
          </div>

          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => {
                const errorId = `form-rhf-newsletter-username-error`;
                const describedBy = fieldState.invalid ? errorId : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-newsletter-username">
                      Name <span aria-label="required">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-newsletter-username"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      aria-describedby={describedBy}
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                    {fieldState.invalid && (
                      <FieldError id={errorId} errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => {
                const errorId = `form-rhf-newsletter-email-error`;
                const describedBy = fieldState.invalid ? errorId : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-newsletter-email">
                      Email <span aria-label="required">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-newsletter-email"
                      type="email"
                      placeholder="your@email.com"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      aria-describedby={describedBy}
                      autoComplete="email"
                      inputMode="email"
                    />
                    {fieldState.invalid && (
                      <FieldError id={errorId} errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => {
                const errorId = `form-rhf-newsletter-phone-error`;
                const describedBy = fieldState.invalid ? errorId : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-newsletter-phone">
                      Phone <span aria-label="required">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-newsletter-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      aria-describedby={describedBy}
                      autoComplete="tel"
                      inputMode="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError id={errorId} errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => {
                const descriptionId = `form-rhf-newsletter-message-description`;
                const errorId = `form-rhf-newsletter-message-error`;
                const charCountId = `form-rhf-newsletter-message-charcount`;
                const describedByIds = [
                  descriptionId,
                  charCountId,
                  fieldState.invalid ? errorId : null,
                ].filter(Boolean).join(' ');

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-newsletter-message">
                      Message
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-newsletter-message"
                        placeholder="Enter your message"
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={describedByIds}
                        aria-required="false"
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText
                          id={charCountId}
                          className="tabular-nums"
                          aria-live="polite"
                        >
                          {field.value.length}/1000 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription id={descriptionId}>
                      Tell us what&apos;s on your mind.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError id={errorId} errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            aria-label="Reset form to clear all fields"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="form-rhf-newsletter"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Submitting form, please wait" : "Submit newsletter signup form"}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
