import powerHourThumb from "@/assets/thumb-power-hour.jpg";
import contractorSchoolThumb from "@/assets/thumb-contractor-school.jpg";
import salesMarketingThumb from "@/assets/thumb-sales-marketing.jpg";

export type ClassType =
  | "power_hour"
  | "contractor_school"
  | "sales_marketing_school";

const FALLBACKS: Record<ClassType, string> = {
  power_hour: powerHourThumb,
  contractor_school: contractorSchoolThumb,
  sales_marketing_school: salesMarketingThumb,
};

/**
 * Returns the thumbnail URL for a recording. Falls back to the branded
 * per-class image when no custom thumbnail has been uploaded.
 */
export function getRecordingThumbnail(
  classType: ClassType,
  customUrl?: string | null
): string {
  return customUrl && customUrl.length > 0 ? customUrl : FALLBACKS[classType];
}
