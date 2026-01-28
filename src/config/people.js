export const PEOPLE = [
  {
    id: "hugo", 
    name: "Hugo Borg",
    username: "hugoborg",
    allergies: ["milk", "lactose"], 
    dietaryProfile: ["Gluten free"], 
    dislikes: ["Koriander"],

    friendIds: ["hanna", "nils", "axel", "axel1", "axel2", "axel3", "axel4", "axel5", "axel6", "axel7"],

    favorites: [
      { id: "fav-1", type: "product", title: "Oat yogurt" },
      { id: "fav-2", type: "product", title: "Pasta" },
      { id: "fav-3", type: "product", title: "Chocolate" },
      { id: "fav-4", type: "recipe", title: "Tacos" },
      { id: "fav-5", type: "place", title: "Cafe" },
      { id: "fav-6", type: "product", title: "Granola" },
    ],

    events: {
      upcoming: [
        {
          id: "evt-halv-atta",
          title: "Halv åtta",
          when: "Tonight • 19:30",
          icon: "restaurant-outline",
          details: "Dinner at 19:30. Bring a friend.",
          attendeeIds: ["hugo", "hanna"],
        },
      ],
      past: [
        {
          id: "evt-brunch",
          title: "Brunch",
          when: "Last weekend",
          icon: "cafe-outline",
          details: "Nice brunch spot in the city.",
          attendeeIds: ["hugo", "nils", "axel"],
        },
      ],
    },
  },

  {
    id: "hanna",
    name: "Hanna Knulsson",
    username: "hannak",
    allergies: ["gluten", "milk"],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `hanna-fav-${i + 1}`, type: "placeholder" })),
    events: {
      upcoming: [
        {
          id: "evt-bday",
          title: "Birthday party",
          when: "Sat • 18:00",
          icon: "gift-outline",
          details: "At Emma’s place. RSVP needed.",
          attendeeIds: ["hanna", "hugo"],
        },
      ],
      past: [],
    },
  },

  {
    id: "nils",
    name: "Nils Bredin",
    username: "nilsb",
    allergies: ["nuts"],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "hanna", "axel"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `nils-fav-${i + 1}`, type: "placeholder" })),
    events: {
      upcoming: [
        {
          id: "evt-meet",
          title: "Meet & Mingle",
          when: "Next week • 20:00",
          icon: "people-outline",
          details: "Networking event downtown.",
          attendeeIds: ["nils"],
        },
      ],
      past: [],
    },
  },

  {
    id: "axel",
    name: "Axel Börtin",
    username: "axelb",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel1",
    name: "Axel Börtin",
    username: "axelb1",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel2",
    name: "Axel Börtin",
    username: "axelb2",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel3",
    name: "Axel Börtin",
    username: "axelb3",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel4",
    name: "Axel Börtin",
    username: "axelb4",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel5",
    name: "Axel Börtin",
    username: "axelb5",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel6",
    name: "Axel Börtin",
    username: "axelb6",
    allergies: [],
    dietaryProfile: [],
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
  },

  {
    id: "axel7",
    name: "Axel Börtin",
    username: "axelb7",
    allergies: [],
    dietaryProfile: [], 
    dislikes: [],
    friendIds: ["hugo", "nils"],
    favorites: Array.from({ length: 6 }, (_, i) => ({ id: `axel-fav-${i + 1}`, type: "placeholder" })),
    events: { upcoming: [], past: [] },
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