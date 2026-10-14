import type { Metadata } from "next";

import { Placeholder } from "@/components/system/Placeholder";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const title = getDictionary().nav.news;

export const metadata: Metadata = pageMetadata({ title, path: routes.news });

export default function NewsPage() {
  return <Placeholder title={title} />;
}
