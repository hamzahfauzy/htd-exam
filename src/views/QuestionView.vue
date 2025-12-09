<script setup>
import CustomButton from '../components/CustomButton.vue'
import CustomModal from '../components/CustomModal.vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import CustomLoading from '@/components/CustomLoading.vue'
import Camera from 'simple-vue-camera'

const route = useRoute()
const router = useRouter()
const token = ref(localStorage.getItem('token'))
const questions = ref()
let lastWindowState = document.visibilityState;
let idleTimer;
let idleLimit = 60000; // 1 menit
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;
const isSent = ref(false)
const errMsg = ref('')
const localStorageKey = 'savedAnswers_' + route.params.id
const localStorageLogs = 'userLogs_' + route.params.id
const localStoragePendingLogs = 'userPendingLogs_' + route.params.id
const savedAnswers = ref(JSON.parse(localStorage.getItem(localStorageKey)) ?? [])
const userLogs = ref(JSON.parse(localStorage.getItem(localStorageLogs)) ?? [])
const userPendingLogs = ref(JSON.parse(localStorage.getItem(localStoragePendingLogs)) ?? [])
const loading = ref(true)
const timer = ref(0)
const schedule = ref()
const timerHours = ref('00')
const timerMinutes = ref('00')
const timerSeconds = ref('00')
const showModal = ref(false)
const showModalLog = ref(false)
const showModalCamera = ref(false)
const showModalImage = ref(false)
const showModalOutofTime = ref(false)
const initModal = ref(false)
const user = ref()
const isDisabled = ref(false)
const selectedItem = ref()
const camera = ref()
const camStarted = ref(false)
const isOnline = ref(false)

const loadingCamera = () => console.log('Camera is loading and will start any second')
const started = () => (camStarted.value = true)
const stopped = () => (camStarted.value = false)
const paused = () => (camStarted.value = false)
const resumed = () => (camStarted.value = true)
const error = () => (camStarted.value = false)
const cameraChange = () => console.log('Camera Changed')

onMounted(async () => {
  const schedule = route.params.id
  if(localStorage.getItem('schedule_'+schedule))
  {
    router.replace({ name: 'home' })
  }

  localStorage.setItem('status_schedule_'+schedule, 'start')

  await getQuestions()
  await getUser()

  const thisLoading = loading
  Promise.all(Array.from(document.images).map(img => {
      if (img.complete)
          if (img.naturalHeight !== 0)
              return Promise.resolve();
          else
              return Promise.reject(img);
      return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', () => reject(img));
      });
  })).then(() => {
      console.log('all images loaded successfully');
      loading.value = false
      isOnline.value = navigator.onLine

      const schedule = route.params.id
      const isFinish = localStorage.getItem('status_schedule_'+schedule)

      if(isFinish != 'finish')
      {
        saveActivity("sesi_ujian", "Peserta masuk ke halaman ujian");
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        // tab keluar
        window.addEventListener("blur", () => {
            saveActivity("tab_blur", "Peserta keluar dari halaman ujian");
        });

        // tab fokus kembali
        window.addEventListener("focus", () => {
            saveActivity("tab_focus", "Peserta kembali ke halaman ujian");
        });

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            saveActivity("minimize_or_switch", "Tampilan browser disembunyikan / minimize / switch tab");
          } else {
            saveActivity("visible", "Browser kembali terlihat");
          }
        });

        // deteksi close
        window.addEventListener("beforeunload", () => {
          saveActivity("exit_attempt", "Peserta mencoba meninggalkan halaman ujian (close/refresh/back)");
        });

        window.addEventListener("resize", () => {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;

          if (Math.abs(newWidth - lastWidth) > 200) {
              saveActivity("window_resize", "Ukuran window berubah (kemungkinan pindah monitor)");
          }

          // deteksi perubahan tinggi drastis (ganti monitor vertikal, taskbar dibuka, atau window snap)
          if (Math.abs(newHeight - lastHeight) > 150) {
              saveActivity("window_resize", "Tinggi window berubah (kemungkinan pindah monitor / resize vertikal)");
          }


          lastWidth = newWidth;
        });

        window.onload = resetIdle;

        document.onmousemove = resetIdle;
        document.onkeypress = resetIdle;
        document.onscroll = resetIdle;
        document.onclick = resetIdle;

        startAutoSync()
      }

      

      // document.addEventListener('blur',e=>{
      //   // alert('Tab Changed Blur')
      //   // locked this session
      //   locked()
      // })
      // document.addEventListener('visibilitychange',e=>{
      //   // alert('Tab Changed Visibility Change')
      //   // locked this session
      //   locked()
      // })

      window.addEventListener('beforeunload', function (e) {
        if(route.matched.some(({ path }) => path.startsWith('/question'))){
            //handle redirect
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = '';
        }
      });
  }, badImg => {
      console.log('some image failed to load, others may still be loading');
      console.log('first broken image:', badImg);
  });

  
})

