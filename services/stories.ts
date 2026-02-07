import { del, get, post, put } from "./api-client";

export type Story = {
  story_id: number;
  site_id: number;
  title: string;
  content?: string;
  god_or_goddess_name?: string;
  media_url?: string;
  preview?: string;
};

const ADMIN_BASE = "/admin/stories";
const PUBLIC_BASE = "/stories";

export const fetchStoriesPreview = () => get<{ stories: Story[] }>(`${PUBLIC_BASE}/preview`);
export const fetchStoryPreview = (id: number) => get<{ story: Story }>(`${PUBLIC_BASE}/preview/${id}`);
export const fetchStoryFull = (id: number) => get<{ story: Story }>(`${PUBLIC_BASE}/full/${id}`);

export const createStory = (payload: Omit<Story, "story_id">) => post<{ story: Story }>(`${ADMIN_BASE}/addStory`, payload);
export const updateStory = (id: number, payload: Partial<Omit<Story, "story_id">>) => put<{ story: Story }>(`${ADMIN_BASE}/${id}`, payload);
export const deleteStory = (id: number) => del<{ deletedStoryId: number }>(`${ADMIN_BASE}/${id}`);
export const fetchAllStoriesAdmin = () => get<{ stories: Story[] }>(`${ADMIN_BASE}`);
