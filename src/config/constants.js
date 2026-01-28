// API Configuration
// CHANGE THIS to your ngrok URL or local IP
export const API_URL = 'https://beatriz-satisfiable-topologically.ngrok-free.dev';

// Personas with their allergies
export const PERSONAS = [
  { id: 'saga', name: 'Saga', allergies: ['gluten', 'soy'] },
  { id: 'hugo', name: 'Hugo', allergies: ['milk', 'lactose'] },
  { id: 'hanna', name: 'Hanna', allergies: ['gluten', 'milk'] },
  { id: 'amanda', name: 'Amanda', allergies: [] },
];

// Allergen list
export const ALLERGENS = ['gluten', 'milk', 'soy', 'eggs', 'nuts', 'lactose'];

// Events
export const EVENTS = [
  {
    id: 'halvatta',
    title: 'Halvåtta',
    date: '2026-02-07',
    time: '19:30',
    location: 'Hemma hos Saga',
    invited: ['saga', 'hugo', 'hanna'],
    notes: 'Ta med något litet att dricka eller snacksa.',
  },
  {
    id: 'cykelkalas',
    title: 'Cykelkalas',
    date: '2026-03-14',
    time: '12:00',
    location: 'Stadsparken',
    invited: ['amanda', 'saga', 'hanna'],
    notes: 'Hjälm rekommenderas. Vi tar en lugn runda och fikar efteråt.',
  },
  {
    id: 'spelkvall',
    title: 'Spelkväll',
    date: '2026-02-21',
    time: '18:00',
    location: 'Hos Amanda',
    invited: ['amanda', 'hugo'],
    notes: 'Brädspel + pizza. Säg till om du vill ta med ett spel!',
  },
];
