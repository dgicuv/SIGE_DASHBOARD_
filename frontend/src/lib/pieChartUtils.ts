import type { ChartData, PieDatum } from "@/custom-components/CustomChart";

/**
 * Renames `nameField` from each raw backend row into `name`, the field PieDatum expects.
 * Use inside a queryFn to adapt an endpoint's grouping column (e.g. "region", "areaAcademica").
 */
export function mapPieDataField(
  raw: Omit<ChartData, "data"> & { data: Record<string, unknown>[] },
  nameField: string,
): ChartData {
  return {
    ...raw,
    data: raw.data.map(({ [nameField]: name, ...rest }) => ({
      ...rest,
      name,
    })) as PieDatum[],
  };
}
