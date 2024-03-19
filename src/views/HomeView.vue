<script setup>
import CustomButton from '../components/CustomButton.vue'
</script>

<template>
  <main class="text-center w-full flex-col gap-5 flex">
    <div>
      <h5 class="text-xl">Senin, 20 Maret 2024</h5>
      <h3>08.00 - 09.00</h3>
      <h5 class="text-xl">Matematika</h5>
    </div>
    <div class="flex flex-col gap-2">
      <CustomButton text="MULAI" @click="this.$router.push({ name: 'instruction' })" />
      <CustomButton
        text="LANJUTKAN"
        type="success"
        @click="this.$router.push({ name: 'question' })"
      />
      <CustomButton
        text="LIST SOAL"
        type="warning"
        @click="this.$router.push({ name: 'list-question' })"
      />
      <CustomButton text="KELUAR" type="danger" />
    </div>
  </main>
</template>
