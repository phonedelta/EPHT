import { Mail, MapPin, Phone } from "lucide-react";

import { SOCIAL_LABELS, SOCIAL_NETWORKS, SocialIcon } from "@/components/ui/SocialIcon";
import type { ContactSettings, SocialSettings } from "@/lib/api/schemas";
import { phoneHref } from "@/lib/format";

type TopBarProps = {
  contact: ContactSettings;
  social: SocialSettings;
};

/**
 * Bandeau de coordonnées au-dessus de l'en-tête (grands écrans). Les valeurs
 * viennent des paramètres du site ; une coordonnée vide n'est pas affichée.
 */
export function TopBar({ contact, social }: TopBarProps) {
  const location = [contact.district, contact.city].filter(Boolean).join(", ");
  const networks = SOCIAL_NETWORKS.filter((network) => social[network]);

  if (!location && !contact.phone && !contact.email && networks.length === 0) {
    return null;
  }

  return (
    <div className="on-dark hidden bg-ink text-[0.8125rem] text-white/80 lg:block">
      <div className="container-page flex h-10 items-center justify-between gap-8">
        <ul className="flex items-center gap-7">
          {location ? (
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-cyan-300" />
              {location}
            </li>
          ) : null}
          {contact.phone ? (
            <li>
              <a
                href={phoneHref(contact.phone)}
                className="flex items-center gap-2 transition-colors duration-300 hover:text-white"
              >
                <Phone aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-cyan-300" />
                {contact.phone}
              </a>
            </li>
          ) : null}
          {contact.email ? (
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 transition-colors duration-300 hover:text-white"
              >
                <Mail aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-cyan-300" />
                {contact.email}
              </a>
            </li>
          ) : null}
        </ul>

        {networks.length > 0 ? (
          <ul className="flex items-center gap-4">
            {networks.map((network) => (
              <li key={network}>
                <a
                  href={social[network] ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SOCIAL_LABELS[network]} (nouvel onglet)`}
                  className="block text-white/70 transition-colors duration-300 hover:text-cyan-300"
                >
                  <SocialIcon network={network} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
