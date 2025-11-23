<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomButton from '../components/CustomButton.vue'

const router = useRouter()
const route = useRoute()
const savedAnswers = ref(JSON.parse(localStorage.getItem('savedAnswers')) ?? [])
const token = ref(localStorage.getItem('token'))

async function handleSubmit() {
  try {
    const { data } = await axios.post(
      window.base_api_url + '/exam/do?schedule_id=' + route.params.id,
      savedAnswers.value.filter((data) => data.schedule == route.params.id),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.value
        }
      }
    )

    console.log(data)

    localStorage.setItem(
      'savedAnswer',
      JSON.stringify(savedAnswers.value.filter((data) => data.schedule != route.params.id))
    )

    router.replace({ name: 'finish' })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <main class="text-center w-full flex-col gap-5 flex p-5">
    <div class="flex flex-col gap-2">
      <h5 class="text-xl">Perhatian!</h5>
      <p>Apakah anda yakin ingin mengirimkan jawaban?</p>
    </div>
    <div class="flex gap-3 justify-center">
      <CustomButton text="TIDAK" type="danger" @click="router.back()" />
      <CustomButton text="YAKIN" type="success" @click="handleSubmit" />
    </div>
  </main>
</template>
