'use client'

/**
 * ============================================================================
 * TERRA — GLOBAL STORE
 * ============================================================================
 * One Zustand store, mirrored to localStorage, holding:
 *  · the in-progress design (so the wizard survives a reload)
 *  · the cart
 *  · the wishlist and gallery votes
 *  · Soil Club membership, points and redeemed rewards
 *
 * Nothing here talks to a server: this is a front-end reference storefront.
 * ============================================================================
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Bilingual, CartLine, DesignConfig } from '@/types/design'
import { defaultDesign, getLidColor, priceOf, pricing } from '@/data/product'
import { accessoriesTotal } from '@/data/accessories'
import { POINTS_PER_KWD, pointEvents, pointsForSpend, rewards, tierFor, type PointEvent } from '@/data/loyalty'
import { uid } from '@/lib/utils'

export type WishlistItem = {
  id: string
  design: DesignConfig
  name?: Bilingual
  addedAt: string
}

export type PointEntry = {
  id: string
  /** i18n key suffix or 'order' / 'redeem'. */
  kind: PointEvent | 'order' | 'redeem'
  points: number
  at: string
  /** For redeem entries. */
  rewardId?: string
}

type SavedDesign = { id: string; design: DesignConfig; savedAt: string }

type Store = {
  /* ----- designer ----- */
  design: DesignConfig
  step: number
  snapshot?: string
  setDesign: (patch: Partial<DesignConfig>) => void
  loadDesign: (design: DesignConfig, opts?: { step?: number }) => void
  resetDesign: () => void
  setStep: (step: number) => void
  setSnapshot: (dataUrl?: string) => void
  toggleAccessory: (id: string) => void

  /* ----- saved designs ----- */
  savedDesigns: SavedDesign[]
  saveCurrentDesign: () => void

  /* ----- cart ----- */
  cart: CartLine[]
  addToCart: (input: {
    design: DesignConfig
    quantity?: number
    snapshot?: string
    designName?: Bilingual
  }) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  setLineOptions: (lineId: string, patch: Partial<Pick<CartLine, 'giftWrap' | 'handwrittenCard' | 'cardMessage'>>) => void
  clearCart: () => void

  /* ----- wishlist + votes ----- */
  wishlist: WishlistItem[]
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  votes: string[]
  toggleVote: (entryId: string) => void
  stockAlerts: string[]
  requestStockAlert: (designId: string) => void

  /* ----- Soil Club ----- */
  member: boolean
  memberEmail?: string
  joinedAt?: string
  points: number
  pointHistory: PointEntry[]
  appliedRewardId?: string
  joinClub: (email: string) => void
  award: (event: PointEvent) => void
  redeem: (rewardId: string) => void
  clearReward: () => void
  creditOrder: (totalKwd: number) => number
}

