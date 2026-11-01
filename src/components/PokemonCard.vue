<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TOTAL_POKEMON, bonito, obtenerHabilidad, obtenerEtapa } from '../services/pokeapi'
import { infoTipo, nombreTipo, colorTipo } from '../utils/tipos'
import type { Habilidad, Pokemon } from '../types/pokemon'

// El componente se identifica como "pokemonCard"
defineOptions({ name: 'pokemonCard' })

const props = defineProps<{
  pokemon: Pokemon
}>()

const carta = ref<HTMLElement | null>(null)
const habilidades = ref<Habilidad[]>([])
const etapa = ref('Básico')

const colores = computed(() => {
  const [, claro, intenso] = infoTipo(props.pokemon.tipos[0])
  return { '--c1': claro, '--c2': intenso, '--e': intenso }
})
const tiposEs = computed(() => props.pokemon.tipos.map(nombreTipo))
const numero = computed(() => `${String(props.pokemon.id).padStart(4, '0')}/${TOTAL_POKEMON}`)

// Dos habilidades; si el Pokémon solo tiene una, se completa con un movimiento
onMounted(async () => {
  obtenerEtapa(props.pokemon.id).then((e) => (etapa.value = e))

  const reales = await Promise.all(props.pokemon.habilidades.slice(0, 2).map(obtenerHabilidad))
  const extra: Habilidad[] = props.pokemon.movimientos.map((m) => ({
    nombre: bonito(m),
    texto: 'Movimiento que este Pokémon puede aprender.',
  }))
  habilidades.value = [...reales, ...extra].slice(0, 2)
})

// Efecto de inclinación y brillo holográfico
function mover(e: PointerEvent): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = carta.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--mx', `${x * 100}%`)
  el.style.setProperty('--my', `${y * 100}%`)
  el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
}

function soltar(): void {
  carta.value?.style.setProperty('--rx', '0deg')
  carta.value?.style.setProperty('--ry', '0deg')
}
</script>

<template>
  <article ref="carta" class="carta" :style="colores" @pointermove="mover" @pointerleave="soltar">
    <div class="marco">
      <div class="cabecera">
        <span class="etapa">{{ etapa }}</span>
        <h2 class="nombre">{{ pokemon.nombre }}</h2>
        <span class="ps">PS <b>{{ pokemon.ps }}</b></span>
        <span class="energia" :title="tiposEs[0]"></span>
      </div>

      <div class="arte">
        <div><img :src="pokemon.imagen" :alt="pokemon.nombre" loading="lazy" /></div>
      </div>

      <div class="franja">
        <span>N.º {{ pokemon.id }}</span>
        <span>Alt. {{ pokemon.altura }} m</span>
        <span>Peso {{ pokemon.peso }} kg</span>
      </div>

      <div class="ataques">
        <div v-for="(h, i) in habilidades" :key="i" class="ataque">
          <span class="energia"></span>
          <div>
            <h3>{{ h.nombre }}</h3>
            <p>{{ h.texto }}</p>
          </div>
        </div>
      </div>

      <div class="stats">
        <div><span>Ataque</span><b>{{ pokemon.ataque }}</b></div>
        <div><span>Defensa</span><b>{{ pokemon.defensa }}</b></div>
        <div><span>Velocidad</span><b>{{ pokemon.velocidad }}</b></div>
      </div>

      <div class="pie">
        <span class="tipos">
          <span v-for="t in pokemon.tipos" :key="t" class="energia" :style="{ '--e': colorTipo(t) }"></span>
          Tipo {{ tiposEs.join(' / ') }}
        </span>
        <span>{{ numero }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.carta {
  --c1: #ddd;
  --c2: #999;
  container-type: inline-size;
  position: relative;
  width: 100%;
  max-width: 300px;
  justify-self: center;
  aspect-ratio: 63 / 88;
  border: 2px solid #000;
  border-radius: 4.8% / 3.4%;
  background: linear-gradient(170deg, var(--c1), color-mix(in srgb, var(--c1) 55%, #fff));
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
  color: #1c1c1c;
  transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.15s ease-out;
  overflow: hidden;
}
.carta::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.55), transparent 45%),
    linear-gradient(115deg, transparent 30%, rgba(255, 120, 200, 0.18) 45%, rgba(120, 220, 255, 0.2) 55%, transparent 70%);
  mix-blend-mode: soft-light;
  transition: opacity 0.2s;
}
.carta:hover::after { opacity: 1; }

