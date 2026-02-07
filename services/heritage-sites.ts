import { del, get, post, put } from "./api-client";

export type HeritageSite = {
  site_id: number;
  name: string;
  location: string;
  description: string;
  tag?: string;
  photo_url?: string;
  gps_coordinates?: string;
};

// Assumes backend routes mounted at /admin/heritageSites for admin CRUD, and /heritageSites for public list.
const ADMIN_BASE = "/admin/heritageSites";
const PUBLIC_BASE = "/heritageSites";

export const fetchHeritageSites = () => get<{ sites: HeritageSite[] }>(`${PUBLIC_BASE}`);

export const createHeritageSite = (payload: Omit<HeritageSite, "site_id">) =>
  post<{ site: HeritageSite }>(`${ADMIN_BASE}/addHeritageSite`, payload);

export const updateHeritageSite = (site_id: number, payload: Partial<Omit<HeritageSite, "site_id">>) =>
  put<{ site: HeritageSite }>(`${ADMIN_BASE}/${site_id}`, payload);

export const deleteHeritageSite = (site_id: number) => del<{ deletedSiteId: number }>(`${ADMIN_BASE}/${site_id}`);
