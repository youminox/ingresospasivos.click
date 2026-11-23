import Image from "next/image";
import Link from "next/link";

export interface ProfileMoment {
  img: string;
  alt: string;
  tag: string;
  title: string;
  desc: string;
  href: string;
}

export default function ProfilesCarousel({
  items,
}: {
  items: ProfileMoment[];
}) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
      {items.map((m) => (
        <Link
          key={m.title}
          href={m.href}
          className="card spot group w-[290px] shrink-0 snap-start overflow-hidden sm:w-[340px]"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={m.img}
              alt={m.alt}
              fill
              sizes="340px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-full bg-[#07131d]/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-fxlime">
              {m.tag}
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-extrabold text-fxink group-hover:text-fxblue">
              {m.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{m.desc}</p>
            <span className="mt-4 inline-block text-xs font-bold text-fxbluedeep">
              Ver ruta recomendada →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
