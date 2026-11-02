import axios from "axios";
import { API_URL, ML_URL } from "./constants";

export const api = axios.create({
  baseURL: API_URL,
});

export const mlApi = axios.create({
  baseURL: ML_URL,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function getDestinations(query = "") {
  const { data } = await api.get(`/destinations${query ? `?q=${query}` : ""}`);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function signup(payload: { name: string; email: string; password: string }) {
  const { data } = await api.post("/auth/signup", payload);
  return data;
}

export type RegisterPayload = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  country: string;
  travelInterest: string;
  budgetPreference: string;
};

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post("/auth/signup", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    mobile: payload.mobile,
    country: payload.country,
    travelInterest: payload.travelInterest,
    budgetPreference: payload.budgetPreference,
  });
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token: string, password: string) {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
}

export async function getRecommendations(userId: string) {
  const { data } = await api.get(`/recommendations/${userId}`);
  return data;
}

export async function generatePlan(payload: {
  budget: number;
  days: number;
  tripType: string;
  city: string;
}) {
  const { data } = await mlApi.post("/trip-plan", payload);
  return data;
}

export type UpsertUserPayload = {
  firebaseUid?: string;
  email: string;
  name: string;
};

export async function upsertUser(payload: UpsertUserPayload) {
  const { data } = await api.post("/users/upsert", payload);
  return data;
}

export async function saveUserProfile(
  userId: string,
  payload: { name?: string; mobile?: string; country?: string; travelInterest?: string; budget?: number }
) {
  const { data } = await api.patch(`/users/${userId}/profile`, payload);
  return data;
}

export async function savePreferences(payload: {
  userId: string;
  budget: number;
  groupType: "Solo" | "Couple" | "Family" | "Friends";
  travelStyle: "Adventure" | "Relax" | "Religious" | "Nature";
}) {
  const { data } = await api.post("/preferences", payload);
  return data;
}

export async function saveDestinationForUser(
  userId: string,
  place: {
    externalId?: string;
    placeName: string;
    city?: string;
    state?: string;
    country: string;
    category?: string;
    rating?: number;
    budget?: number;
    imageUrl?: string;
    description?: string;
    bestSeason?: string;
  }
) {
  const { data } = await api.post(`/users/${userId}/saved-destinations`, { place });
  return data;
}

export async function createBooking(payload: {
  userId: string;
  place?: {
    externalId?: string;
    placeName: string;
    city?: string;
    state?: string;
    country: string;
    category?: string;
    rating?: number;
    budget?: number;
    imageUrl?: string;
    description?: string;
    bestSeason?: string;
  };
  placeId?: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  paymentStatus?: "pending" | "paid" | "failed";
}) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function getSavedDestinations(userId: string) {
  const { data } = await api.get(`/users/${userId}/saved-destinations`);
  return data;
}

export async function removeSavedDestination(userId: string, placeId: string) {
  const { data } = await api.delete(`/users/${userId}/saved-destinations/${placeId}`);
  return data;
}

export async function getUser(userId: string) {
  const { data } = await api.get(`/users/${userId}`);
  return data;
}

export async function getAdminStats() {
  const { data } = await api.get(`/admin/stats`);
  return data;
}

export async function getBookings(userId: string) {
  const { data } = await api.get(`/bookings/${userId}`);
  return data;
}

export async function getPreferences(userId: string) {
  const { data } = await api.get(`/preferences/${userId}`);
  return data;
}
