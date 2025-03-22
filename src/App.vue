<script setup lang="ts">
import { ref } from "vue";
import Icon from "./components/icon.vue";

const character = ref({
  characteristics: {
    strength: {
      name: "Strength",
      shortName: "STR",
      description:
        "STR represents physical strength: how much one can lift, how hard one can hit, and so on. STR is a component of the Damage Modifier. If a character is reduced to zero STR they lack the ability to move or lift objects.",
      value: 3,
      min: 3,
      max: 18,
    },
    constitution: {
      name: "Constitution",
      shortName: "CON",
      description:
        "CON is measure of health and hardiness. CON is a component in determining Hit Points and Healing Rate. If CON falls to zero for any reason the character dies.",
      value: 3,
      min: 3,
      max: 18,
    },
    size: {
      name: "Size",
      shortName: "SIZ",
      description:
        "SIZ measures mass and helps indicate Height and Weight. SIZ is used to help figure Hit Points, as larger, heavier creatures tend to have greater endurance against damage. SIZ can also be used to determine a character's Damage Modifier, since mass helps to increase the force of a blow.",
      value: 8,
      min: 8,
      max: 18,
    },
    dexterity: {
      name: "Dexterity",
      shortName: "DEX",
      description:
        "Agility, balance, and reflexes are measured by DEX. It is an important aspect of Action Points and Initiative. If a character is reduced to zero DEX, they suffer functional paralysis.",
      value: 3,
      min: 3,
      max: 18,
    },
    intelligence: {
      name: "Intelligence",
      shortName: "INT",
      description:
        "INT is measurement of cognitive ability. Those with a lower INT score are not necessarily stupid, but they are likely to be constrained in how creatively they can employ their wits. INT is a factor in calculating Action Points and Initiative. If INT is reduced to zero, the character becomes completely mindless.",
      value: 8,
      min: 8,
      max: 18,
    },
    power: {
      name: "Power",
      shortName: "POW",
      description:
        "POW is a measurement of a character's soul, spirit, inner drive, or capacity for magic. POW governs a character's Magic Points and Luck Points. If a character's POW ever drops to zero, they lose all independent will.",
      value: 3,
      min: 3,
      max: 18,
    },
    charisma: {
      name: "Charisma",
      shortName: "CHA",
      description:
        "Charisma is a measure of presence and personality and is independent of physical appearance. CHA affects a character's Experience Modifier. If CHA ever falls to zero, the character can no longer socially interact with others, becoming so painfully shy or antisocial they are ignored or even driven away.",
      value: 3,
      min: 3,
      max: 18,
    },
  },
});

const perks = ref({
  characteristics: {
    get left() {
      return (
        this.max -
        Object.values(character.value.characteristics).reduce(
          (sum, char) => sum + char.value,
          0
        )
      );
    },
    max: 80,
  },
});
</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="d-flex justify-content-end mb-2">
            <span class="fw-bold">
              Perk points: {{ perks.characteristics.left }} /
              {{ perks.characteristics.max }}
            </span>
          </div>
          <ul class="chars list-unstyled">
            <li
              v-for="char in character.characteristics"
              :key="char.shortName"
              class="chars__item d-flex align-items-center justify-content-between py-2 border-bottom"
            >
              <div class="chars__name-wrapper d-flex align-items-center gap-2">
                <span class="chars__name fw-bold">{{ char.name }}</span>
                <button
                  class="icon-btn btn btn-sm p-1"
                  data-bs-toggle="modal"
                  :data-bs-target="`#charModal-${char.shortName}`"
                >
                  <Icon name="question" />
                </button>
              </div>
              <div class="chars__value-wrapper d-flex align-items-center gap-3">
                <button
                  class="btn btn-sm btn-secondary"
                  type="button"
                  :disabled="char.value <= char.min"
                  aria-label="-"
                  @click="char.value--"
                >
                  -
                </button>
                <span class="chars__value fw-bold text-center">
                  {{ char.value }}
                </span>
                <button
                  class="btn btn-sm btn-secondary"
                  type="button"
                  :disabled="
                    char.value >= char.max || perks.characteristics.left <= 0
                  "
                  aria-label="+"
                  @click="char.value++"
                >
                  +
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
      </div>
    </div>

    <!-- Modals -->
    <div
      v-for="charModal in character.characteristics"
      :key="`charModal-${charModal.shortName}`"
      :id="`charModal-${charModal.shortName}`"
      class="modal fade"
      tabindex="-1"
      :aria-labelledby="`charModal-${charModal.shortName}`"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title fs-5">{{ charModal.name }}</h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">{{ charModal.description }}</div>
        </div>
      </div>
    </div>
  </main>
</template>
