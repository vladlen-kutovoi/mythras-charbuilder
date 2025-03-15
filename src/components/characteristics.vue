<script setup lang="ts">
// imports
import { computed, ref } from "vue";
import { useStats } from "@/composables/useStats";

// emits
const emit = defineEmits(["update:chars"]);

// props
interface Characteristic {
  name: string;
  shortName: string;
  value: number;
  increase: number;
  min: number;
  max: number;
}

const props = defineProps<{
  chars: Record<string, Characteristic>;
}>();

// variables
const { increaseStat, decreaseStat } = useStats();
const localChars = ref<Record<string, Characteristic>>({ ...props.chars });
const maxPerks = 80;

// computed
const perks = computed(() => {
  let leftPerks = maxPerks;

  Object.values(localChars.value).forEach((char) => {
    leftPerks -= char.increase;
  });

  return leftPerks;
});

Object.values(localChars.value).forEach((char) => {
  if (char.value === 0) {
    char.increase = char.min;
  }
});

// expose
defineExpose({ localChars })
</script>

<template>
  <main>
    <span>Perk points: {{ perks }} / {{ maxPerks }}</span>
    <ul class="chars list-unstyled">
      <li v-for="char in localChars" :key="char.shortName" class="chars__item">
        <span class="chars__name">{{ char.name }}</span>
        <span class="chars__value">{{ char.value + char.increase }}</span>
        <button
          class="btn btn-primary"
          type="button"
          :disabled="char.value + char.increase >= char.max || perks <= 0"
          aria-label="+"
          @click="increaseStat(char, perks)"
        >
          +
        </button>
        <button
          class="btn btn-primary"
          type="button"
          :disabled="char.value + char.increase <= char.min"
          aria-label="-"
          @click="decreaseStat(char)"
        >
          -
        </button>
      </li>
    </ul>
  </main>
</template>
