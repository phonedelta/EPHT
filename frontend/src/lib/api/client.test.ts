import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { apiGet, apiGetWithMeta } from "./client";

const schema = z.array(z.object({ id: z.number(), title: z.string() }));

function respond(body: unknown, status = 200) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("apiGet", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("appelle l'API versionnée et renvoie les données validées", async () => {
    fetchMock.mockResolvedValue(respond({ success: true, data: [{ id: 1, title: "Cuisine" }] }));

    const result = await apiGet("formations", schema, { search: "cui", level: null, per_page: 3 });

    expect(result).toEqual({ ok: true, data: [{ id: 1, title: "Cuisine" }] });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8010/api/v1/formations?search=cui&per_page=3");
    expect(init.headers).toMatchObject({ Accept: "application/json", "Accept-Language": "fr" });
  });

  it("signale une erreur HTTP sans lever d'exception", async () => {
    fetchMock.mockResolvedValue(respond({ success: false, message: "Ressource introuvable." }, 404));

    const result = await apiGet("formations/inconnue", schema);

    expect(result).toMatchObject({ ok: false, status: 404 });
  });

  it("signale une API injoignable sans lever d'exception", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const result = await apiGet("formations", schema);

    expect(result).toMatchObject({ ok: false, status: 503 });
  });

  it("refuse une réponse dont la forme est inattendue", async () => {
    fetchMock.mockResolvedValue(respond({ success: true, data: [{ id: "1" }] }));

    expect(await apiGet("formations", schema)).toMatchObject({ ok: false, status: 502 });
  });

  it("refuse une réponse qui n'est pas du JSON", async () => {
    fetchMock.mockResolvedValue(respond("<html>Erreur</html>"));

    expect(await apiGet("formations", schema)).toMatchObject({ ok: false, status: 502 });
  });
});

describe("apiGetWithMeta", () => {
  const fetchMock = vi.fn();
  const metaSchema = z.object({ last_page: z.number() });

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renvoie les données et la méta validées", async () => {
    fetchMock.mockResolvedValue(respond({ success: true, data: [{ id: 1, title: "Cuisine" }], meta: { last_page: 2 } }));

    expect(await apiGetWithMeta("articles", schema, metaSchema, { page: 1 })).toEqual({
      ok: true,
      data: { data: [{ id: 1, title: "Cuisine" }], meta: { last_page: 2 } },
    });
  });

  it("refuse une méta inattendue", async () => {
    fetchMock.mockResolvedValue(respond({ success: true, data: [], meta: { last_page: "2" } }));

    expect(await apiGetWithMeta("articles", schema, metaSchema)).toMatchObject({ ok: false, status: 502 });
  });
});
