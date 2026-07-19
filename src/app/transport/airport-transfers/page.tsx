import type { Metadata } from "next";
import { Car, CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { Section } from "@/components/section";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Airport Pickups and Transport Services",
  description:
    "Book reliable Entebbe airport pickups, Kampala and Jinja transfers, hotel transfers, safari vehicle hire, and group transport with Jackfruit Safaris.",
};

const services = [
  "Entebbe airport pickup",
  "Entebbe to Kampala transfer",
  "Entebbe or Kampala to Jinja transfer",
  "Hotel transfers",
  "Safari vehicle hire with driver",
  "Group transport",
  "Late-night or early-morning transfers by arrangement",
];

export default function AirportTransfersPage() {
  return (
    <>
      <section
        className="relative min-h-[58vh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${images.vehicle})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/90 via-[#08170f]/58 to-[#08170f]/18" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-end px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
              <Car size={18} />
              Transport
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Airport Pickups and Transport Services
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">
              Reliable airport pickups, hotel transfers, Jinja transfers, and
              safari transport with professional drivers.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="text-3xl font-black text-[#10251b]">
              Start your Uganda trip with peace of mind
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#536154]">
              Jackfruit Safaris provides airport pickup from Entebbe
              International Airport and safe transfers to hotels, Jinja,
              Kampala, or your next safari destination.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {services.map((service: any) => (
                <p
                  key={service}
                  className="flex gap-3 rounded-[8px] bg-[#eef7f0] p-4 text-sm font-bold leading-6 text-[#27382b]"
                >
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#2d6f55]" size={18} />
                  {service}
                </p>
              ))}
            </div>
          </div>
          <QuoteForm sourcePage="airport-transfers" defaultService="Airport transfer" />
        </div>
      </Section>
    </>
  );
}
