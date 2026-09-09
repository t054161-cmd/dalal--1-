'use client'

/**
 * ============================================================================
 * STORE
 * ============================================================================
 * One Zustand store, mirrored to localStorage: the cup being designed, saved
 * designs, and the cart. Nothing here talks to a server.
 * ============================================================================
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Bilingual, CartLine, CupConfig } from '@/types'
import { defaultConfig, freeShippingOver, priceOf, shippingFlat } from '@/data/product'
import { uid } from './utils'

type SavedDesign = { id: string; config: CupConfig; savedAt: string }

type Store = {
  config: CupConfig
  snapshot?: string
  savedDesigns: SavedDesign[]
  cart: CartLine[]

  setConfig: (patch: Partial<CupConfig>) => void
  loadConfig: (config: CupConfig) => void
  resetConfig: () => void
  setSnapshot: (dataUrl?: string) => void
  saveDesign: () => void

  addToCart: (input: { config: CupConfig; quantity?: number; snapshot?: string; name?: Bilingual }) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  clearCart: () => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      config: { ...defaultConfig },
      snapshot: undefined,
      savedDesigns: [],
      cart: [],

      setConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
      loadConfig: (config) => set(() => ({ config: { ...config }, snapshot: undefined })),
      resetConfig: () => set(() => ({ config: { ...defaultConfig }, snapshot: undefined })),
      setSnapshot: (dataUrl) => set(() => ({ snapshot: dataUrl })),

      saveDesign: () =>
        set((s) => ({
          savedDesigns: [
            { id: uid('design'), config: { ...s.config }, savedAt: new Date().toISOString() },
            ...s.savedDesigns,
          ].slice(0, 20),
        })),

      addToCart: ({ config, quantity = 1, snapshot, name }) =>
        set((s) => ({
          cart: [
            ...s.cart,
            {
              lineId: uid('line'),
              config: { ...config },
              quantity,
              snapshot,
              name,
              unitPrice: priceOf(config),
            },
          ],
        })),

      setQuantity: (lineId, quantity) =>
        set((s) => ({
          cart: s.cart.map((l) =>
            l.lineId === lineId ? { ...l, quantity: Math.max(1, Math.min(99, quantity)) } : l,
          ),
        })),

      removeLine: (lineId) => set((s) => ({ cart: s.cart.filter((l) => l.lineId !== lineId) })),
      clearCart: () => set(() => ({ cart: [] })),
    }),
    {
      name: 'terra.store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only data persists — never the snapshot, which is large and transient.
      partialize: (s) =>
        ({ config: s.config, savedDesigns: s.savedDesigns, cart: s.cart }) as unknown as Store,
    },
  ),
)

export const cartCount = (cart: CartLine[]) => cart.reduce((n, l) => n + l.quantity, 0)

export function cartTotals(cart: CartLine[]) {
  const subtotal = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
  const freeShipping = subtotal >= freeShippingOver || cart.length === 0
  const shipping = freeShipping ? 0 : shippingFlat
  const round = (n: number) => Math.round(n * 1000) / 1000
  return {
    subtotal: round(subtotal),
    shipping: round(shipping),
    freeShipping,
    total: round(subtotal + shipping),
    toFreeShipping: round(Math.max(0, freeShippingOver - subtotal)),
  }
}
