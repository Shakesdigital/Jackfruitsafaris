import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  // Only fetch at runtime if env vars are available
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <section className="min-h-screen bg-[#fbfaf5] p-8">
        <h1 className="text-3xl font-bold mb-6">Safaris</h1>
        <p className="text-gray-600">Content will be loaded from the database at runtime.</p>
      </section>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch safari packages from Supabase – this will run on the server
  const { data: tours, error } = await supabase.from("safari_packages").select("id, title, slug, summary, featured_image_url, duration, price_from, currency");

  if (error) {
    console.error("Error fetching safaris from Supabase", error);
    return <p>Failed to load safaris.</p>;
  }

  return (
    <section className="min-h-screen bg-[#fbfaf5] p-8">
      <h1 className="text-3xl font-bold mb-6">Safaris from Supabase</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tours?.map((tour: any) => (
          <article key={tour.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="text-xl font-bold mb-2">{tour.title}</h2>
            <p className="mb-2 text-gray-700">{tour.summary}</p>
            {tour.featured_image_url && (
              <img
                src={tour.featured_image_url}
                alt={tour.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <p className="mt-2 text-sm text-gray-600">
              {tour.duration} &middot; {tour.currency} {tour.price_from}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
