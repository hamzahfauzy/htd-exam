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

function alertClass() {
  switch (props.type) {
    case 'success':
      return 'p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 border border-green-800'
    case 'warning':
      return 'p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 border border-yellow-800'
    case 'danger':
      return 'p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-800'
    default:
      return 'p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 border border-blue-800'
  }
}
</script>

<template>
  <div :class="alertClass()" role="alert">
    {{ text }}
  </div>
</template>
