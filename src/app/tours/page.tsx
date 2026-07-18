import { supabaseAdmin } from "@/lib/supabase";

export default async function ToursPage() {
  // Fetch tours from Supabase – this will run on the server
  const { data: tours, error } = await supabaseAdmin.from("tours").select("id, title, slug, description, image_url");
  if (error) {
    console.error("Error fetching tours from Supabase", error);
    return <p>Failed to load tours.</p>;
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Tours from Supabase</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour: any) => (
          <article key={tour.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-bold mb-2">{tour.title}</h2>
            <p className="mb-2">{tour.description}</p>
            {tour.image_url && (
              <img
                src={tour.image_url}
                alt={tour.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