.marco {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2cqw;
  padding: 4cqw 4.5cqw 3cqw;
}
.cabecera { display: flex; align-items: center; gap: 2cqw; }
.etapa {
  font: italic 500 3.3cqw 'Barlow', sans-serif;
  padding: 0.4cqw 1.8cqw;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 1cqw;
  border: 0.3cqw solid rgba(0, 0, 0, 0.35);
}
.nombre {
  flex: 1;
  min-width: 0;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font: 700 6.6cqw/1.1 'Barlow Condensed', 'Arial Narrow', sans-serif;
  text-transform: capitalize;
}
.ps { font: 600 3.6cqw 'Barlow', sans-serif; display: flex; align-items: baseline; gap: 0.8cqw; }
.ps b { font: 700 7cqw/1 'Barlow Condensed', sans-serif; color: #b3141b; }
.energia {
  display: inline-block;
  width: 6.4cqw;
  height: 6.4cqw;
  border-radius: 50%;
  flex: none;
  background: radial-gradient(circle at 35% 30%, #fff 0 12%, var(--e) 45%, color-mix(in srgb, var(--e) 70%, #000) 100%);
  box-shadow: 0 0 0 0.4cqw #fff, 0 0 0 0.8cqw rgba(0, 0, 0, 0.45);
}
.arte {
  flex: none;
  aspect-ratio: 1.28;
  padding: 0.9cqw;
  background: linear-gradient(135deg, #f7e27a, #b88b10, #f7e27a, #c99a0e);
  border-radius: 1cqw;
}
.arte > div {
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 0.6cqw;
  background:
    radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 0.95) 0, rgba(255, 255, 255, 0.35) 45%, transparent 70%),
    linear-gradient(160deg, var(--c1), var(--c2));
}
.arte img {
  width: 78%;
  height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 1.2cqw 1cqw rgba(0, 0, 0, 0.35));
}
.franja {
  display: flex;
  justify-content: center;
  gap: 4cqw;
  padding: 0.6cqw 2cqw;
  font: italic 500 3cqw 'Barlow', sans-serif;
  background: linear-gradient(#f4e08a, #d8b647);
  border-radius: 0.8cqw;
  border: 0.3cqw solid rgba(0, 0, 0, 0.3);
}
.ataques { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; min-height: 0; }
.ataque { display: grid; grid-template-columns: 7cqw 1fr; column-gap: 2.4cqw; align-items: start; }
.ataque + .ataque { border-top: 0.3cqw solid rgba(0, 0, 0, 0.25); padding-top: 1.4cqw; }
.ataque h3 { margin: 0; font: 700 5.2cqw/1.1 'Barlow Condensed', sans-serif; text-transform: capitalize; }
.ataque p {
  margin: 0.4cqw 0 0;
  font: 400 3cqw/1.25 'Barlow', sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1cqw;
  padding: 1cqw 0;
}
.stats span { display: block; font: 400 2.7cqw 'Barlow', sans-serif; }
.stats b { font: 700 4.8cqw/1.1 'Barlow Condensed', sans-serif; }
.pie { display: flex; justify-content: space-between; align-items: center; font: italic 500 2.8cqw 'Barlow', sans-serif; }
.pie .tipos { display: flex; align-items: center; gap: 1.2cqw; }
.pie .tipos .energia { width: 4cqw; height: 4cqw; }

@media (prefers-reduced-motion: reduce) {
  .carta { transition: none; }
}
</style>