"use client";

import { motion } from "framer-motion";
import { ExternalLink, Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface BlogCardProps {
  title: string;
  url: string;
  publishedAt: string;
  preview: string;
  index?: number;
}

export function BlogCard({
  title,
  url,
  publishedAt,
  preview,
  index = 0,
}: BlogCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl group-hover:text-accent transition-colors mb-3 line-clamp-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  {title}
                </a>
              </CardTitle>

              <CardDescription className="flex items-center gap-4 text-sm flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(publishedAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {calculateReadTime(preview)}
                </span>
              </CardDescription>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors p-2 -m-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Read "${title}" on Medium`}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {preview}
          </p>

          <div className="mt-4 pt-4 border-t border-border">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Read on Medium
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
