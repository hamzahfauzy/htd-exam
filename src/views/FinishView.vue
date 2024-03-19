<script setup>
import CustomButton from '../components/CustomButton.vue'
</script>

<template>
  <main class="text-center w-full flex-col gap-5 flex">
    <div class="flex flex-col gap-2">
      <h5 class="text-xl">Selamat!</h5>
      <p>Anda telah mengirimkan jawaban.</p>
    </div>
    <div>
      <CustomButton text="SELESAI" @click="this.$router.push({ name: 'home' })" />
    </div>
  </main>
</template>
