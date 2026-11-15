import Link from "next/link";
import { TBC, contact, faqs, specs } from "@/config/site";
import { Logo } from "./Logo";
import { Picture } from "./Picture";

const benefits = [
  {
    title: "Anatomical detail",
    text: "Anatomical folds and contours modelled in three dimensions, in deep red silicone with one white central vessel.",
  },
  {
    title: "Hands-on suturing practice",
    text: "A physical model to hold, turn and stitch, so technique is rehearsed by hand rather than on a screen.",
  },
  {
    title: "Flexible training environments",
    text: "Made for use outside the clinical environment: at home, in a university laboratory or in a training facility.",
  },
];

export function Intro() {
  return (
    <section id="product" className="py-20 lg:py-32">
      <div className="frame grid gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <figure className="overflow-hidden rounded-2xl bg-paper">
            <Picture
              name="heart-presentation"
              alt="CardioSim silicone heart resting on a white laboratory surface"
              width={1168}
              height={880}
              className="h-auto w-full"
            />
          </figure>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-6">
            <p className="max-w-[24rem] text-[0.8125rem] leading-relaxed text-mute">
              Product visualisation. The red body and the single white central vessel are shown as specified for the
              production model.
            </p>
            <figure className="-mt-20 w-36 overflow-hidden rounded-xl border-4 border-white sm:-mt-28 sm:w-56">
              <Picture
                name="heart-macro"
                alt="Close-up of the red silicone surface with raised vessels"
                width={1168}
                height={880}
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </figure>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
          <h2 className="h-section">Designed for deliberate practice.</h2>
          <p className="lede mt-6">
            CardioSim is a reusable anatomical silicone heart for cardiovascular suturing practice. It gives doctors,
            surgeons and students a model to rehearse stitching technique on, as often as they choose.
          </p>
          <dl className="mt-10">
            {benefits.map((b) => (
              <div key={b.title} className="border-t border-line py-5 last:border-b">
                <dt className="font-medium tracking-[-0.01em]">{b.title}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-mute">{b.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Specs() {
  return (
    <section id="specifications" className="py-20 lg:py-32">
      <div className="frame grid gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="h-section">Product specifications</h2>
          <p className="lede mt-6 max-w-[22rem]">
            Entries marked “{TBC}” are being finalised by the product team and will be published here.
          </p>
        </div>
        <dl className="lg:col-span-7 lg:col-start-6">
          {specs.map((s) => (
            <div
              key={s.label}
              className="grid grid-cols-1 gap-1 border-t border-line py-4.5 last:border-b sm:grid-cols-[13rem_1fr] sm:gap-6"
            >
              <dt className="text-[0.9375rem] text-mute">{s.label}</dt>
              <dd className="text-[0.9375rem]">{s.value ?? <span className="tag">{TBC}</span>}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-t border-line py-20 lg:py-32">
      <div className="frame grid gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="h-section">Questions</h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-line last:border-b">
              <summary className="flex items-center justify-between gap-6 py-5 text-[1.0625rem] font-medium tracking-[-0.01em]">
                {f.q}
                <svg className="chev shrink-0 text-mute" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                  <path d="M8 2.500v11M2.500 8h11" />
                </svg>
              </summary>
              <p className="max-w-[38rem] pb-6 text-[0.9375rem] leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const policies = [
  { href: "/contact/", label: "Contact" },
  { href: "/shipping-returns/", label: "Shipping & Returns" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms & Conditions" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="frame flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-[20rem] text-sm leading-relaxed text-mute">
            Anatomical silicone heart models for surgical suturing practice.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:flex sm:flex-wrap">
          {policies.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="text-ink underline-offset-4 hover:underline">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="frame border-t border-line py-5 text-[0.8125rem] text-mute">
        © 2026 {contact.companyLegalName ?? "CardioSim"}
      </div>
    </footer>
  );
}
