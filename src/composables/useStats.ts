export function useStats() {
  function increaseStat(
    stat: { increase: number; value: number; min: number; max: number },
    perks: number
  ) {
    console.log("increaseStat");
    if (stat.increase >= stat.max || perks <= 0) return;

    if (stat.increase < stat.min) {
      stat.increase = stat.min;
      return;
    }

    stat.increase++;
  }

  function decreaseStat(stat: {
    increase: number;
    value: number;
    min: number;
    max: number;
  }) {
    console.log("decreaseStat");
    if (stat.value + stat.increase <= stat.min) return;

    stat.increase--;
  }

  return { increaseStat, decreaseStat };
}
