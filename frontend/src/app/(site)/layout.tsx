import { SiteFrame } from "@/components/layout/SiteFrame";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteFrame>{children}</SiteFrame>;
}