function locked()
{
  const schedule = route.params.id
  if(schedule)
  {
    localStorage.setItem('schedule_'+schedule, 1)
    router.replace({ name: 'home' })
  }
}

function updateStatus() {
  isOnline.value = navigator.onLine
  initModal.value = !initModal.value
  saveActivity("network_update", navigator.online ? 'Aplikasi Online' : 'Aplikasi Offline')
  // const schedule = route.params.id
  const isFinish = localStorage.getItem('status_schedule_'+schedule)
  // if(route.matched.some(({ path }) => path.startsWith('/question'))){
  //   if (isOnline.value && isFinish != 'finish') {
  //     locked()
  //   } else {
  //     initModal.value = false
  //   }
  // }
}

const startCam = (question) => {
  selectedItem.value = question
  camera.value.start()
  showModalCamera.value = true
}

const stopCam = () => {
  camera.value.stop()
  showModalCamera.value = false
}

const loadImage = (question) => {
  selectedItem.value = question
  showModalImage.value = true
}

const removeImage = (question) => {
  const foundIndex = savedAnswers.value.findIndex(
    (data) =>
      data.question == question.id &&
      data.schedule == route.params.id &&
      data.user == user.value.username
  )

  if (foundIndex > -1) {
    savedAnswers.value[foundIndex] = {
      ...savedAnswers.value[foundIndex],
      image: null
    }
  }

  showModalImage.value = false

  localStorage.setItem(localStorageKey, JSON.stringify(savedAnswers.value))
}

const snapshot = async () => {
  const blob = await camera.value?.snapshot()
  var reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = function () {
    let base64String = reader.result
    const foundIndex = savedAnswers.value.findIndex(
      (data) =>
        data.question == selectedItem.value.id &&
        data.schedule == route.params.id &&
        data.user == user.value.username
    )

    if (foundIndex > -1) {
      savedAnswers.value[foundIndex] = {
        ...savedAnswers.value[foundIndex],
        image: base64String
      }
    } else {
      savedAnswers.value.push({
        user: user.value.username,
        schedule: route.params.id,
        question: selectedItem.value.id,
        answer: '',
        image: base64String
      })
    }

    localStorage.setItem(localStorageKey, JSON.stringify(savedAnswers.value))

    stopCam()
  }
}

async function getUser() {
  try {
    const { data } = await axios.get(window.base_api_url + '/auth/get-user', {
      headers: {
        Authorization: 'Bearer ' + token.value
      }
    })
    user.value = data.data
  } catch (e) {
    console.error(e)
  }
}

function isSavedAnswer(question, answer, isEssay = false) {
  return isEssay
    ? savedAnswers.value.find(
        (data) =>
          data.question == question.id &&
          data.schedule == route.params.id &&
          data.user == user.value.username
      )
    : savedAnswers.value.findIndex(
        (data) =>
          data.question == question.id &&
          data.answer == answer.id &&
          data.schedule == route.params.id &&
          data.user == user.value.username
      ) > -1
}

