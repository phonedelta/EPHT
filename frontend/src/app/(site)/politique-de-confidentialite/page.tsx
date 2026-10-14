import type { Metadata } from "next";

import { Placeholder } from "@/components/system/Placeholder";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const title = getDictionary().footer.privacy;

export const metadata: Metadata = pageMetadata({ title, path: routes.privacy });

export default function PrivacyPage() {
  return <Placeholder title={title} />;
}
