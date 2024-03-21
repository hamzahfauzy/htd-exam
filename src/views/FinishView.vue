<script setup>
import { useRouter } from 'vue-router'
import CustomButton from '../components/CustomButton.vue'

const router = useRouter()
</script>

<template>
  <main class="text-center w-full flex-col gap-5 flex p-5">
    <div class="flex flex-col gap-2">
      <h5 class="text-xl">Selamat!</h5>
      <p>Anda telah mengirimkan jawaban.</p>
    </div>
    <div>
      <CustomButton text="SELESAI" @click="router.replace({ name: 'home' })" />
    </div>
  </main>
</template>
