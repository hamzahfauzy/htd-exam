<script setup>
import CustomButton from '../components/CustomButton.vue'
</script>

<template>
  <main class="text-center w-full flex-col gap-5 flex">
    <div class="flex flex-col gap-2">
      <h5 class="text-xl">Instruksi Soal Tipe 1</h5>
      <p class="text-justify">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus dolore
        obcaecati sed laudantium nostrum ducimus atque? Aperiam?
      </p>
    </div>
    <div>
      <CustomButton text="KEMBALI" type="secondary" @click="this.$router.back()" />
      <CustomButton
        text="LIST SOAL"
        type="warning"
        @click="this.$router.push({ name: 'list-question' })"
      />
      <CustomButton text="SELANJUTNYA" @click="this.$router.push({ name: 'question' })" />
    </div>
  </main>
</template>
