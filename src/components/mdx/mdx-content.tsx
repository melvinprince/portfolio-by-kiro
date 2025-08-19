"use client";

import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx-components";

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote source={content} components={mdxComponents} />
    </div>
  );
}
