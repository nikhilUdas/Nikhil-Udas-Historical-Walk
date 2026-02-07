import { get, post } from "./api-client";

export type ReviewPayload = {
  target_type: "story" | "site";
  target_id: number;
  rating: number; // 1-5
  comment: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
};

export const submitReview = (payload: ReviewPayload) => post<{ message: string }>("/reviews", payload);

export const fetchReviewSummary = (target_type: "story" | "site", target_id: number) =>
  get<ReviewSummary>(`/reviews/${target_type}/${target_id}/summary`);
