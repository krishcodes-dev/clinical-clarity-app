import { create } from "zustand";
import {
  CartItem,
  CollectionMethod,
  DiagnosticTest,
  TimeSlot,
} from "@/features/booking/types";
import { Address } from "@/features/auth/types";
import { mockAddresses } from "@/features/auth/mocks";

interface BookingDraft {
  test?: DiagnosticTest;
  packageId?: string;
  method?: CollectionMethod;
  addressId?: string;
  labId?: string;
  dayId?: string;
  slot?: TimeSlot;
}

interface BookingState {
  /** Cart */
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  /** Booking funnel draft */
  bookingDraft: BookingDraft;
  updateBookingDraft: (patch: Partial<BookingDraft>) => void;
  resetBookingDraft: () => void;

  /** Addresses */
  addresses: Address[];
  selectedAddressId: string;
  selectAddress: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((s) =>
      s.cart.some((c) => c.refId === item.refId)
        ? s
        : { cart: [...s.cart, item] }
    ),
  removeFromCart: (id) =>
    set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
  clearCart: () => set({ cart: [] }),

  bookingDraft: {},
  updateBookingDraft: (patch) =>
    set((s) => ({ bookingDraft: { ...s.bookingDraft, ...patch } })),
  resetBookingDraft: () => set({ bookingDraft: {} }),

  addresses: mockAddresses,
  selectedAddressId: "addr1",
  selectAddress: (id) => set({ selectedAddressId: id }),
}));
