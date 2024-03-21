<script setup>
import { ref } from 'vue'
import CustomButton from '../components/CustomButton.vue'
import CustomAlert from '../components/CustomAlert.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const message = ref('')
const status = ref(false)
const isSubmited = ref(false)
const router = useRouter()

async function login() {
  try {
    const { data } = await axios.post(
      import.meta.env.VITE_API_URL + '/auth/login',
      {
        username: username.value,
        password: password.value
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    message.value = data.message
    status.value = true
    localStorage.setItem('token', data.data.token)
    router.replace({ name: 'home' })
  } catch (error) {
    console.log(error)
    message.value = error.response.data.message
    status.value = false
  }

  isSubmited.value = true
}
</script>

<template>
  <form class="w-full flex-col gap-4 flex">
    <h3 class="text-xl text-center font-bold">HTD Exam</h3>
    <CustomAlert v-if="isSubmited" :text="message" :type="status ? 'success' : 'danger'" />
    <div>
      <label for="username" class="block mb-2 text-sm font-medium">Username</label>
      <input
        v-model="username"
        type="text"
        id="username"
        name="username"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
    <div>
      <label for="password" class="block mb-2 text-sm font-medium">Password</label>
      <input
        v-model="password"
        type="password"
        id="password"
        name="password"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
    <CustomButton text="LOGIN" @click="login()" />
  </form>
</template>
