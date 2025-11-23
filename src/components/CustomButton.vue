<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

function buttonClass() {
  switch (props.type) {
    case 'success':
      return (
        'focus:outline-none text-white bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5' +
        (!props.disabled ? ' hover:bg-green-800' : '')
      )
    case 'warning':
      return (
        'focus:outline-none text-white bg-yellow-400 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5' +
        (!props.disabled ? ' hover:bg-yellow-500' : '')
      )
    case 'secondary':
      return (
        'text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5' +
        (!props.disabled ? ' hover:bg-gray-100' : '')
      )
    case 'danger':
      return (
        'focus:outline-none text-white bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5' +
        (!props.disabled ? ' hover:bg-red-800' : '')
      )
    default:
      return (
        'text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5' +
        (!props.disabled ? ' hover:bg-blue-800' : '')
      )
  }
}
</script>

<template>
  <button type="button" :class="buttonClass()" :disabled="disabled" v-html="text">
  </button>
</template>
