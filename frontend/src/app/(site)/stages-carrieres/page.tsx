import type { Metadata } from "next";

import { Placeholder } from "@/components/system/Placeholder";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const title = getDictionary().nav.careers;

export const metadata: Metadata = pageMetadata({ title, path: routes.careers });

export default function CareersPage() {
  return <Placeholder title={title} />;
}
