import { authFetch } from "@/utils/api";
import { DoctorDocument, DoctorProfile, DoctorProfileUpsertInput, DocumentUpsertInput } from "./types";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const code = data?.error?.code ?? "UNKNOWN_ERROR";
    const message = data?.error?.message ?? "Something went wrong";
    throw new ApiError(res.status, code, message);
  }
  return data as T;
}

const jsonInit = (method: string, body?: object): RequestInit => ({
  method,
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export const doctorOnboardingApi = {
  getProfile: () => authFetch("/doctor/profile", { method: "GET" }).then((r) => parse<DoctorProfile>(r)),

  createProfile: (data: DoctorProfileUpsertInput) =>
    authFetch("/doctor/profile", jsonInit("POST", data)).then((r) => parse<DoctorProfile>(r)),

  updateProfile: (data: DoctorProfileUpsertInput) =>
    authFetch("/doctor/profile", jsonInit("PATCH", data)).then((r) => parse<DoctorProfile>(r)),

  submitForReview: () =>
    authFetch("/doctor/submit-review", jsonInit("POST")).then((r) => parse<DoctorProfile>(r)),

  createDocument: (documentType: string, input: DocumentUpsertInput) =>
    authFetch("/doctor/documents", jsonInit("POST", { documentType, ...input })).then((r) =>
      parse<DoctorDocument>(r)
    ),

  replaceDocument: (id: string, input: DocumentUpsertInput) =>
    authFetch(`/doctor/documents/${id}`, jsonInit("PATCH", input)).then((r) => parse<DoctorDocument>(r)),
};
