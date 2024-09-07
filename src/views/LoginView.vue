<script setup>
import { ref } from 'vue'
import CustomButton from '../components/CustomButton.vue'
import CustomAlert from '../components/CustomAlert.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const app_code = ref('')
const password = ref('')
const message = ref('')
const status = ref(false)
const isSubmited = ref(false)
const router = useRouter()

async function login() {
  try {
    window.base_api_url = window.base_api_url.replace('{app_code}', app_code.value)
    const { data } = await axios.post(
      window.base_api_url + '/auth/login',
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
    localStorage.setItem('app_code', app_code.value)
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
  <form class="w-full flex-col gap-4 flex p-5">
    <img src="https://queez.id/wp-content/uploads/2024/04/cropped-queezid-high-resolution-logo-transparent-1.png" alt="" width="150" class="mx-auto" />
    <h3 class="text-xl text-center font-bold">QUEEZ.ID the easiest exam platform</h3>
    <CustomAlert v-if="isSubmited" :text="message" :type="status ? 'success' : 'danger'" />
    <div>
      <label for="app_code" class="block mb-2 text-sm font-medium">Kode Aplikasi</label>
      <input
        v-model="app_code"
        type="text"
        id="app_code"
        name="app_code"
        placeholder="Masukkan kode aplikasi..."
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
    <div>
      <label for="username" class="block mb-2 text-sm font-medium">Nama Pengguna</label>
      <input
        v-model="username"
        type="text"
        id="username"
        name="username"
        placeholder="Masukkan nama pengguna..."
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
    <div>
      <label for="password" class="block mb-2 text-sm font-medium">Kata Sandi</label>
      <input
        v-model="password"
        type="password"
        id="password"
        name="password"
        placeholder="Masukkan kata sandi..."
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
    <CustomButton text="MASUK" @click="login()" />
  </form>
</template>