async function postTimer() {
  try {
    const { data } = await axios.post(
      window.base_api_url + '/exam/timer',
      {
        end: schedule.value.end_at
      },
      {
        headers: {
          Authorization: 'Bearer ' + token.value,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    timer.value = parseInt(data.data.timer)
    runTimer()
  } catch (e) {
    console.error(e)
  }
}

function runTimer() {
  console.log('timer running')
  var x = setInterval(async function () {
    timer.value -= 1

    timerHours.value = Math.floor(timer.value / 3600)
    timerMinutes.value = Math.floor((timer.value / 60) % 60)
    timerSeconds.value = Math.floor(timer.value % 60)

    timerHours.value = timerHours.value < 10 ? '0' + timerHours.value : timerHours.value
    timerMinutes.value = timerMinutes.value < 10 ? '0' + timerMinutes.value : timerMinutes.value
    timerSeconds.value = timerSeconds.value < 10 ? '0' + timerSeconds.value : timerSeconds.value

    if (timer.value <= 0) {
      clearInterval(x)
      disabledAllInput()
      showModalOutofTime.value = true
      // await handleSubmitExam()
    }
  }, 1000)
}

async function getQuestions() {
  try {
    // window.base_api_url.replace('/api','') + '/json/'+window.app_code+'/' + route.params.id + '-' + user.value.id + '.json'
    const { data } = await axios.get(
      window.base_api_url + '/exam/do?schedule_id=' + route.params.id,
      {
        headers: {
          Authorization: 'Bearer ' + token.value
        }
      }
    )
    questions.value = data.data.schedule_user_data.data
    schedule.value = data.data.schedule
    if (data.data.is_finished) {
      disabledAllInput()
    } else {
    }
    await postTimer()
  } catch (e) {
    router.replace({ name: 'home' })
  }
}

function answerQuestion(question, answer, isEssay = false) {
  const foundIndex = savedAnswers.value.findIndex(
    (data) =>
      data.question == question.id &&
      data.schedule == route.params.id &&
      data.user == user.value.username
  )

  if (foundIndex > -1) {
    savedAnswers.value[foundIndex] = {
      ...savedAnswers.value[foundIndex],
      answer: isEssay ? answer : answer.id
    }
  } else {
    savedAnswers.value.push({
      user: user.value.username,
      schedule: route.params.id,
      question: question.id,
      answer: isEssay ? answer : answer.id
    })
  }

  localStorage.setItem(localStorageKey, JSON.stringify(savedAnswers.value))
}

function handleSubmit() {
  const schedule = route.params.id
  // localStorage.setItem('schedule_'+schedule, 1)
  localStorage.setItem('status_schedule_'+schedule, 'finish')
  showModal.value = true
}

async function handleSubmitExam() {
  isSent.value = true
  try {
    saveActivity('sesi_ujian', 'Peserta mengirim jawaban')
    await syncLogs()
    const formData = new FormData()

    savedAnswers.value.map((data) => {
      if (data.schedule == route.params.id) {
        formData.append(
          `answer[${data.question}]`,
          data.image ? `<img src="${data.image}">` : data.answer
        )
      }
    })

    errMsg.value = formData.values()

    await axios.post(
      window.base_api_url + '/exam/do?schedule_id=' + route.params.id,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.value
        }
      }
    )

    localStorage.setItem(
      localStorageKey,
      JSON.stringify(
        savedAnswers.value.filter(
          (data) => data.schedule != route.params.id && data.user == user.value.username
        )
      )
    )
    
    localStorage.removeItem(localStorageLogs)
    localStorage.removeItem(localStoragePendingLogs)

    router.replace({ name: 'finish' })
  } catch (e) {
    console.error(e)
    isSent.value = false
    errMsg.value = e
  }
}

function disabledAllInput() {
  isDisabled.value = true
}

function toTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function saveActivity(type, message) {
  const time = new Date().toISOString()
  const dataLog = {
      type,
      message,
      time: formatTime(time)
  }
  userLogs.value.push(dataLog);
  userPendingLogs.value.push(dataLog)

  localStorage.setItem(localStorageLogs, JSON.stringify(userLogs.value));
  localStorage.setItem(localStoragePendingLogs, JSON.stringify(userPendingLogs.value));
    
}

function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
      saveActivity("idle", "Peserta tidak aktif selama 1 menit (AFK)");
  }, idleLimit);
}

