<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'primary'
  }
})

function buttonClass() {
  switch (props.type) {
    case 'success':
      return 'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5'
    case 'warning':
      return 'focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5'
    case 'secondary':
      return 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5'
    case 'danger':
      return 'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5'
    default:
      return 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5'
  }
}
</script>

<template>
  <button type="button" :class="buttonClass()">
    {{ text }}
  </button>
</template>
