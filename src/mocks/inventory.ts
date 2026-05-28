export const mockInventory = Array.from({ length: 24 }, (_, i) => ({
  country: ["Brasil", "Argentina", "França", "Espanha", "Alemanha"][i % 5],
  repeated: i < 4 ? Math.floor(Math.random() * 3) + 1 : 0,
  flag: ["🇧🇷", "🇦🇷", "🇫🇷", "🇪🇸", "🇩🇪"][i % 5],
  isRare: i === 3 || i === 12,
  name: `Jogador ${i + 1}`,
  number: i + 1,
  owned: i < 16
}));