function formatTime(time) {
  return new Date(time).toLocaleString();
}

function backToHome()
{
  saveActivity('sesi_ujian', 'Peserta meninggalkan halaman ujian')
  router.replace({ name: 'home' })
}

async function syncLogs() {
    if (userPendingLogs.value.length === 0) return;

    const formData = new FormData()
    formData.append(`logs`,JSON.stringify(userPendingLogs.value))

    await axios.post(
      window.base_api_url + '/exam/log?schedule_id=' + route.params.id,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.value
        }
      }
    )

    userPendingLogs.value = []
    localStorage.setItem(localStoragePendingLogs, JSON.stringify(userPendingLogs.value));


    // await fetch("/logs", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(userPendingLogs.value)
    // });

    // pindahkan pending → archived
    
}

function startAutoSync() {
  const schedule = route.params.id
  const isFinish = localStorage.getItem('status_schedule_'+schedule)
  if(route.matched.some(({ path }) => path.startsWith('/question')) && isFinish != 'finish'){
    const randomInterval = Math.floor(Math.random() * (30000 - 15000)) + 15000;
    setInterval(syncLogs, randomInterval);
  }
}
</script>

<template>
  <CustomModal v-if="showModalLog">
    <div class="backdrop" style="position: fixed;top: 0;left: 0;height: 100%;background: rgb(243,244,246);width: 100%;"></div>
    <div class="relative" style="margin-top: 50px;overflow-y: auto;height: calc(100vh - 130px);">
      <div v-for="(log, index) in userLogs" :key="index" class="log-item" style="margin-bottom: 15px;">
        <strong>{{ log.type }}</strong> -   
        <small>{{ log.time }}</small>
        <p>{{ log.message }}</p>
      </div>
    </div>
  </CustomModal>
  <CustomModal v-if="false">
    <div class="backdrop" style="position: fixed;top: 0;left: 0;height: 100%;background: rgb(243,244,246);width: 100%;"></div>
    <div class="flex flex-col gap-4" style="position:relative">
      <div class="flex flex-col gap-2 text-center">
        <h5 class="text-xl">Harap matikan seluruh koneksi internet.</h5>
        <h6>Tampilan ini akan hilang setelah perangkat kamu tidak terkoneksi internet.</h6>
      </div>
    </div>
  </CustomModal>
  <CustomModal v-if="showModalOutofTime && !loading">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2 text-center">
        <h5 class="text-xl">Waktu ujian telah habis!</h5>
        <h6>Klik OK untuk mengirim Jawaban</h6>
      </div>
      <div class="flex gap-3 justify-center">
        <CustomButton :text="isSent ? 'OK' : 'SEDANG MENGIRIM...'" type="success" @click="handleSubmitExam" />
      </div>
    </div>
  </CustomModal>
  <CustomModal v-if="showModalImage && !loading">
    <div class="flex flex-col gap-4">
      <img :src="isSavedAnswer(selectedItem, null, true)?.image" />
      <div class="flex gap-3 justify-center">
        <CustomButton text="Tutup" type="secondary" @click="showModalImage = false" />
        <CustomButton text="Hapus Gambar" type="danger" @click="removeImage(selectedItem)" />
      </div>
    </div>
  </CustomModal>
  <CustomModal v-show="showModalCamera">
    <div class="flex flex-col gap-4">
      <Camera
        :resolution="{ width: 375, height: 500 }"
        ref="camera"
        :autoplay="false"
        @loading="loadingCamera"
        @started="started"
        @stopped="stopped"
        @paused="paused"
        @resumed="resumed"
        @camera-change="cameraChange"
        @error="error"
      >
        <div
          v-if="camStarted"
          class="absolute left-1/2 transform -translate-x-1/2 bottom-5 flex gap-3"
        >
          <CustomButton text="Ambil Gambar" type="success" @click="snapshot" />
          <CustomButton text="Ganti Camera" @click="camera.changeCamera()" />
          <CustomButton text="Tutup Camera" type="danger" @click="stopCam" />
        </div>
      </Camera>
    </div>
  </CustomModal>
  <CustomLoading v-if="loading" />
  <CustomModal v-else-if="!loading && showModal" class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      <!-- Apakah anda yakin ingin mengirimkan jawaban? -->
      Harap aktifkan koneksi internet sebelum mengirimkan Jawaban.
    </h3>
    <span>{{ errMsg }}</span>
    <div class="flex gap-3 justify-center">
      <!-- <CustomButton text="TIDAK" type="danger" @click="showModal = false" /> -->
      <CustomButton :text="!isSent ? 'KIRIM JAWABAN' : 'SEDANG MENGIRIM...'" type="success" @click="handleSubmitExam" v-if="isOnline" />
    </div>
  </CustomModal>
  <main
    v-else-if="!loading && !showModal && !showModalCamera && !showModalImage && !showModalOutofTime"
    class="w-full self-start"
  >
    <div class="sticky top-0 bg-white py-3 flex gap-2 justify-center shadow-sm">
      <CustomButton text="<" type="secondary" @click="backToHome()" v-if="isOnline" />
      <CustomButton text="LOG" @click="showModalLog = !showModalLog" type="secondary" />
      <CustomButton
        :text="timerHours + ':' + timerMinutes + ':' + timerSeconds"
        type="danger"
        :disabled="true"
      />
      <CustomButton text="KIRIM" @click="handleSubmit" />
      <CustomButton text="<img src='https://smkn1pr.queez.id/storage/1744681538-arrow-up-svgrepo-com.svg' width='20px' height='20px'>" type="secondary" @click="toTop()" />
    </div>
    <div class="flex-col gap-5 flex p-5">
      <div
        class="flex flex-col gap-2"
        v-for="(question, idx) in questions"
        :key="question.id"
        :id="'question-' + question.id"
      >
        <h5 class="text-md font-medium" v-html="+ (idx + 1) + '. Soal No. '+ (idx + 1)"></h5>
        <p v-html="question.description"></p>

        <div v-if="question.answers.length < 1" class="flex flex-col gap-3">
          <textarea
            v-if="!isSavedAnswer(question, null, true)?.image"
            @input="(event) => answerQuestion(question, event.target.value, true)"
            placeholder="Masukkan Jawaban..."
            :disabled="isDisabled"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >{{ isSavedAnswer(question, null, true)?.answer }}</textarea>

          <CustomButton
            v-if="!isSavedAnswer(question, null, true)?.answer"
            text="Ambil Gambar"
            @click="startCam(question)"
          />
          <CustomButton
            v-if="
              !isSavedAnswer(question, null, true)?.answer &&
              isSavedAnswer(question, null, true)?.image
            "
            type="success"
            text="Lihat Gambar"
            @click="loadImage(question)"
          />
          <CustomButton
            v-if="
              !isSavedAnswer(question, null, true)?.answer &&
              isSavedAnswer(question, null, true)?.image
            "
            type="danger"
            text="Hapus Gambar"
            @click="removeImage(question)"
          />
        </div>
        <div v-else class="flex flex-col gap-1">
          <div v-for="answer in question.answers" :key="answer.id" class="flex items-center">
            <input
              :id="question.id + '-' + answer.id"
              type="radio"
              :value="answer.id"
              :name="question.id"
              @input="answerQuestion(question, answer)"
              :checked="isSavedAnswer(question, answer)"
              :disabled="isDisabled"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              :for="question.id + '-' + answer.id"
              class="ms-2 text-sm"
              v-html="answer.description"
            ></label>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
