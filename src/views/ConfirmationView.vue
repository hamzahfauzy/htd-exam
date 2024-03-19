<script setup>
import CustomButton from '../components/CustomButton.vue'
</script>

<template>
  <main class="text-center w-full flex-col gap-5 flex">
    <div class="flex flex-col gap-2">
      <h5 class="text-xl">Perhatian!</h5>
      <p>Apakah anda yakin ingin mengirimkan jawaban?</p>
    </div>
    <div>
      <CustomButton text="KEMBALI" type="secondary" @click="this.$router.back()" />
      <CustomButton text="KIRIM" type="success" @click="this.$router.push({ name: 'finish' })" />
    </div>
  </main>
</template>
