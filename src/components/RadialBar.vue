<template>
  <div class="bar" :style="barStyle">
    <svg
    :height="radius * 2"
    :width="radius * 2"
    >
      <circle
        class="shadow"
        fill="transparent"
        :stroke-width="stroke"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
      <circle
        class="progress"
        fill="transparent"
        :stroke-dasharray="circumference + ' ' + circumference"
        :style="{ strokeDashoffset }"
        :stroke-width="stroke"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
    </svg>
    <div class="text" :style="textStyle">
      {{value}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadialBar',
  props: {
    radius: Number,
    progress: Number,
    stroke: {
      type: Number,
      default: () => (8),
    },
    value: Number,
    maximum: {
      type: Number,
      default: () => (100),
    },
  },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return {
      normalizedRadius,
      circumference,
    };
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - (this.progress / this.maximum) * this.circumference;
    },
    barStyle() {
      return {
        width: `${this.radius * 2}px`,
      };
    },
    textStyle() {
      return {
        ...this.barStyle,
        top: `-${this.radius * 2 - 25}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';


.text {
  font-family: Oswald;
  color: $checkbox_checkborder-colour;
  left: 0rem;
  font-size: 4rem;
  width: 11rem;
  text-align: center;
  position: relative;
  user-select: none;
}

.progress {
  stroke: $sidemenu-highlight;
  transition: stroke-dashoffset 0.25s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%,
}

.shadow {
  stroke: $description-colour;
}


</style>
