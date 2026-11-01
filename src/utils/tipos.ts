export type TipoNombre =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

export type InfoTipo = readonly [nombre: string, claro: string, intenso: string]

// nombre en español, color claro, color intenso
export const TIPOS: Record<TipoNombre, InfoTipo> = {
  normal:   ['Normal',    '#d6d2c2', '#a09c88'],
  fire:     ['Fuego',     '#ffbf94', '#e8591f'],
  water:    ['Agua',      '#a3d3ff', '#2f7fd6'],
  electric: ['Eléctrico', '#fff29c', '#e8b800'],
  grass:    ['Planta',    '#b6e69c', '#4aa84a'],
  ice:      ['Hielo',     '#cdf3f7', '#6fcbd6'],
  fighting: ['Lucha',     '#eaa98b', '#b4472a'],
  poison:   ['Veneno',    '#dfb0ea', '#9246a8'],
  ground:   ['Tierra',    '#ecd9a7', '#b8883e'],
  flying:   ['Volador',   '#d2dcff', '#8c9ee6'],
  psychic:  ['Psíquico',  '#ffbfd7', '#e0457f'],
  bug:      ['Bicho',     '#dbeb8e', '#8aa51f'],
  rock:     ['Roca',      '#ddd1a4', '#a38f4a'],
  ghost:    ['Fantasma',  '#cbbce6', '#6a4c9c'],
  dragon:   ['Dragón',    '#c4c0ff', '#5a44c4'],
  dark:     ['Siniestro', '#b8aca6', '#4a3f3a'],
  steel:    ['Acero',     '#dbe1e7', '#8393a3'],
  fairy:    ['Hada',      '#ffd0ee', '#e47fc0'],
}

export const infoTipo = (tipo: string): InfoTipo =>
  (TIPOS as Record<string, InfoTipo>)[tipo] ?? TIPOS.normal
export const nombreTipo = (tipo: string): string => infoTipo(tipo)[0]
export const colorTipo = (tipo: string): string => infoTipo(tipo)[2]