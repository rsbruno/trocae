export const wishlistItems = [
  { country: "Brasil", name: "Vini Jr.", rarity: "rare", flag: "🇧🇷", number: 45 },
  { rarity: "holographic", country: "Argentina", name: "Messi", flag: "🇦🇷", number: 201 },
  { country: "Noruega", rarity: "normal", name: "Haaland", flag: "🇳🇴", number: 312 },
  { country: "Espanha", rarity: "normal", name: "Pedri", flag: "🇪🇸", number: 88 }
];

export const tradeOffers = [
  {
    requesting: { name: "Mbappé", number: 123 },
    offering: { name: "Vini Jr.", number: 45 },
    status: "pending" as const,
    user: "@maria_col",
    avatar: "M",
    id: 1
  },
  {
    requesting: { name: "Bellingham", number: 89 },
    offering: { name: "Haaland", number: 312 },
    status: "pending" as const,
    user: "@pedro_alb",
    avatar: "P",
    id: 2
  },
  {
    offering: { name: "De Bruyne", number: 67 },
    requesting: { name: "Messi", number: 201 },
    status: "accepted" as const,
    user: "@lucas_fp",
    avatar: "L",
    id: 3
  }
];

export const tradeHistory = [
  { received: "Salah #156", user: "@ana_sports", gave: "Neymar #34", date: "22 Mai", success: true },
  { received: "Müller #203", user: "@carlos_wc", gave: "Kane #78", date: "20 Mai", success: true },
  { user: "@julia_stk", gave: "Modric #90", date: "18 Mai", success: false, received: "—" }
];
