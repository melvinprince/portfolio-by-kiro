"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  contactFormSchema,
  type ContactFormData,
  contactFormDefaults,
} from "@/lib/contact-schema";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  generateFormIds,
  getValidationAttributes,
  getLoadingAttributes,
  liveRegionAttributes,
} from "@/lib/accessibility-utils";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export function ContactForm() {
  const [formData, setFormData] =
    useState<ContactFormData>(contactFormDefaults);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const prefersReducedMotion = useReducedMotion();

  // Generate consistent IDs for form elements
  const nameIds = generateFormIds("contact-name");
  const emailIds = generateFormIds("contact-email");
  const messageIds = generateFormIds("contact-message");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sendCopy: checked }));
  };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: FormErrors = {};

      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        zodError.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          newErrors[field] = err.message;
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setFormState("success");
      setFormData(contactFormDefaults);
    } catch (error) {
      setFormState("error");
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";
      setErrors({
        general: errorMessage,
      });
    }
  };

  const resetForm = () => {
    setFormState("idle");
    setErrors({});
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
      };

  if (formState === "success") {
    return (
      <Card>
        <CardContent className="p-8">
          <motion.div className="text-center space-y-4" {...animationProps}>
            <motion.div
              className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto"
              {...(!prefersReducedMotion && {
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { delay: 0.2, type: "spring", stiffness: 200 },
              })}
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. I'll get back to you as soon as
                possible.
              </p>
              <Button onClick={resetForm} variant="outline">
                Send Another Message
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle id="contact-form-title">Send a Message</CardTitle>
        <CardDescription id="contact-form-description">
          Fill out the form below and I'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          aria-labelledby="contact-form-title"
          aria-describedby="contact-form-description"
          noValidate
        >
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              opacity: 0,
              pointerEvents: "none",
            }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={nameIds.input}>Name *</Label>
              <Input
                id={nameIds.input}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                disabled={formState === "submitting"}
                className={
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }
                required
                {...getValidationAttributes(errors.name, nameIds.error)}
                {...getLoadingAttributes(
                  formState === "submitting",
                  "Name field is loading"
                )}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    id={nameIds.error}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    {...(!prefersReducedMotion && {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                    })}
                    {...liveRegionAttributes.polite}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label htmlFor={emailIds.input}>Email *</Label>
              <Input
                id={emailIds.input}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                disabled={formState === "submitting"}
                className={
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                required
                {...getValidationAttributes(errors.email, emailIds.error)}
                {...getLoadingAttributes(
                  formState === "submitting",
                  "Email field is loading"
                )}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    id={emailIds.error}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    {...(!prefersReducedMotion && {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                    })}
                    {...liveRegionAttributes.polite}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={messageIds.input}>Message *</Label>
            <Textarea
              id={messageIds.input}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell me about your project, questions, or how I can help..."
              disabled={formState === "submitting"}
              className={`min-h-[120px] ${
                errors.message
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              required
              {...getValidationAttributes(errors.message, messageIds.error)}
              {...getLoadingAttributes(
                formState === "submitting",
                "Message field is loading"
              )}
              aria-describedby={`${messageIds.description} ${
                errors.message ? messageIds.error : ""
              }`}
            />
            <div className="flex justify-between items-center">
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    id={messageIds.error}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    {...(!prefersReducedMotion && {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                    })}
                    {...liveRegionAttributes.polite}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
              <span
                id={messageIds.description}
                className="text-sm text-muted-foreground"
                aria-label={`Character count: ${formData.message.length} of 2000 characters`}
              >
                {formData.message.length}/2000
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendCopy"
              checked={formData.sendCopy}
              onCheckedChange={handleCheckboxChange}
              disabled={formState === "submitting"}
            />
            <Label
              htmlFor="sendCopy"
              className="text-sm font-normal cursor-pointer"
            >
              Send me a copy of this message
            </Label>
          </div>

          <AnimatePresence>
            {errors.general && (
              <motion.div
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
                {...(!prefersReducedMotion && {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.95 },
                })}
                role="alert"
                {...liveRegionAttributes.assertive}
              >
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.general}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={formState === "submitting"}
            className="w-full"
            {...getLoadingAttributes(
              formState === "submitting",
              "Sending your message"
            )}
            aria-describedby={
              formState === "submitting" ? "submit-status" : undefined
            }
          >
            {formState === "submitting" ? (
              <>
                <Loader2
                  className="w-4 h-4 mr-2 animate-spin"
                  aria-hidden="true"
                />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                Send Message
              </>
            )}
          </Button>
          {formState === "submitting" && (
            <span
              id="submit-status"
              className="sr-only"
              {...liveRegionAttributes.polite}
            >
              Your message is being sent. Please wait.
            </span>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
