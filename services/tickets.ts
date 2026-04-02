import { API_BASE_MUSEUM, API_BASE_PAYMENT } from "../constants/api";
import { post } from "./api-client";

export type TicketPayload = {
  site_id: number;
  name: string;
  email: string;
  visit_date: string;
  quantity: number;
};

export type TicketResponse = {
  message: string;
};

export const bookTicket = (payload: TicketPayload) => post<TicketResponse>(`${API_BASE_MUSEUM}/tickets/purchase`, payload);

export const initiateKhalti = (payload: any) => post<any>(`${API_BASE_PAYMENT}/initiate`, payload);
export const verifyKhalti = (payload: { pidx: string }) => post<any>(`${API_BASE_PAYMENT}/verify`, payload);
export const initiateEsewa = (payload: any) => post<any>(`${API_BASE_PAYMENT}/esewa/initiate`, payload);
export const verifyEsewa = (payload: { encodedData: string }) => post<any>(`${API_BASE_PAYMENT}/esewa/verify`, payload);
