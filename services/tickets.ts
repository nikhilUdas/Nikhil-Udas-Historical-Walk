import { post } from "./api-client";

export type TicketPayload = {
  site_id: number;
  name: string;
  email: string;
  visit_date: string; // ISO string
  quantity: number;
};

export type TicketResponse = {
  ticket_id: number;
  message: string;
};

export const bookTicket = (payload: TicketPayload) => post<TicketResponse>("/tickets", payload);
