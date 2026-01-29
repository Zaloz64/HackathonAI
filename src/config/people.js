export const PEOPLE = [
  {
    id: "hugo",
    name: "Hugo Borg",
    username: "hugoborg",
    allergies: ["milk", "lactose"],
    dietaryProfile: ["Gluten free"],
    dislikes: ["Cilantro"],
    friendIds: ["hanna", "nils", "saga", "amanda", "erik", "linnea", "oscar", "maja", "felix"],
    favorites: [
      { id: "fav-1", type: "product", title: "Oat yogurt" },
      { id: "fav-2", type: "product", title: "Pasta" },
      { id: "fav-3", type: "product", title: "Chocolate" },
      { id: "fav-4", type: "recipe", title: "Tacos" },
      { id: "fav-5", type: "place", title: "Cafe" },
      { id: "fav-6", type: "product", title: "Granola" },
    ],
  },
  {
    id: "hanna",
    name: "Hanna Nilsson",
    username: "hannan",
    allergies: ["gluten", "milk"],
    dietaryProfile: ["Vegetarian"],
    dislikes: ["Mushrooms"],
    friendIds: ["hugo", "nils", "saga", "linnea", "maja"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `hanna-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "nils",
    name: "Nils Bredin",
    username: "nilsb",
    allergies: ["nuts"],
    dietaryProfile: ["High Protein"],
    dislikes: ["Olives"],
    friendIds: ["hugo", "hanna", "erik", "oscar", "felix"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `nils-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "saga",
    name: "Saga Lindgren",
    username: "sagal",
    allergies: ["gluten", "soy"],
    dietaryProfile: ["Vegan"],
    dislikes: ["Bell peppers"],
    friendIds: ["hugo", "hanna", "amanda", "linnea", "maja"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `saga-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "amanda",
    name: "Amanda Ekström",
    username: "amandae",
    allergies: [],
    dietaryProfile: ["Low Carb"],
    dislikes: ["Anchovies"],
    friendIds: ["hugo", "saga", "erik", "oscar", "felix", "linnea"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `amanda-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "erik",
    name: "Erik Johansson",
    username: "erikj",
    allergies: ["eggs", "soy"],
    dietaryProfile: [],
    dislikes: ["Shrimp"],
    friendIds: ["hugo", "nils", "amanda", "oscar"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `erik-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "linnea",
    name: "Linnea Svensson",
    username: "linneas",
    allergies: ["lactose"],
    dietaryProfile: ["Pescatarian"],
    dislikes: ["Cilantro", "Celery"],
    friendIds: ["hugo", "hanna", "saga", "amanda", "maja"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `linnea-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "oscar",
    name: "Oscar Bergström",
    username: "oscarb",
    allergies: ["gluten", "nuts"],
    dietaryProfile: ["Vegetarian"],
    dislikes: ["Eggplant"],
    friendIds: ["hugo", "nils", "erik", "amanda", "felix"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `oscar-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "maja",
    name: "Maja Andersson",
    username: "majaa",
    allergies: ["milk", "eggs"],
    dietaryProfile: ["Vegan"],
    dislikes: ["Fennel"],
    friendIds: ["hugo", "hanna", "saga", "linnea"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `maja-fav-${i + 1}`, type: "placeholder" })),
  },
  {
    id: "felix",
    name: "Felix Karlsson",
    username: "felixk",
    allergies: ["soy"],
    dietaryProfile: ["High Protein", "Low Sugar"],
    dislikes: ["Tofu", "Beets"],
    friendIds: ["hugo", "nils", "amanda", "oscar"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `felix-fav-${i + 1}`, type: "placeholder" })),
  },
];

// ---- helpers ----

export function getPersonById(id) {
  return PEOPLE.find((p) => p.id === id) || null;
}

export function getFriendsOf(personId) {
  const person = getPersonById(personId);
  if (!person) return [];
  return person.friendIds.map(getPersonById).filter(Boolean);
}

export function getEventsOf(personId) {
  const person = getPersonById(personId);
  if (!person) return { upcoming: [], past: [] };
  return person.events || { upcoming: [], past: [] };
}
