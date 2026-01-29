// API Configuration
// CHANGE THIS to your ngrok URL or local IP
export const API_URL = 'https://beatriz-satisfiable-topologically.ngrok-free.dev';

// Import people so personas and friends share the same data
import { PEOPLE } from './people';

// Personas derived from PEOPLE — used in scan filter and safety checks
export const PERSONAS = PEOPLE.map((p) => ({
  id: p.id,
  name: p.name,
  allergies: p.allergies,
}));

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
    id: 'midsommar',
    title: 'Midsommar Feast',
    date: '2026-06-20',
    time: '14:00',
    location: 'Strandängen',
    invited: ['hugo', 'hanna', 'nils', 'saga', 'amanda', 'erik', 'linnea', 'oscar', 'maja', 'felix'],
    notes: 'Traditional midsummer celebration. Everyone brings a dish to share. We need to cover all dietary needs — check allergies before cooking!',
  },
  {
    id: 'cykelkalas',
    title: 'Cykelkalas',
    date: '2026-03-14',
    time: '12:00',
    location: 'Stadsparken',
    invited: ['amanda', 'saga', 'hanna', 'linnea'],
    notes: 'Hjälm rekommenderas. Vi tar en lugn runda och fikar efteråt.',
  },
  {
    id: 'spelkvall',
    title: 'Spelkväll',
    date: '2026-02-21',
    time: '18:00',
    location: 'Hos Amanda',
    invited: ['amanda', 'hugo', 'nils', 'erik', 'felix'],
    notes: 'Brädspel + pizza. Säg till om du vill ta med ett spel!',
  },
  {
    id: 'brunch',
    title: 'Sunday Brunch',
    date: '2026-03-01',
    time: '11:00',
    location: 'Café Grön',
    invited: ['hugo', 'hanna', 'saga', 'maja', 'linnea'],
    notes: 'Cozy brunch spot. They have vegan and gluten-free options.',
  },
];
