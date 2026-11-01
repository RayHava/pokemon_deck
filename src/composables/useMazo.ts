import { ref } from 'vue'
import { idsAleatorios, obtenerPokemon } from '../services/pokeapi'
import type { Pokemon } from '../types/pokemon'

export function useMazo(cantidad = 40) {
  const pokemons = ref<Pokemon[]>([])
  const cargando = ref(false)
  const error = ref('')

  async function cargarCartas(): Promise<void> {
    cargando.value = true
    error.value = ''
    try {
      pokemons.value = await Promise.all(idsAleatorios(cantidad).map(obtenerPokemon))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ocurrió un error inesperado.'
    } finally {
      cargando.value = false
    }
  }

  return { pokemons, cargando, error, cargarCartas }
}