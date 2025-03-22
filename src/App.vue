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
  attributes: {
    actionPoints: {
      name: "Action Points",
      shortName: "AP",
      description:
        "<p>How often a character can act in a Combat Round is determined by Action Points.</p><table><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>INT + DEX</th><th scope='col'>Action Points</th></tr></thead><tbody><tr><td>12 or Less</td><td>1</td></tr><tr><td>13-24</td><td>2</td></tr><tr><td>25-36</td><td>3</td></tr><tr><td>For every additional 12 points</td><td>+1</td></tr></tbody></table>",
      get value() {
        return Math.ceil(
          (character.value.characteristics.dexterity.value +
            character.value.characteristics.intelligence.value) /
            12
        );
      },
    },
    damageModifier: {
      name: "Damage Modifier",
      shortName: "DM",
      description:
        "<p>Larger and stronger characters and creatures may gain additional damage in certain situations; conversely, weaker and smaller characters may reduce the damage they can inflict. The Damage Modifier is generally used in combat situations but can also be used when attempting to break objects. The Damage Modifier is an extra die roll which is either added to, or subtracted from, the damage inflicted by the weapon or tool. If a negative Damage Modifier takes a weapon's damage to zero or below, then no damage at all has been inflicted.</p><p>Add together STR and SIZ and consult the Damage Modifier table, below.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>STR + SIZ</th><th scope='col'>Damage Modifier</th></tr></thead><tbody><tr><td>5 or less</td><td>–1d8</td></tr><tr><td>6–10</td><td>–1d6</td></tr><tr><td>11–15</td><td>–1d4</td></tr><tr><td>16–20</td><td>–1d2</td></tr><tr><td>21–25</td><td>+0</td></tr><tr><td>26–30</td><td>+1d2</td></tr><tr><td>31–35</td><td>+1d4</td></tr><tr><td>36–40</td><td>+1d6</td></tr><tr><td>41–45</td><td>+1d8</td></tr><tr><td>46–50</td><td>+1d10</td></tr><tr><td>51–60</td><td>+1d12</td></tr><tr><td>61–70</td><td>+2d6</td></tr><tr><td>71–80</td><td>+1d8+1d6</td></tr><tr><td>81–90</td><td>+2d8</td></tr><tr><td>91–100</td><td>+1d10+1d8</td></tr><tr><td>101–110</td><td>+2d10</td></tr><tr><td>111–120</td><td>+2d10+1d2</td></tr><tr><td>Each 10 points</td><td>Continue Progression</td></tr></tbody></table>",
      get value() {
        const target =
          character.value.characteristics.strength.value +
          character.value.characteristics.size.value;
        switch (true) {
          case target <= 5:
            return "-1d8";
          case target <= 10:
            return "-1d6";
          case target <= 15:
            return "-1d4";
          case target <= 20:
            return "-1d2";
          case target <= 25:
            return "+0";
          case target <= 30:
            return "+1d2";
          case target <= 35:
            return "+1d4";
          case target <= 40:
            return "+1d6";
          case target <= 45:
            return "+1d8";
          case target <= 50:
            return "+1d10";
          case target <= 60:
            return "+1d12";
          case target <= 70:
            return "+2d6";
          case target <= 80:
            return "+1d8+1d6";
          case target <= 90:
            return "+2d8";
          case target <= 100:
            return "+1d10+1d8";
          case target <= 110:
            return "+2d10";
          case target <= 120:
            return "+2d10+1d2";
          default:
            return "+0";
        }
      },
    },
    experinceModifier: {
      name: "Experience Modifier",
      shortName: "EM",
      description:
        "<p>Over the course of play characters improve their skills and capabilities. This is achieved using Experience Rolls which are explained in more detail in the Game System section.</p><p>A character's CHA score may adjust the number of Experience Rolls the character receives, reflecting the relationship they have with their peers and their reputation in the community. With a high CHA people are willing to put themselves out to help train or support the character while they undergo tuition. Conversely, with particularly low CHA, there may be some difficulty improving one's capabilities without the assistance of others; finding someone to spar against for example.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>CHA</th><th scope='col'>Exp. Modifier</th></tr></thead><tbody><tr><td>6 or less</td><td>-1</td></tr><tr><td>7-12</td><td>+0</td></tr><tr><td>13-18</td><td>+1</td></tr><tr><td>Each 6 points</td><td>+1</td></tr></tbody></table>",
      get value() {
        return (
          Math.ceil(character.value.characteristics.charisma.value / 6) - 2
        );
      },
    },
    healingRate: {
      name: "Healing Rate",
      shortName: "HR",
      description:
        "<p>After receiving injuries, a character needs to recuperate. Healing Rate determines how quickly they naturally recover from wounds. Depending on the severity of the injury, the Healing Rate denotes how many Hit Points are recovered per day, week, or month.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>CON</th><th scope='col'>Healing Rate</th></tr></thead><tbody><tr><td>6 or less</td><td>1</td></tr><tr><td>7-12</td><td>2</td></tr><tr><td>13-18</td><td>3</td></tr><tr><td>Each 6 points</td><td>+1</td></tr></tbody></table>",
      get value() {
        return Math.ceil(
          character.value.characteristics.constitution.value / 6
        );
      },
    },
    initiative: {
      name: "Initiative Bonus",
      shortName: "initiative",
      description:
        "<p>The moment at which someone reacts in combat is governed by Initiative. Initiative acts as a modifier to Initiative rolls; the higher the Initiative, the faster one responds in a combat situation, determining when you can act. Further factors – armor for example – modify it. The Combat chapter goes into more detail on how Initiative is used.</p><p>Initiative is the average of the DEX and INT Characteristics.</p>",
      get value() {
        return Math.ceil(
          (character.value.characteristics.dexterity.value +
            character.value.characteristics.intelligence.value) /
            2
        );
      },
    },
    luckPoints: {
      name: "Luck Points",
      shortName: "LP",
      description:
        "<p>Luck Points represent that strange force differentiating adventuring heroes from everyday folk. Call it fate, karma, or simple good fortune. Luck Points can be used to:</p><ul><li>Re-roll the dice if they are unfavorable.</li><li>Mitigate physical damage or other unfortunate circumstances.</li><li>Gain an edge at a vital moment in combat.</li></ul><p>Exactly how they are used, and when, is described in the Game System section. Once a Luck Point is spent, the pool decreases; when one is out of Luck Points, no more are available – unless the Games Master makes an impromptu award – until the next game session when they replenish to their normal value.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>POW</th><th scope='col'>Luck Points</th></tr></thead><tbody><tr><td>6 or less</td><td>1</td></tr><tr><td>7-12</td><td>2</td></tr><tr><td>13-18</td><td>3</td></tr><tr><td>Each 6 points</td><td>+1</td></tr></tbody></table>",
      get value() {
        return Math.ceil(character.value.characteristics.power.value / 6);
      },
    },
    movementRate: {
      name: "Movement Rate",
      shortName: "MR",
      description: "<p>Every creature has a Movement Rate – a number of metres that can be travelled during a specific period of time. Movement is not calculated from Characteristics but is a default value which differs from species to species. The base Movement Rate for humans is 6 metres.</p><p>Gaits faster than Walk apply a multiplier to the Move rating:</p><ul><li><b>Run:</b> Move x3</li><li><b>Sprint:</b> Move x5</li></ul><p>While at a Run or Sprint Gait, characters cannot attempt most proactive actions like attacking or casting spells. Some exceptions include...</p><ul><li>Attacks when using the Charging rules.</li><li>Firing ranged weapons with the Skirmishing trait.</li></ul><p>As a general rule, any allowed actions should be treated as one Grade harder to pull off at a Run, and two Grades harder at a Sprint.</p>",
      value: 6
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
        <div class="col-lg-4">
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
        <div class="col-lg-4">
          <ul class="chars list-unstyled">
            <li
              v-for="attribute in character.attributes"
              :key="`attribute-${attribute.shortName}`"
              class="chars__item d-flex align-items-center justify-content-between py-2 border-bottom"
            >
              <div class="chars__name-wrapper d-flex align-items-center gap-2">
                <span class="chars__name fw-bold">{{ attribute.name }}</span>
                <button
                  class="icon-btn btn btn-sm p-1"
                  data-bs-toggle="modal"
                  :data-bs-target="`#charModal-${attribute.shortName}`"
                >
                  <Icon name="question" />
                </button>
              </div>
              <div class="chars__value-wrapper d-flex align-items-center gap-3">
                <span class="chars__value fw-bold text-center">
                  {{ attribute.value }}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-4"></div>
      </div>
    </div>

    <!-- Modals -->
    <div
      v-for="charModal in {
        ...character.characteristics,
        ...character.attributes,
      }"
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
          <div class="modal-body" v-html="charModal.description"></div>
        </div>
      </div>
    </div>
  </main>
</template>
