// Referencia a una habilidad tal como la entrega la API
export interface HabilidadRef {
  slug: string
  url: string
}

// Habilidad lista para mostrarse en la carta
export interface Habilidad {
  nombre: string
  texto: string
}

// Datos del Pokémon que necesita la carta
export interface Pokemon {
  id: number
  nombre: string
  imagen: string
  tipos: string[]
  ps: number
  ataque: number
  defensa: number
  velocidad: number
  altura: number
  peso: number
  habilidades: HabilidadRef[]
  movimientos: string[]
}