const nowIso = () => new Date().toISOString()

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      /* ----- designer ----- */
      design: { ...defaultDesign },
      step: 1,
      snapshot: undefined,

      setDesign: (patch) => set((s) => ({ design: { ...s.design, ...patch } })),

      loadDesign: (design, opts) =>
        set(() => ({ design: { ...design }, step: opts?.step ?? 1, snapshot: undefined })),

      resetDesign: () => set(() => ({ design: { ...defaultDesign }, step: 1, snapshot: undefined })),

      setStep: (step) => set(() => ({ step })),

      setSnapshot: (dataUrl) => set(() => ({ snapshot: dataUrl })),

      toggleAccessory: (id) =>
        set((s) => {
          const has = s.design.accessories.includes(id)
          return {
            design: {
              ...s.design,
              accessories: has
                ? s.design.accessories.filter((a) => a !== id)
                : [...s.design.accessories, id],
            },
          }
        }),

      /* ----- saved designs ----- */
      savedDesigns: [],
      saveCurrentDesign: () => {
        const first = get().savedDesigns.length === 0
        set((s) => ({
          savedDesigns: [
            { id: uid('design'), design: { ...s.design }, savedAt: nowIso() },
            ...s.savedDesigns,
          ].slice(0, 24),
        }))
        if (first && get().member) get().award('firstDesignSaved')
      },

      /* ----- cart ----- */
      cart: [],

      addToCart: ({ design, quantity = 1, snapshot, designName }) => {
        const unitPrice = priceOf(design)
        const lineTotal = (unitPrice + accessoriesTotal(design.accessories)) * quantity
        set((s) => ({
          cart: [
            ...s.cart,
            {
              lineId: uid('line'),
              design: { ...design },
              quantity,
              snapshot,
              designName,
              giftWrap: false,
              handwrittenCard: false,
              unitPrice,
              points: pointsForSpend(lineTotal),
            },
          ],
        }))
      },

      setQuantity: (lineId, quantity) =>
        set((s) => ({
          cart: s.cart.map((l) =>
            l.lineId === lineId ? { ...l, quantity: Math.max(1, Math.min(99, quantity)) } : l,
          ),
        })),

      removeLine: (lineId) => set((s) => ({ cart: s.cart.filter((l) => l.lineId !== lineId) })),

      setLineOptions: (lineId, patch) =>
        set((s) => ({
          cart: s.cart.map((l) => (l.lineId === lineId ? { ...l, ...patch } : l)),
        })),

      clearCart: () => set(() => ({ cart: [] })),

      /* ----- wishlist + votes ----- */
      wishlist: [],

      toggleWishlist: (item) =>
        set((s) => ({
          wishlist: s.wishlist.some((w) => w.id === item.id)
            ? s.wishlist.filter((w) => w.id !== item.id)
            : [{ ...item, addedAt: nowIso() }, ...s.wishlist],
        })),

      votes: [],

      toggleVote: (entryId) => {
        const had = get().votes.includes(entryId)
        set((s) => ({
          votes: had ? s.votes.filter((v) => v !== entryId) : [...s.votes, entryId],
        }))
        if (!had && get().member) get().award('galleryVote')
      },

      stockAlerts: [],
      requestStockAlert: (designId) =>
        set((s) => ({
          stockAlerts: s.stockAlerts.includes(designId) ? s.stockAlerts : [...s.stockAlerts, designId],
        })),

      /* ----- Soil Club ----- */
      member: false,
      memberEmail: undefined,
      joinedAt: undefined,
      points: 0,
      pointHistory: [],
      appliedRewardId: undefined,

      joinClub: (email) => {
        if (get().member) return
        set(() => ({ member: true, memberEmail: email, joinedAt: nowIso() }))
        get().award('signup')
      },

      award: (event) =>
        set((s) => ({
          points: s.points + pointEvents[event],
          pointHistory: [
            { id: uid('pt'), kind: event, points: pointEvents[event], at: nowIso() } as PointEntry,
            ...s.pointHistory,
          ].slice(0, 60),
        })),

      redeem: (rewardId) => {
        const reward = rewards.find((r) => r.id === rewardId)
        if (!reward) return
        const { points } = get()
        if (points < reward.cost) return
        set((s) => ({
          points: s.points - reward.cost,
          appliedRewardId: reward.kind === 'discount' ? reward.id : s.appliedRewardId,
          pointHistory: [
            {
              id: uid('pt'),
              kind: 'redeem' as const,
              points: -reward.cost,
              at: nowIso(),
              rewardId,
            },
            ...s.pointHistory,
          ].slice(0, 60),
        }))
      },

      clearReward: () => set(() => ({ appliedRewardId: undefined })),

      creditOrder: (totalKwd) => {
        const earned = pointsForSpend(totalKwd)
        if (!get().member) return earned
        set((s) => ({
          points: s.points + earned,
          pointHistory: [
            { id: uid('pt'), kind: 'order' as const, points: earned, at: nowIso() },
            ...s.pointHistory,
          ].slice(0, 60),
        }))
        return earned
      },
    }),
    {
      name: 'terra.store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only data is persisted — never the wizard step or the snapshot, so a
      // returning visitor lands on step 1 with all of their choices intact.
      partialize: (s) => ({
        design: s.design,
        savedDesigns: s.savedDesigns,
        cart: s.cart,
        wishlist: s.wishlist,
        votes: s.votes,
        stockAlerts: s.stockAlerts,
        member: s.member,
        memberEmail: s.memberEmail,
        joinedAt: s.joinedAt,
        points: s.points,
        pointHistory: s.pointHistory,
        appliedRewardId: s.appliedRewardId,
      }) as unknown as Store,
    },
  ),
)

/* -------------------------------------------------------------------------- */
/* DERIVED SELECTORS                                                          */
/* -------------------------------------------------------------------------- */

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, l) => n + l.quantity, 0)
}

/** Full money breakdown for the cart, including club discount and rewards. */
export function cartTotals(args: {
  cart: CartLine[]
  points: number
  member: boolean
  appliedRewardId?: string
}) {
  const { cart, points, member, appliedRewardId } = args

  const mugs = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
  const addons = cart.reduce((sum, l) => sum + accessoriesTotal(l.design.accessories) * l.quantity, 0)
  const giftWrap = cart.reduce((sum, l) => sum + (l.giftWrap ? pricing.giftWrap * l.quantity : 0), 0)
  const cards = cart.reduce((sum, l) => sum + (l.handwrittenCard ? pricing.handwrittenCard : 0), 0)

  const subtotal = mugs + addons + giftWrap + cards

  const tier = tierFor(points)
  const clubPercent = member ? tier.current.discountPercent : 0
  const clubDiscount = (subtotal * clubPercent) / 100

  const reward = rewards.find((r) => r.id === appliedRewardId)
  const rewardDiscount = reward?.kind === 'discount' ? Math.min(reward.value ?? 0, subtotal - clubDiscount) : 0

  const afterDiscounts = Math.max(0, subtotal - clubDiscount - rewardDiscount)

  const freeDelivery =
    afterDiscounts >= pricing.freeDeliveryThreshold ||
    (member && tier.current.id !== 'soil' && tier.current.id !== 'clay')
  const delivery = cart.length === 0 || freeDelivery ? 0 : pricing.delivery

  const total = afterDiscounts + delivery

  return {
    mugs: round(mugs),
    addons: round(addons),
    giftWrap: round(giftWrap),
    cards: round(cards),
    subtotal: round(subtotal),
    clubPercent,
    clubDiscount: round(clubDiscount),
    reward,
    rewardDiscount: round(rewardDiscount),
    delivery: round(delivery),
    freeDelivery,
    total: round(total),
    pointsEarned: pointsForSpend(round(total)),
    amountToFreeDelivery: round(Math.max(0, pricing.freeDeliveryThreshold - afterDiscounts)),
  }
}

const round = (n: number) => Math.round(n * 1000) / 1000

export { POINTS_PER_KWD, tierFor, getLidColor }
