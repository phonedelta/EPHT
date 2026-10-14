import type { Metadata } from "next";

import { PageTransition } from "@/components/motion/PageTransition";
import { Placeholder } from "@/components/system/Placeholder";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const title = getDictionary().footer.legal;

export const metadata: Metadata = pageMetadata({ title, path: routes.legal });

export default function LegalPage() {
  return (
    <PageTransition>
      <Placeholder title={title} path={routes.legal} />
    </PageTransition>
  );
}
