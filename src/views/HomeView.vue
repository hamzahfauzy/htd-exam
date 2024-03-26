<script setup>
import axios from 'axios'
import CustomButton from '../components/CustomButton.vue'
import CustomModal from '../components/CustomModal.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CustomLoading from '@/components/CustomLoading.vue'
import CustomAlert from '@/components/CustomAlert.vue'
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
const schedule_status = ref('today') //today upcoming overdue
const user = ref()
const schedules = ref()
const loading = ref(true)
const search = ref('')
const showModalScheduleToken = ref(false)
const selectedSchedule = ref()
const scheduleToken = ref('')
const isScheduleTokenValid = ref(false)
const isScheduleTokenSubmitted = ref(false)

onMounted(async () => {
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

function getButtonTypeAction(label) {
  switch (label) {
    case 'Kerjakan':
      return 'primary'
    case 'Hasil':
      return 'success'

    default:
      return 'secondary'
  }
}

function routeButtonAction(schedule, label) {
  switch (label) {
    case 'Kerjakan':
      selectedSchedule.value = schedule
      showModalScheduleToken.value = true
      break
    case 'Hasil':
      router.push({ name: 'result', params: { id: schedule.id } })
      break
    default:
      break
  }
}

function logout() {
  localStorage.removeItem('token')
  router.replace({ name: 'login' })
}

function closeModalScheduleToken() {
  isScheduleTokenSubmitted.value = false
  isScheduleTokenValid.value = false
  selectedSchedule.value = null
  scheduleToken.value = ''
  showModalScheduleToken.value = false
}

function handleSubmitScheduleToken() {
  if (selectedSchedule.value.token === scheduleToken.value) {
    isScheduleTokenSubmitted.value = true
    isScheduleTokenValid.value = true
    router.push({ name: 'question', params: { id: selectedSchedule.value.id } })
  } else {
    isScheduleTokenSubmitted.value = true
    isScheduleTokenValid.value = false
  }
}
</script>

<template>
  <CustomLoading v-if="loading" />
  <CustomModal v-else-if="!loading && showModalScheduleToken">
    <div class="flex flex-col gap-4">
      <CustomAlert
        v-if="isScheduleTokenSubmitted && !isScheduleTokenValid"
        text="Token yang anda masukkan tidak sesuai!"
        type="danger"
      />
      <div>
        <label for="token" class="block mb-2 text-sm font-medium">Masukkan Token</label>
        <input
          v-model="scheduleToken"
          type="token"
          id="token"
          name="token"
          placeholder="Masukkan Token..."
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div class="flex gap-3 justify-end">
        <CustomButton text="KEMBALI" type="danger" @click="closeModalScheduleToken" />
        <CustomButton text="SUBMIT" @click="handleSubmitScheduleToken" />
      </div>
    </div>
  </CustomModal>
  <main
    v-else-if="!loading && !showModalScheduleToken"
    class="text-center w-full flex-col gap-5 flex p-5 self-start"
  >
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
      <div class="flex flex-col gap-1">
        <CustomButton
          v-for="(action, index) in schedule.actions"
          :key="index"
          :text="action.label"
          :disabled="!action.route"
          :type="getButtonTypeAction(action.label)"
          @click="routeButtonAction(schedule, action.label)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <CustomButton text="KELUAR" type="danger" @click="logout()" />
    </div>
  </main>
</template>
