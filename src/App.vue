<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "./components/icon.vue";

type Characteristic = {
  name: string;
  slug: string;
  description: string;
  value: number;
  min: number;
  max: number;
};

type Attribute = {
  name: string;
  slug: string;
  description: string;
  value: number | string;
};

type Skill = {
  name: string;
  slug: string;
  description: string;
  increases: Record<string, number>;
  value: number;
};

type CultureSkills = {
  standard: string[];
  standardLimited?: {
    list: string[];
    limit: number;
  };
  professional: string[];
};

type Culture = {
  name: string;
  slug: string;
  description: string;
  skills: CultureSkills;
};

type CharacterType = {
  characteristics: Record<string, Characteristic>;
  attributes: Record<string, Attribute>;
  skills: {
    standard: Record<string, Skill>;
  };
  languages: Record<string, Skill>;
  cultures: Record<string, Culture>;
};

const character = ref<CharacterType>({
  characteristics: {
    strength: {
      name: "Strength",
      slug: "STR",
      description:
        "STR represents physical strength: how much one can lift, how hard one can hit, and so on. STR is a component of the Damage Modifier. If a character is reduced to zero STR they lack the ability to move or lift objects.",
      value: 3,
      min: 3,
      max: 18,
    },
    constitution: {
      name: "Constitution",
      slug: "CON",
      description:
        "CON is measure of health and hardiness. CON is a component in determining Hit Points and Healing Rate. If CON falls to zero for any reason the character dies.",
      value: 3,
      min: 3,
      max: 18,
    },
    size: {
      name: "Size",
      slug: "SIZ",
      description:
        "SIZ measures mass and helps indicate Height and Weight. SIZ is used to help figure Hit Points, as larger, heavier creatures tend to have greater endurance against damage. SIZ can also be used to determine a character's Damage Modifier, since mass helps to increase the force of a blow.",
      value: 8,
      min: 8,
      max: 18,
    },
    dexterity: {
      name: "Dexterity",
      slug: "DEX",
      description:
        "Agility, balance, and reflexes are measured by DEX. It is an important aspect of Action Points and Initiative. If a character is reduced to zero DEX, they suffer functional paralysis.",
      value: 3,
      min: 3,
      max: 18,
    },
    intelligence: {
      name: "Intelligence",
      slug: "INT",
      description:
        "INT is measurement of cognitive ability. Those with a lower INT score are not necessarily stupid, but they are likely to be constrained in how creatively they can employ their wits. INT is a factor in calculating Action Points and Initiative. If INT is reduced to zero, the character becomes completely mindless.",
      value: 8,
      min: 8,
      max: 18,
    },
    power: {
      name: "Power",
      slug: "POW",
      description:
        "POW is a measurement of a character's soul, spirit, inner drive, or capacity for magic. POW governs a character's Magic Points and Luck Points. If a character's POW ever drops to zero, they lose all independent will.",
      value: 3,
      min: 3,
      max: 18,
    },
    charisma: {
      name: "Charisma",
      slug: "CHA",
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
      slug: "AP",
      description:
        "<p>How often a character can act in a Combat Round is determined by Action Points.</p><table><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>INT + DEX</th><th scope='col'>Action Points</th></tr></thead><tbody><tr><td>12 or Less</td><td>1</td></tr><tr><td>13-24</td><td>2</td></tr><tr><td>25-36</td><td>3</td></tr><tr><td>For every additional 12 points</td><td>+1</td></tr></tbody></table>",
      get value(): number {
        return Math.ceil(
          (character.value.characteristics.dexterity.value +
            character.value.characteristics.intelligence.value) /
            12
        );
      },
    },
    damageModifier: {
      name: "Damage Modifier",
      slug: "DM",
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
      slug: "EM",
      description:
        "<p>Over the course of play characters improve their skills and capabilities. This is achieved using Experience Rolls which are explained in more detail in the Game System section.</p><p>A character's CHA score may adjust the number of Experience Rolls the character receives, reflecting the relationship they have with their peers and their reputation in the community. With a high CHA people are willing to put themselves out to help train or support the character while they undergo tuition. Conversely, with particularly low CHA, there may be some difficulty improving one's capabilities without the assistance of others; finding someone to spar against for example.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>CHA</th><th scope='col'>Exp. Modifier</th></tr></thead><tbody><tr><td>6 or less</td><td>-1</td></tr><tr><td>7-12</td><td>+0</td></tr><tr><td>13-18</td><td>+1</td></tr><tr><td>Each 6 points</td><td>+1</td></tr></tbody></table>",
      get value(): number {
        return (
          Math.ceil(character.value.characteristics.charisma.value / 6) - 2
        );
      },
    },
    healingRate: {
      name: "Healing Rate",
      slug: "HR",
      description:
        "<p>After receiving injuries, a character needs to recuperate. Healing Rate determines how quickly they naturally recover from wounds. Depending on the severity of the injury, the Healing Rate denotes how many Hit Points are recovered per day, week, or month.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>CON</th><th scope='col'>Healing Rate</th></tr></thead><tbody><tr><td>6 or less</td><td>1</td></tr><tr><td>7-12</td><td>2</td></tr><tr><td>13-18</td><td>3</td></tr><tr><td>Each 6 points</td><td>+1</td></tr></tbody></table>",
      get value(): number {
        return Math.ceil(
          character.value.characteristics.constitution.value / 6
        );
      },
    },
    initiative: {
      name: "Initiative Bonus",
      slug: "initiative",
      description:
        "<p>The moment at which someone reacts in combat is governed by Initiative. Initiative acts as a modifier to Initiative rolls; the higher the Initiative, the faster one responds in a combat situation, determining when you can act. Further factors – armor for example – modify it. The Combat chapter goes into more detail on how Initiative is used.</p><p>Initiative is the average of the DEX and INT Characteristics.</p>",
      get value(): number {
        return Math.ceil(
          (character.value.characteristics.dexterity.value +
            character.value.characteristics.intelligence.value) /
            2
        );
      },
    },
    luckPoints: {
      name: "Luck Points",
      slug: "LP",
      description:
        "<p>Luck Points represent that strange force differentiating adventuring heroes from everyday folk. Call it fate, karma, or simple good fortune. Luck Points can be used to:</p><ul><li>Re-roll the dice if they are unfavorable.</li><li>Mitigate physical damage or other unfortunate circumstances.</li><li>Gain an edge at a vital moment in combat.</li></ul><p>Exactly how they are used, and when, is described in the Game System section. Once a Luck Point is spent, the pool decreases; when one is out of Luck Points, no more are available – unless the Games Master makes an impromptu award – until the next game session when they replenish to their normal value.</p><table class='table table-striped table-bordered table-hover text-center'><thead class='table-dark'><tr><th scope='col'>POW</th><th scope='col'>Luck Points</th></tr></thead><tbody><tr><td>6 or less</td><td>1</td></tr><tr><td>7-12</td><td>2</td></tr><tr><td>13-18</td><td>3</td></tr><tr><td>Each 6 points</td><td>+1</td></tr></tbody></table>",
      get value(): number {
        return Math.ceil(character.value.characteristics.power.value / 6);
      },
    },
    movementRate: {
      name: "Movement Rate",
      slug: "MR",
      description:
        "<p>Every creature has a Movement Rate – a number of metres that can be travelled during a specific period of time. Movement is not calculated from Characteristics but is a default value which differs from species to species. The base Movement Rate for humans is 6 metres.</p><p>Gaits faster than Walk apply a multiplier to the Move rating:</p><ul><li><b>Run:</b> Move x3</li><li><b>Sprint:</b> Move x5</li></ul><p>While at a Run or Sprint Gait, characters cannot attempt most proactive actions like attacking or casting spells. Some exceptions include...</p><ul><li>Attacks when using the Charging rules.</li><li>Firing ranged weapons with the Skirmishing trait.</li></ul><p>As a general rule, any allowed actions should be treated as one Grade harder to pull off at a Run, and two Grades harder at a Sprint.</p>",
      value: 6,
    },
  },
  skills: {
    standard: {
      athletics: {
        name: "Athletics",
        slug: "athletics",
        description:
          "<p><b>Strength + Dexterity</b></p><p>Athletics covers a range of physical activities, including climbing, jumping, throwing, and running. Skills rolls for any of these activities are handled by a single roll against the Athletics skill. See Movement for more information on climbing, jumping, and running.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.strength.value +
            character.value.characteristics.dexterity.value
          );
        },
      },
      boating: {
        name: "Boating",
        slug: "boating",
        description:
          "<p><b>Strength + Constitution</b></p><p>The Boating skill covers the operation of small floating craft. on rivers, lakes, and close inshore. Appropriate vessels are generally boats, canoes, or rafts which travel short distances and are unsuited to the rigors of the open sea. Most are propelled using oars, paddles, punts, or simple sails; or can even be towed by animals. Ships with large crews or designed for long, overseas journeys are covered under the Seamanship Professional Skill.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.strength.value +
            character.value.characteristics.constitution.value
          );
        },
      },
      brawn: {
        name: "Brawn",
        slug: "brawn",
        description:
          "<p><b>Strength + Size</b></p><p>Brawn is the efficient application of technique when applying raw physical force. The skill covers acts of applied might, including lifting, breaking down doors and contests of strength.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.strength.value +
            character.value.characteristics.size.value
          );
        },
      },
      conceal: {
        name: "Conceal",
        slug: "conceal",
        description:
          "<p><b>Dexterity + Power</b></p><p>Conceal is the counterpoint to Stealth, being the concealment of large objects rather than the character themselves. For instance, conceal could be used to hide a chariot behind some rocks, or sweep away the wheel ruts it left so its path cannot be tracked. The skill is versatile in application, anything from hiding a scroll in a library to disguising the presence of a trap or secret passage.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.dexterity.value +
            character.value.characteristics.power.value
          );
        },
      },
      customs: {
        name: "Customs",
        slug: "customs",
        description:
          "<p><b>Intelligence x2 +40</b></p><p>Customs represents the character's knowledge of his own community: its social codes, rites, rituals, taboos, and so on. The skill is used when it is essential to accurately interpret or perform any socially important custom or to behave in a particular way.</p>",
        increases: {},
        get value(): number {
          return character.value.characteristics.intelligence.value * 2 + 40;
        },
      },
      dance: {
        name: "Dance",
        slug: "dance",
        description:
          "<p><b>Dexterity + Charisma</b></p><p>Just about every culture uses dance in some way – either as recreation or as part of important rituals. It might be a court dance, a war dance, or a simple set of movements accompanying a prayer or ceremonial chant. The Dance skill measures a character's ability to move rhythmically and accurately (to a reasonable degree) when called upon to do so.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.dexterity.value +
            character.value.characteristics.charisma.value
          );
        },
      },
      deceit: {
        name: "Deceit",
        slug: "deceit",
        description:
          "<p><b>Intelligence + Charisma</b></p><p>Deceit covers all instances where a character attempts to mask the truth and offer a deception of some kind: barefaced lying, misleading a guard, or even bluffing (or cheating) during a card game. The skill also covers instances where hiding true emotions or motives is necessary (feigning pleasure when one is bitterly disappointed perhaps, or attempting to seem welcoming and open when the opposite is true). Deceit forms a counterpart to the Insight skill and can be used to oppose Insight rolls when others are attempting to discern either truth or motive.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.intelligence.value +
            character.value.characteristics.charisma.value
          );
        },
      },
      drive: {
        name: "Drive",
        slug: "drive",
        description:
          "<p><b>Dexterity + Power</b></p><p>Drive covers the control of wheeled or drawn vehicles, whether by one or more beasts of burden or powered by more esoteric means, such as chariots, sleds, sail carts, or even gasoline cars. A roll is also necessary if the vehicle being driven is drawn or powered by a means different than the driver is used to (horses instead of oxen, or a motor rather than animals for example).</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.dexterity.value +
            character.value.characteristics.power.value
          );
        },
      },
      endurance: {
        name: "Endurance",
        slug: "endurance",
        description:
          "<p><b>Constitution x2</b></p><p>Endurance is a character's capacity to endure physical stress, pain, and fatigue. It measures the body's ability to deal with potentially damaging or debilitating conditions and is a general gauge of resilience, stamina, and metabolism. Endurance, like its counterpart Willpower, is used in any number of ways, but most specifically to resist the possible effects of injuries, including harmful poisons and disease.</p>",
        increases: {},
        get value(): number {
          return character.value.characteristics.constitution.value * 2;
        },
      },
      evade: {
        name: "Evade",
        slug: "evade",
        description:
          "<p><b>Dexterity x2</b></p><p>Evade is used to escape from observed, impending danger and can be used against Ranged Weapons (by diving for cover, for example), avoiding traps, changing the engagement distance in combat, and generally getting out of the way of a potential physical hazard. It can also be used as a resistance roll for certain types of magic. Using Evade usually leaves the character prone. Those with the Daredevil Combat Style Trait may use Evade to dodge a melee attack without falling prone and, against a ranged attack, they only end up prone if they fail the roll.</p>",
        increases: {},
        get value(): number {
          return character.value.characteristics.dexterity.value * 2;
        },
      },
      firstAid: {
        name: "First Aid",
        slug: "firstAid",
        description:
          "<p><b>Dexterity + Intelligence</b></p><p>The skill of First Aid measures a character's ability to treat minor injuries and stabilise more severe ones. First Aid may be applied only once per specific injury and heals 1d3 points of damage.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.dexterity.value +
            character.value.characteristics.intelligence.value
          );
        },
      },
      influence: {
        name: "Influence",
        slug: "influence",
        description:
          "<p><b>Charisma x2</b></p><p>This is a measurement of a character's ability to persuade others, through personal charisma, into a desired way of behaving. It is used in a wide variety of situations; from changing someone's mind, to bribing an official or guard. Influence rolls are typically opposed by Perception, Willpower, or another Influence skill, depending on the circumstances, and are modified by how much a character is trying to influence behavior. Attempting to persuade a close friend to loan you their horse may be relatively easy. Getting a usually incorruptible bureaucrat to accept a bribe is more difficult.</p>",
        increases: {},
        get value(): number {
          return character.value.characteristics.charisma.value * 2;
        },
      },
      insight: {
        name: "Insight",
        slug: "insight",
        description:
          "<p><b>Intelligence + Power</b></p><p>Insight is the ability to read or intuitively define another's verbal and non-verbal behavior (such as body language or the manner of speech) to establish their motives and state of mind. Insight is used to determine whether someone is telling a lie (and it can be opposed by the other person's Deceit skill), or to predict how someone feels about a particular situation. Insight can equally be applied to particular situations as well as other people: is that tavern a haven for trouble? Could the bandits be planning an ambush in the nearby hills?</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.intelligence.value +
            character.value.characteristics.power.value
          );
        },
      },
      locale: {
        name: "Locale",
        slug: "locale",
        description:
          "<p><b>Intelligence x2</b></p><p>Locale measures a character's understanding of local flora, fauna, terrain, and weather in the area where he or she has spent much of their life, usually within their community. The character knows the common plants, trees, and animals, their properties and behavior: where the best fish can be found; the movements of game creatures; where to find shelter; the likely weather for the season, and the most common regional dangers. In neighboring, yet unfamiliar locations Locale should be made one or more grades harder.</p>",
        increases: {},
        get value(): number {
          return character.value.characteristics.intelligence.value * 2;
        },
      },
      perception: {
        name: "Perception",
        slug: "perception",
        description:
          "<p><b>Intelligence + Power</b></p><p>Perception is used for both passive observation and focused detection; whether hunting for something specific, a general scan of an area, or simple awareness of their surroundings. Specific conditions – darkness, for example – may affect the Difficulty Grade of the skill roll depending on the primary senses being used. Strong scents might make an olfactory Perception roll Easy rather than Standard, whereas trying to eavesdrop on a conversation in a crowded and noisy tavern would make the roll Hard.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.intelligence.value +
            character.value.characteristics.power.value
          );
        },
      },
      ride: {
        name: "Ride",
        slug: "ride",
        description:
          "<p><b>Dexterity + Power</b></p><p>Ride covers the ability to control and remain mounted on those creatures that are trained to be ridden. The skill can be applied to a diverse range of beasts, everything from mules to elephants; even flying or swimming creatures such as giant eagles or dolphins. Riding an unfamiliar species is always one Difficulty Grade harder; while riding a species of a different medium (a horse rider riding a dragon, for example) is two grades harder. Wild, untamed creatures cannot be ridden in a constructive manner until they have been broken and trained to be riding beasts.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.dexterity.value +
            character.value.characteristics.power.value
          );
        },
      },
      sing: {
        name: "Sing",
        slug: "sing",
        description:
          "<p><b>Power + Charisma</b></p><p>Carrying a tune is covered by Sing, anything from monotonous chants through to complex arias. Singing is an inherent part of most cultures, a prime source of entertainment and perhaps used in its rituals. Important songs might be used for courting, inspiring soldiers before battle, or simply recounting a historical deed. The skill reflects the user's ability to maintain rhythm, keep in key and remember the correct words.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.power.value +
            character.value.characteristics.charisma.value
          );
        },
      },
      stealth: {
        name: "Stealth",
        slug: "stealth",
        description:
          "<p><b>Dexterity + Intelligence</b></p><p>Hiding out of plain sight, or moving with minimal sound are covered by the Stealth skill. Cover and conditions, such as darkness or loud background noise, improve the grade of the skill according to the specifics of the environment. Similarly, adverse conditions, such as a lack of cover or a quiet night will decrease the skill's grade. Circumstances also affect the difficulty of the attempt. For instance, a warrior wearing heavy armor can easily conceal themselves behind a wall, provided they stand still or move very slowly, whereas moving quickly might cause their armor to jingle.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.dexterity.value +
            character.value.characteristics.intelligence.value
          );
        },
      },
      swim: {
        name: "Swim",
        slug: "swim",
        description:
          "<p><b>Srength + Constitution</b></p><p>Without development, the ability to swim is limited to being able to thrash around and keep one's head above the water for a short time. Higher Swim percentages indicate being able to negotiate deeper and stronger waters, with less risk of drowning. Making a Swim roll thus depends entirely on the conditions. Rough seas, strong currents, white water, and rip tides all reduce the grade of the skill no matter what the character's affinity for water might be. See Movement for more information on swimming, including calculating swim speeds.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.strength.value +
            character.value.characteristics.constitution.value
          );
        },
      },
      unarmed: {
        name: "Unarmed",
        slug: "unarmed",
        description:
          "<p><b>Srength + Dexterity</b></p><p>Unarmed is a universal Combat Skill common to all characters, measuring the ability to defend oneself without the aid of weapons. The Unarmed skill covers the brawling and wrestling techniques known by that culture.</p><p>As Unarmed is a Combat Skill its Critical and Fumble effects are covered by the rules for combat, as detailed in the Combat chapter.</p>",
        increases: {},
        get value(): number {
          return (
            character.value.characteristics.strength.value +
            character.value.characteristics.dexterity.value
          );
        },
      },
      willpower: {
        name: "Willpower",
        slug: "willpower",
        description:
          "<p><b>Power x2</b></p><p>Willpower is a measure of a character's ability to concentrate, channel his force of will in a particular direction, or harden his psyche to possible mental shock. It is also a measure of personal resolve. The skill is used in all manner of situations where mental resilience is required, and this includes resisting magic. Although not a measure of sanity it can be used to endure traumatic events that would shake even the sanest, stable mind. Willpower is the mental counterpart to Endurance.</p><p>Again, like Endurance and Evade, Willpower is most often used in Opposed Rolls. When used as a Standard test, a Critical Willpower roll indicates that the character has hardened his mind and spirit to the extent that no further attempts to influence him, or shake his resolve, will work. In the case of resisting magic, a Critical Success means that no further mentally afflicting spells cast by the opponent have any effect on the character for the remainder of that encounter.</p>",
        increases: {},
        get value(): number {
          return character.value.characteristics.power.value * 2;
        },
      },
    },
  },
  languages: {
    native: {
      name: "Native Tongue",
      slug: "native",
      description:
        "<p><b>Intelligence + Charisma + 40</b></p><p>Native Tongue is the ability to speak and read one's own language, the one learned while growing up in one's home culture. Native Tongue measures articulation, eloquence, and the depth of the speaker's vocabulary.</p><p>Unlike other skills, Native Tongue is not rolled against directly. Instead, it is treated as a static representation of overall fluency, limiting the level of conversational interaction. This is described in more detail under the Language skill, but starting characters usually begin play fully fluent in their mother tongue.</p>",
      increases: {},
      get value(): number {
        return (
          character.value.characteristics.intelligence.value +
          character.value.characteristics.charisma.value +
          40
        );
      },
    },
  },
  cultures: {
    barbarian: {
      name: "Barbarian",
      slug: "barbarian",
      description:
        "<p>Tribal in nature, barbarians tend to shun civilization, viewing those who live in large towns and cities as weak and corrupt. Although their own settlements are also sedentary, they tend to be far smaller and closer to nature. Barbarian tribes occupy distinct territories, often half tamed wilderness, which they regard as their own for hunting, grazing, and farming purposes. Most are adept in the use of weaponry as they must overcome many dangers throughout their lives – facing creatures of the wilds or mustering to defend their lands against rival tribes. Since they live in small communities the ties of kinship and clan are strong elements of their society.</p>",
      skills: {
        standard: [
          "athletics",
          "brawn",
          "endurance",
          "firstAid",
          "locale",
          "perception",
        ],
        standardLimited: {
          list: ["boating", "ride"],
          limit: 1,
        },
        professional: [
          "craft",
          "healing",
          "lore",
          "musicianship",
          "navigation",
          "seamanship",
          "survival",
          "track",
        ],
      },
    },
    civilized: {
      name: "Civilized",
      slug: "civilized",
      description:
        "<p>The Civilized culture is epitomized by a semblance of law and order, underpinned by complex social codes, and supported by a bureaucracy. Civilized people believe themselves superior to all other cultures because their achievements tend toward permanence: sprawling cities, imposing temples, celebratory monuments, and the recording of history and events in books, tombstones, and scrolls. Of course, this is a thin veneer. The most Civilized of cities can be more lawless than any Barbarian frontier settlement; and the social codes may be cruder than the hospitality rituals of nomads. But the Civilized culture prides itself on its achievements, its infrastructure, its professional artisans, and its ability to easily extend its reach to wherever it wishes to go.</p>",
      skills: {
        standard: [
          "conceal",
          "deceit",
          "drive",
          "influence",
          "insight",
          "locale",
          "willpower",
        ],
        standardLimited: {
          list: [],
          limit: 1,
        },
        professional: [
          "art ",
          "commerce",
          "craft",
          "courtesy",
          "language",
          "lore",
          "musicianship",
          "streetwise",
        ],
      },
    },
    nomadic: {
      name: "Nomadic",
      slug: "nomadic",
      description:
        "<p>Nomadic people are constantly on the move, with no home and hearth to call their own. They may wander aimlessly about or might have several camps they move to and from throughout the year. They raise few crops and instead follow the migrations of animals or fish, perhaps even herding their own domesticated beasts. Nomads are adept at subsisting on what they can quickly and easily scavenge from their surroundings, letting nothing go to waste. The skills of the nomad culture should be tailored to their environment. Some journey vast distances on foot, others live in caravans or ride strange creatures, and some drift. across the oceans on great floating rafts.</p>",
      skills: {
        standard: ["endurance", "firstAid", "locale", "perception", "stealth"],
        standardLimited: {
          list: ["athletics", "boating", "swim", "drive", "ride"],
          limit: 2,
        },
        professional: [
          "craft",
          "culture",
          "language",
          "lore",
          "musicianship",
          "navigation",
          "survival",
          "track",
        ],
      },
    },
    primitive: {
      name: "Primitive",
      slug: "primitive",
      description:
        "<p>Of all peoples, primitives are those that live closest with the land, in tune with its hidden secrets. Living in extended family groups, primitive cultures gather around very simple dwellings that can range from caves and areas of natural shelter through to lean-tos or very basic huts. Primitives are typically hunter-gatherers with either few, or poorly developed, systems for farming and husbandry.</p><p>However, certain cultural beliefs, often based on superstitions, can be very well defined. Few primitive cultures have developed anything approaching a written language although paintings and other pictorial symbols serve as a means of communication.</p>",
      skills: {
        standard: [
          "brawn",
          "endurance",
          "evade",
          "locale",
          "perception",
          "stealth",
        ],
        standardLimited: {
          list: ["athletics", "boating", "swim"],
          limit: 1,
        },
        professional: [
          "craft",
          "healing",
          "lore",
          "musicianship",
          "navigation",
          "survival",
          "track",
        ],
      },
    },
  },
});

