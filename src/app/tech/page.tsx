import type { Metadata } from "next";
import { TechPageContent } from "./tech-page-content";
import { generateTechMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateTechMetadata();

export default function TechPage() {
  return <TechPageContent />;
}
