/* eslint-disable func-names */
<template>
<div class="input-container" :class="containerClasses">
  <div class="slot-container" ref="input-container">
    <slot v-model="value" @focus="focus" @blur="blur" class="input"></slot>
  </div>
  <label class="label-placeholder" :for="labelName">{{label}}</label>
  <label
    class="label-active"
    :class="activeLabelClass"
    :style="activeLabelStyle"
    :for="labelName">
      {{label}}
    </label>
  <div v-show="errors" class="error-message">
    <p v-for="error in errors" :key="error">
      {{error}}
    </p>
  </div>
</div>
</template>

<script>
// based on
// https://github.com/SabatinoMasala/vue-simple-floating-labels/blob/master/src/components/FloatingLabel.vue
export default {
  name: 'FloatLabel',
  props: {
    label: String,
    error: {
      type: [String, Array],
      default: null,
    },
    value: {
      type: [String, Object],
      default() { return null; },
    },
  },
  data() {
    return {
      hasFocus: false,
      hasContent: false,
      newValue: this.value,
    };
  },
  computed: {
    activeLabelClass() {
      return {};
    },
    activeLabelStyle() {
      return {
        top: '0',
        left: '0',
        color: '#626262',
      };
    },
    labelName() {
      if (this.label !== undefined) {
        return this.label;
      }
      return 'no name';
    },
    containerClasses() {
      const classes = {
        // 'input-container-content': this.hasFocus,
        'input-container-content': this.hasContent || this.hasFocus,
      };

      if (this.error) {
        classes['has-error'] = true;
      }

      /*
      TODO: need to implement error highlight
      if hasError classes[error] = {error class};
      */
      return classes;
    },
    errors() {
      if (this.error && !Array.isArray(this.error)) {
        return [this.error];
      }
      return this.error;
    },
  },
  methods: {
    clear() {
      this.formElement.value = '';
      this.hasContent = false;
      this.hasFocus = false;
      this.$emit('clear');
    },
    focus() {
      this.hasFocus = true;
      this.$emit('focus');
    },
    input(event) {
      this.hasFocus = true;
      this.hasContent = event.target.value !== '';
      this.$emit('input');
    },
    blur() {
      this.hasFocus = false;
    },
  },
  mounted() {
    this.formElement = this.$refs['input-container'].querySelector('input, textarea');
    if (this.formElement) {
      this.formElement.addEventListener('input', this.input);
      this.formElement.addEventListener('blur', this.blur);
      this.formElement.addEventListener('focus', this.focus);

      // check if value provided, and when activate the float label
      if (this.formElement.value) {
        this.hasContent = true;
      }
    }
  },
  watch: {
    value(val) {
      if (val) this.hasContent = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.has-error {
  input {
    border-color: $warning-colour!important;
  }

  textarea {
    border-color: $warning-colour!important;
  }
}

.input-container {
  position: relative;
  padding: 1rem 8px;
  margin-bottom: 1rem;

  .error-message {
    color: $warning-colour;
    font-size: 0.8rem;
    position: absolute;

    p {
      margin: 0.1rem 0;
    }
  }

  .slot-container {
    height: 100%;

    input {
      height: 2.5rem;
      font-size: 1rem;
      padding: 0rem 0.5rem 0 0.5rem;
      border: 1px solid $form_border-colour;
      display: block;
      border-radius: 3px;
      width: 100%;
      position: relative;
      background-color: $input_background-colour;
      outline: none;
    }

    textarea {
      font-size: 1rem;
      padding: 0.7rem 0.5rem;
      border: 1px solid $form_border-colour;
      display: block;
      border-radius: 3px;
      width: 100%;
      position: relative;
      background: $input_background-colour;
      outline: none;
      // height: 10rem;
    }
  }

  // has content
  &.input-container-content {
    label {
      &.label-placeholder {
        opacity: 0;
      }
    }

    .label-active {
      opacity: 1;
      top: -5px!important;
    }

    .label-placeholder {
      transform: translate3d(0, 6px, 0);
    }
  }

  // has content and focused
  &.input-container-focus.input-container-content {
    label {
      &.label-active {
        opacity: 1;
        transform: translate3d(0, -5px, 0);
      }

      &.label-placeholder {
        opacity: 0;
      }
    }
  }

  label {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    padding-left: 1rem;

    &.label-active {
      font-size: 1rem;
      font-weight: 500;
      color: $title-colour;
      line-height: 1rem;
      opacity: 0;
      transform: translate3d(0, 3px, 0);
      transform-origin: 0 0;
    }

    &.label-placeholder {
      top: 2.3rem;
      transform: translate(0, -50%);
      color: $input_label-colour;
    }
  }
}

</style>
