import { writable } from 'svelte/stores';

export const isDev = writable(process.env.NODE_ENV === 'development')
