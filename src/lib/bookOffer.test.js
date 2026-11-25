import { describe, expect, it } from "bun:test";
import { BOOK_PRICE_USD, BOOK_SALES_URL } from "./bookOffer";

describe("Don't Grow, Scale offer", () => {
  it("uses the approved $39.99 purchase price", () => {
    expect(BOOK_PRICE_USD).toBe(39.99);
  });

  it("sends book purchases to ALP Learn with the approved attribution", () => {
    const url = new URL(BOOK_SALES_URL);
    expect(url.origin).toBe("https://learn.alpcontractorcircle.com");
    expect(url.pathname).toBe("/dont-grow-scale");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: "altitudelogicpressure",
      utm_medium: "site",
      utm_campaign: "dgs",
    });
  });
});