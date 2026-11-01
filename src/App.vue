<script setup lang="ts">
import { onMounted } from 'vue'
import PokemonCard from './components/PokemonCard.vue'
import { useMazo } from './composables/useMazo'

const { pokemons, cargando, error, cargarCartas } = useMazo(40)

onMounted(cargarCartas)
</script>

<template>
  <header>
    <h1>Mazo de cartas</h1>
    <p>40 cartas Pokémon tomadas al azar</p>
    <button class="barajar" type="button" :disabled="cargando" @click="cargarCartas">
      {{ cargando ? 'Repartiendo…' : 'Barajar 40 cartas nuevas' }}
    </button>
  </header>

  <p v-if="cargando" class="estado">Repartiendo cartas…</p>
  <p v-else-if="error" class="estado error">{{ error }} Revisa tu conexión y vuelve a barajar.</p>
  <main v-else class="mesa">
    <PokemonCard v-for="p in pokemons" :key="p.id" :pokemon="p" />
  </main>
</template>

<style scoped>
header {
  padding: 40px 20px 8px;
  text-align: center;
}
h1 {
  margin: 0 0 6px;
  font: 700 2.4rem/1 'Barlow Condensed', Impact, sans-serif;
}
header p {
  margin: 0 0 18px;
  opacity: 0.75;
}
.barajar {
  padding: 11px 22px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font: 600 1rem 'Barlow', sans-serif;
  color: #2b2100;
  background: linear-gradient(#ffe27a, #e6b422);
  box-shadow: 0 3px 0 #9c7a0c;
}
.barajar:hover { filter: brightness(1.06); }
.barajar:active { transform: translateY(2px); box-shadow: 0 1px 0 #9c7a0c; }
.barajar:disabled { opacity: 0.5; cursor: wait; }
.barajar:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.estado {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.1rem;
}
.error { color: #ffb4a8; }
.mesa {
  display: grid;
  gap: 28px;
  padding: 28px clamp(16px, 4vw, 48px) 60px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  max-width: 1500px;
  margin: 0 auto;
}
</style>