const steps = ref<string[]>([
  "Distribute 80 points amongst the characteristics. Minimum 3 (8 for Intelligence and Size), maximum 18. Use all the points.",
  "Decide on cultural background",
]);

const currentStep = ref<number>(1);
const error = ref<string>("");
const chosenCulture = ref<string>("");

// computed
const perks = computed<{ used: number; max: number } | null>(() => {
  switch (currentStep.value) {
    case 1:
      // 80 perks for upgrading characteristics
      return {
        used: Object.values(character.value.characteristics).reduce(
          (sum, char) => sum + char.value,
          0
        ),
        max: 80,
      };
    default:
      return null;
  }
});

// methods
function validateNextStep(): boolean {
  switch (currentStep.value) {
    case 1:
      if (perks.value && perks.value.used < perks.value.max) {
        error.value = "You have not allocated all perk points";
        return false;
      }
      return true;
    case 2:
      if (!chosenCulture.value) {
        error.value = "Please select a culture";
        return false;
      }
      return true;
    default:
      return true;
  }
}

function handleNext():void {
  if (validateNextStep()) {
    currentStep.value++;
    error.value = "";
  }
}
</script>

<template>
  <main>
    <div class="header bg-white">
      <div class="container py-2 p-lg-4">
        <h5 class="mb-4 text-center">Step {{ currentStep }}</h5>
        <div class="progress mb-3">
          <div
            class="progress-bar bg-secondary"
            role="progressbar"
            :style="`width: ${(currentStep * 100) / steps.length}%`"
            :aria-valuenow="currentStep"
            aria-valuemin="0"
            :aria-valuemax="steps.length"
          ></div>
        </div>
        <p class="mb-0 text-center">{{ steps[currentStep - 1] }}</p>
      </div>
    </div>
    <div class="container py-2 py-lg-4">
      <div class="row mb-4">
        <div class="p-2 px-lg-4">
          <div class="d-flex align-items-center gap-3">
            <span>Culture: </span>
            <div class="dropdown">
              <button
                class="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{
                  chosenCulture
                    ? character.cultures[chosenCulture].name
                    : "Choose culture"
                }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <button
                    v-for="culture in character.cultures"
                    :key="culture.slug"
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    :data-bs-target="`#cultureModal-${culture.slug}`"
                  >
                    {{ culture.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 p-2 px-lg-4">
          <h5 class="fw-bold">Characteristics</h5>
        </div>
        <div class="col-lg-4 p-2 px-lg-4">
          <h5 class="fw-bold">Attributes</h5>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-lg-4 p-2 px-lg-4">
          <ul class="chars list-unstyled">
            <li
              v-for="char in character.characteristics"
              :key="char.slug"
              class="chars__item d-flex align-items-center justify-content-between py-2 border-bottom"
            >
              <div class="chars__name-wrapper d-flex align-items-center gap-2">
                <span class="chars__name">{{ char.name }}</span>
                <button
                  class="icon-btn btn btn-sm p-1"
                  data-bs-toggle="modal"
                  :data-bs-target="`#charModal-${char.slug}`"
                >
                  <Icon name="question" />
                </button>
              </div>
              <div class="chars__value-wrapper d-flex align-items-center gap-3">
                <button
                  class="btn btn-sm btn-secondary"
                  :class="{ hidden: currentStep !== 1 }"
                  type="button"
                  :disabled="char.value <= char.min"
                  aria-label="-"
                  @click="char.value--"
                >
                  -
                </button>
                <span class="chars__value text-center">
                  {{ char.value }}
                </span>
                <button
                  class="btn btn-sm btn-secondary"
                  :class="{ hidden: currentStep !== 1 }"
                  type="button"
                  :disabled="
                    char.value >= char.max || (!!perks && perks.used >= perks.max)
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
        <div class="col-lg-4 p-2 px-lg-4">
          <ul class="chars list-unstyled">
            <li
              v-for="attribute in character.attributes"
              :key="`attribute-${attribute.slug}`"
              class="chars__item d-flex align-items-center justify-content-between py-2 border-bottom"
            >
              <div class="chars__name-wrapper d-flex align-items-center gap-2">
                <span class="chars__name">{{ attribute.name }}</span>
                <button
                  class="icon-btn btn btn-sm p-1"
                  data-bs-toggle="modal"
                  :data-bs-target="`#charModal-${attribute.slug}`"
                >
                  <Icon name="question" />
                </button>
              </div>
              <div class="chars__value-wrapper d-flex align-items-center gap-3">
                <span class="chars__value text-center">
                  {{ attribute.value }}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-4 p-2 px-lg-4"></div>
      </div>
      <div class="row">
        <div class="col-lg-4 p-2 px-lg-4">
          <h5 class="fw-bold">Standard skills</h5>
        </div>
        <div class="col-lg-4 p-2 px-lg-4">
          <h5 class="fw-bold">Professional skills</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 p-2 px-lg-4">
          <ul class="chars list-unstyled">
            <li
              v-for="standSkill in character.skills.standard"
              :key="standSkill.slug"
              class="chars__item d-flex align-items-center justify-content-between py-2 border-bottom"
            >
              <div class="chars__name-wrapper d-flex align-items-center gap-2">
                <span class="chars__name">{{ standSkill.name }}</span>
                <button
                  class="icon-btn btn btn-sm p-1"
                  data-bs-toggle="modal"
                  :data-bs-target="`#charModal-${standSkill.slug}`"
                >
                  <Icon name="question" />
                </button>
              </div>
              <div class="chars__value-wrapper d-flex align-items-center gap-3">
                <button
                  class="btn btn-sm btn-secondary"
                  type="button"
                  aria-label="-"
                >
                  -
                </button>
                <span class="chars__value text-center">
                  {{ standSkill.value }}%
                </span>
                <button
                  class="btn btn-sm btn-secondary"
                  type="button"
                  aria-label="+"
                >
                  +
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-4 p-2 px-lg-4">
          <div>
            <h5 class="fw-bold">Languages</h5>
            <ul class="chars list-unstyled">
              <li
                v-for="lang in character.languages"
                :key="lang.slug"
                class="chars__item d-flex align-items-center justify-content-between py-2 border-bottom"
              >
                <div
                  class="chars__name-wrapper d-flex align-items-center gap-2"
                >
                  <span class="chars__name">{{ lang.name }}</span>
                  <button
                    class="icon-btn btn btn-sm p-1"
                    data-bs-toggle="modal"
                    :data-bs-target="`#charModal-${lang.slug}`"
                  >
                    <Icon name="question" />
                  </button>
                </div>
                <div
                  class="chars__value-wrapper d-flex align-items-center gap-3"
                >
                  <span class="chars__value text-center">
                    {{ lang.value }}%
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4 p-2 px-lg-4"></div>
      </div>
    </div>
    <div class="footer sticky-bottom bg-white shadow-sm">
      <div class="container py-2 p-lg-4">
        <div class="row">
          <div class="col-lg-3 d-flex align-items-center fw-bold">
            <div v-if="perks" class="mb-2">
              Perk points: {{ perks.used }} /
              {{ perks.max }}
            </div>
          </div>
          <div class="footer__error col-lg-6 d-flex align-items-center">
            <div v-if="error" class="mb-2 text-danger">
              {{ error }}
            </div>
          </div>
          <div class="col-lg-3 text-end">
            <button
              class="btn btn-outline-secondary me-2"
              :disabled="currentStep <= 1"
              @click="currentStep--"
            >
              Back
            </button>
            <button
              class="btn btn-primary"
              :disabled="currentStep >= steps.length"
              @click="handleNext"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div
      v-for="charModal in {
        ...character.characteristics,
        ...character.attributes,
        ...character.skills.standard,
        ...character.languages,
      }"
      :key="`charModal-${charModal.slug}`"
      :id="`charModal-${charModal.slug}`"
      class="modal modal-lg fade"
      tabindex="-1"
      :aria-labelledby="`charModal-${charModal.slug}`"
    >
      <div class="modal-dialog modal-dialog-scrollable">
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
    <div
      v-for="cultureModal in character.cultures"
      :key="`cultureModal-${cultureModal.slug}`"
      :id="`cultureModal-${cultureModal.slug}`"
      class="modal modal-lg fade"
      tabindex="-1"
      :aria-labelledby="`cultureModal-${cultureModal.slug}`"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title fs-5">{{ cultureModal.name }}</h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-html="cultureModal.description"></div>
            <h5>Skills</h5>
            <ul>
              <li>
                <strong>Standard Skills: </strong>
                <template
                  v-for="(skill, index) in cultureModal.skills.standard"
                  :key="`${cultureModal.slug}-standard-skills-${skill}`"
                >
                  {{ character.skills.standard[skill].name
                  }}{{
                    index !== cultureModal.skills.standard.length - 1
                      ? ", "
                      : ""
                  }}
                </template>
                <template
                  v-if="cultureModal.skills.standardLimited?.list.length"
                  >; and
                  {{ cultureModal.skills.standardLimited.list.length }} of the
                  following:
                  <template
                    v-for="(skill, index) in cultureModal.skills.standardLimited
                      .list"
                    :key="`${cultureModal.slug}-limited-standard-skills-${skill}`"
                  >
                    {{ character.skills.standard[skill].name
                    }}{{
                      index !==
                      cultureModal.skills.standardLimited.list.length - 1
                        ? ", "
                        : ". "
                    }}
                  </template>
                </template>
                In addition, the player may also choose a cultural Combat Style.
              </li>
              <li>
                <strong>Professional Skills: </strong>
                <template
                  v-for="(skill, index) in cultureModal.skills.professional"
                  :key="`${cultureModal.slug}-professional-skill-${skill}`"
                >
                  <!-- {{ character.skills.professional[skill].name }} -->
                  {{
                    index !== cultureModal.skills.professional.length - 1
                      ? ", "
                      : "."
                  }}
                </template>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="chosenCulture = cultureModal.slug"
            >
              Choose
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
