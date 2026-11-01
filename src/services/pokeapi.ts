import type { Habilidad, HabilidadRef, Pokemon } from '../types/pokemon'

const API = 'https://pokeapi.co/api/v2'

export const TOTAL_POKEMON = 1025

// Solo se tipan los campos de la respuesta que se usan
interface PokemonApi {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other: { 'official-artwork': { front_default: string | null } }
  }
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string; url: string } }[]
  moves: { move: { name: string } }[]
}

interface HabilidadApi {
  names: { name: string; language: { name: string } }[]
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  effect_entries: { short_effect: string; language: { name: string } }[]
}

export const bonito = (slug: string): string => slug.replace(/-/g, ' ')

// Devuelve 'n' ids distintos al azar
export function idsAleatorios(n: number): number[] {
  const ids = new Set<number>()
  while (ids.size < n) ids.add(1 + Math.floor(Math.random() * TOTAL_POKEMON))
  return [...ids]
}

// Deja solo los datos que necesita la carta
function normalizar(d: PokemonApi): Pokemon {
  const stat = (nombre: string): number =>
    d.stats.find((s) => s.stat.name === nombre)?.base_stat ?? 0
  return {
    id: d.id,
    nombre: d.name,
    imagen: d.sprites.other['official-artwork'].front_default ?? d.sprites.front_default ?? '',
    tipos: d.types.map((t) => t.type.name),
    ps: stat('hp'),
    ataque: stat('attack'),
    defensa: stat('defense'),
    velocidad: stat('speed'),
    altura: d.height / 10, // decímetros -> metros
    peso: d.weight / 10, // hectogramos -> kg
    habilidades: d.abilities.map((a) => ({ slug: a.ability.name, url: a.ability.url })),
    movimientos: d.moves.slice(0, 2).map((m) => m.move.name),
  }
}

export async function obtenerPokemon(id: number): Promise<Pokemon> {
  const respuesta = await fetch(`${API}/pokemon/${id}`)
  if (!respuesta.ok) throw new Error('No se pudo cargar un Pokémon.')
  return normalizar((await respuesta.json()) as PokemonApi)
}

// Nombre y descripción en español de una habilidad (con caché)
const cacheHabilidades = new Map<string, Promise<Habilidad>>()

export function obtenerHabilidad({ slug, url }: HabilidadRef): Promise<Habilidad> {
  const guardada = cacheHabilidades.get(url)
  if (guardada) return guardada

  const peticion: Promise<Habilidad> = fetch(url)
    .then((r) => r.json() as Promise<HabilidadApi>)
    .then((d) => {
      const nombre = d.names.find((n) => n.language.name === 'es')?.name ?? bonito(slug)
      const flavor = d.flavor_text_entries.find((f) => f.language.name === 'es')
      const efecto = d.effect_entries.find((e) => e.language.name === 'en')
      const texto = flavor?.flavor_text ?? efecto?.short_effect ?? ''
      return { nombre, texto: texto.replace(/[\n\f]+/g, ' ') }
    })
    .catch(() => ({ nombre: bonito(slug), texto: 'Descripción no disponible.' }))

  cacheHabilidades.set(url, peticion)
  return peticion
}

interface EspecieApi {
  evolves_from_species: { name: string; url: string } | null
}

const cacheEspecies = new Map<string, Promise<EspecieApi>>()

function obtenerEspecie(url: string): Promise<EspecieApi> {
  const guardada = cacheEspecies.get(url)
  if (guardada) return guardada

  const peticion = fetch(url).then((r) => {
    if (!r.ok) throw new Error('No se pudo cargar la especie.')
    return r.json() as Promise<EspecieApi>
  })
  cacheEspecies.set(url, peticion)
  return peticion
}

// 'Básico', 'Fase 1' o 'Fase 2' según la cadena evolutiva
export async function obtenerEtapa(id: number): Promise<string> {
  try {
    const especie = await obtenerEspecie(`${API}/pokemon-species/${id}`)
    if (!especie.evolves_from_species) return 'Básico'

    const previa = await obtenerEspecie(especie.evolves_from_species.url)
    return previa.evolves_from_species ? 'Fase 2' : 'Fase 1'
  } catch {
    return 'Básico' // si falla la petición, la carta no se rompe
  }
}