import { CustomChart } from "@custom/CustomChart";
import type { ChartData } from "@custom/CustomChart";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function fetchEntidades(): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/v1/dashboard/entidades`);
  return res.json();
}


async function fetchPersonal(): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/v1/dashboard/personal`);
  return res.json();

}

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-foreground flex flex-wrap content-start p-2">
      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "entidades"]}
          queryFn={fetchEntidades}
          colors={["#70AB6D"]}
        />
      </div>


      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "personal"]}
          queryFn={fetchPersonal}
          colors={["#C8796F"]}
          orientation="vertical"
        />
      </div>
 

    </main>
  );
}
