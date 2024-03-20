<script setup>
import axios from 'axios'
import CustomButton from '../components/CustomButton.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CustomLoading from '@/components/CustomLoading.vue'
const currentDate = new Date()
const weekday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const month = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]
const token = ref(localStorage.getItem('token'))
const router = useRouter()
const schedule_status = ref('') //today upcoming overdue
const user = ref()
const schedules = ref()
const loading = ref(true)
const search = ref('')

onMounted(async () => {
  if (!token.value) {
    router.replace({ name: 'login' })
  }

  await getUser()
  await getSchedule()
  loading.value = false
})

watch(schedule_status, async () => {
  getSchedule()
})

async function getUser() {
  try {
    const { data } = await axios.get(import.meta.env.VITE_API_URL + '/auth/get-user', {
      headers: {
        Authorization: 'Bearer ' + token.value
      }
    })
    user.value = data.data
  } catch (e) {
    console.error(e)
  }
}

async function getSchedule() {
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL +
        '/crud/datatable?table=exam_schedules' +
        (schedule_status.value ? '&filter[schedule_status]=' + schedule_status.value : '') +
        (search.value ? '&search[value]=' + search.value : ''),
      {
        headers: {
          Authorization: 'Bearer ' + token.value
        }
      }
    )
    schedules.value = data.data
  } catch (e) {
    console.error(e)
  }
}

function filterSchedule(status) {
  schedule_status.value = status
}

function formatDate(date) {
  return `${weekday[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
}

function addZero(i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}

function formatTime(start_at, end_at) {
  const start = new Date(start_at)
  const end = new Date(end_at)

  return `${addZero(start.getHours())}:${addZero(start.getMinutes())} - ${addZero(end.getHours())}:${addZero(end.getMinutes())}`
}

function isStarted(start_at) {
  const start = new Date(start_at)
  return start <= currentDate
}

function isEnded(end_at) {
  const end = new Date(end_at)
  return end <= currentDate
}

function logout() {
  localStorage.removeItem('token')
  router.replace({ name: 'login' })
}
</script>

<template>
  <CustomLoading v-if="loading" />
  <main v-else class="text-center w-full flex-col gap-5 flex pt-5">
    <div>
      <h5 class="text-xl">Halo, {{ user.name }}</h5>
      <h3>{{ formatDate(currentDate) }}</h3>
    </div>

    <div class="flex gap-2 flex-wrap justify-center">
      <CustomButton
        text="All"
        :type="!schedule_status ? 'success' : 'secondary'"
        @click="filterSchedule()"
      />
      <CustomButton
        text="Today"
        :type="schedule_status == 'today' ? 'success' : 'secondary'"
        @click="filterSchedule('today')"
      />
      <CustomButton
        text="Upcoming"
        :type="schedule_status == 'upcoming' ? 'success' : 'secondary'"
        @click="filterSchedule('upcoming')"
      />
      <CustomButton
        text="Overdue"
        :type="schedule_status == 'overdue' ? 'success' : 'secondary'"
        @click="filterSchedule('overdue')"
      />
    </div>

    <div class="relative">
      <input
        v-model="search"
        type="search"
        id="default-search"
        class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search schedule..."
      />
      <button
        @click="getSchedule()"
        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
      >
        Search
      </button>
    </div>

    <div
      v-for="schedule in schedules"
      :key="schedule.id"
      class="flex flex-col gap-5 p-6 bg-white border border-gray-200 rounded-lg shadow"
    >
      <div>
        <h5 class="text-xl font-bold">{{ schedule.name }}</h5>
        <h3>{{ formatDate(new Date(schedule.start_at)) }}</h3>
        <h5 class="text-lg font-bold">{{ formatTime(schedule.start_at, schedule.end_at) }}</h5>
      </div>
      <div v-if="!isEnded(schedule.end_at)" class="flex flex-col gap-1">
        <CustomButton
          :text="isStarted(schedule.start_at) ? 'LANJUTKAN' : 'MULAI'"
          :type="isStarted(schedule.start_at) ? 'success' : 'primary'"
          @click="this.$router.push({ name: 'question' })"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <CustomButton text="KELUAR" type="danger" @click="logout()" />
    </div>
  </main>
</template>
