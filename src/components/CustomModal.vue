<script setup>
defineProps(['content'])
</script>

<template>
  <div class="w-full h-full fixed inset-0 flex items-center justify-center">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow p-5">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
