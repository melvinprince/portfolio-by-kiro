import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

// Custom components for MDX content
export const mdxComponents = {
  // Headings with anchor links
  h1: ({ children, ...props }: { children: ReactNode }) => (
    <h1 className="text-4xl font-bold mb-6 text-foreground" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: { children: ReactNode }) => (
    <h2 className="text-3xl font-semibold mb-4 mt-8 text-foreground" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: { children: ReactNode }) => (
    <h3 className="text-2xl font-semibold mb-3 mt-6 text-foreground" {...props}>
      {children}
    </h3>
  ),

  h4: ({ children, ...props }: { children: ReactNode }) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props}>
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children, ...props }: { children: ReactNode }) => (
    <p className="mb-4 text-muted-foreground leading-relaxed" {...props}>
      {children}
    </p>
  ),

  // Links
  a: ({ href, children, ...props }: { href?: string; children: ReactNode }) => {
    if (href?.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href || "#"}
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Lists
  ul: ({ children, ...props }: { children: ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: { children: ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }: { children: ReactNode }) => (
    <li className="text-muted-foreground" {...props}>
      {children}
    </li>
  ),

  // Code blocks
  pre: ({ children, ...props }: { children: ReactNode }) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  code: ({ children, ...props }: { children: ReactNode }) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }: { children: ReactNode }) => (
    <blockquote
      className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Images
  img: ({ src, alt, ...props }: { src?: string; alt?: string }) => (
    <div className="mb-4">
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={600}
        className="rounded-lg"
        {...props}
      />
    </div>
  ),

  // Tables
  table: ({ children, ...props }: { children: ReactNode }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: { children: ReactNode }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }: { children: ReactNode }) => (
    <tbody {...props}>{children}</tbody>
  ),

  tr: ({ children, ...props }: { children: ReactNode }) => (
    <tr className="border-b border-border" {...props}>
      {children}
    </tr>
  ),

  th: ({ children, ...props }: { children: ReactNode }) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: { children: ReactNode }) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),

  // Horizontal rule
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),

  // Strong and emphasis
  strong: ({ children, ...props }: { children: ReactNode }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }: { children: ReactNode }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
};

// Export for use in MDX files
export default mdxComponents;
