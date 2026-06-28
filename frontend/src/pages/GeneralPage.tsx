import { useAuth } from "@/contexts/auth";

export default function GeneralPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-wrap content-start gap-0 p-2">
      {/* <div className="w-full lg:w-1/2 xl:w-1/2 p-1 min-w-0"> */}
      {/*   <CustomChart */}
      {/*     queryKey={["dashboard", "entidades"]} */}
      {/*     queryFn={({ signal }) => */}
      {/*       apiFetch("/api/v1/entidadesdependencias/entidades", { signal }).then((r) => r.json()) */}
      {/*     } */}
      {/*     colors={["#70AB6D"]} */}
      {/*   /> */}
      {/* </div> */}
      {/* <div className="w-full lg:w-1/2 xl:w-1/2 p-1 min-w-0"> */}
      {/*   <CustomChart */}
      {/*     queryKey={["dashboard", "personal"]} */}
      {/*     queryFn={({ signal }) => */}
      {/*       apiFetch("/api/v1/entidadesdependencias/personal", { signal }).then((r) => r.json()) */}
      {/*     } */}
      {/*     colors={["#C8796F"]} */}
      {/*     orientation="vertical" */}
      {/*   /> */}
      {/* </div> */}
      {/* <div className="w-full lg:w-1/2 xl:w-1/2 p-1 min-w-0"> */}
      {/*   <CustomChart */}
      {/*     queryKey={["dashboard", "personal2"]} */}
      {/*     queryFn={({ signal }) => */}
      {/*       apiFetch("/api/v1/entidadesdependencias/personal", { signal }).then((r) => r.json()) */}
      {/*     } */}
      {/*     colors={["#C8796F"]} */}
      {/*     orientation="vertical" */}
      {/*   /> */}
      {/* </div> */}
    </div>
  );
}
