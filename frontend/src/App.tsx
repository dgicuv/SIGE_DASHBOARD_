import { CustomChart } from "@custom/CustomChart";

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-foreground flex flex-wrap content-start p-2">
      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          title="Entidades - Dependencias"
          footer="Fecha de corte: Diciembre de 2025. Fuente de información: SPRFyM"
          categories={["Coatzacoalcos/Miantitlán", "Orizaba/Córdoba", "Poza Rica/Túxpan", "Veracruz", "Xalapa"]}
          values={[29, 27, 29, 41, 218]}

        />
      </div>

      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          title="Entidades - Dependencias"
          footer="Fecha de corte: Diciembre de 2025. Fuente de información: SPRFyM"
          categories={["Coatzacoalcos/Miantitlán", "Orizaba/Córdoba", "Poza Rica/Túxpan", "Veracruz", "Xalapa",  "asdsd asd"]}
          values={[900, 27, 291, 241, 18, 322]}

        />
      </div>

      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          title="Entidades - Dependencias"
          footer="Fecha de corte: Diciembre de 2025. Fuente de información: SPRFyM"
          categories={["Coatzacoalcos/Miantitlán", "Orizaba/Córdoba", "Poza Rica/Túxpan", "Veracruz", "Xalapa",  "asdsd asd", "asa", "34", "343", "1", "2", "3", "4", "5"]}
          values={[900, 27, 291, 241, 18, 322, 12, 345, 3456, 1, 2, 3, 4, 5]}

        />
      </div>

    </main>
  );
}
