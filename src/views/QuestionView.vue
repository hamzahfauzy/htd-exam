<script setup>
import CustomButton from '../components/CustomButton.vue'
import CustomModal from '../components/CustomModal.vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import CustomLoading from '@/components/CustomLoading.vue'

const route = useRoute()
const router = useRouter()
const token = ref(localStorage.getItem('token'))
const questions = ref()
const savedAnswers = ref(JSON.parse(localStorage.getItem('savedAnswers')) ?? [])
const loading = ref(true)
const timer = ref(0)
const schedule = ref()
const timerHours = ref('00')
const timerMinutes = ref('00')
const timerSeconds = ref('00')
const showModal = ref(false)
const user = ref()

onMounted(async () => {
  await getQuestions()
  await getUser()

  loading.value = false
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
      import.meta.env.VITE_API_URL + '/exam/timer',
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
  var x = setInterval(async function () {
    timer.value -= 1

    timerHours.value = Math.floor(timer.value / 3600)
    timerMinutes.value = Math.floor((timer.value / 60) % 60)
    timerSeconds.value = Math.floor(timer.value % 60)

    timerHours.value = timerHours.value < 10 ? '0' + timerHours.value : timerHours.value
    timerMinutes.value = timerMinutes.value < 10 ? '0' + timerMinutes.value : timerMinutes.value
    timerSeconds.value = timerSeconds.value < 10 ? '0' + timerSeconds.value : timerSeconds.value

    if (timer.value < 0) {
      clearInterval(x)
      await handleSubmitExam()
    }
  }, 1000)
}

async function getQuestions() {
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL + '/exam/do?schedule_id=' + route.params.id,
      {
        headers: {
          Authorization: 'Bearer ' + token.value
        }
      }
    )
    questions.value = data.data.schedule_user_data.data
    schedule.value = data.data.schedule
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

  localStorage.setItem('savedAnswers', JSON.stringify(savedAnswers.value))
}

function handleSubmit() {
  showModal.value = true
}

async function handleSubmitExam() {
  try {
    const formData = new FormData()

    savedAnswers.value.map((data) => {
      if (data.schedule == route.params.id) {
        formData.append(`answer[${data.question}]`, data.answer)
      }
    })

    await axios.post(
      import.meta.env.VITE_API_URL + '/exam/do?schedule_id=' + route.params.id,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.value
        }
      }
    )

    localStorage.setItem(
      'savedAnswers',
      JSON.stringify(
        savedAnswers.value.filter(
          (data) => data.schedule != route.params.id && data.user == user.value.username
        )
      )
    )

    router.replace({ name: 'finish' })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <CustomLoading v-if="loading" />
  <CustomModal v-else-if="!loading && showModal" class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Apakah anda yakin ingin mengirimkan jawaban?
    </h3>
    <div class="flex gap-3 justify-center">
      <CustomButton text="TIDAK" type="danger" @click="showModal = false" />
      <CustomButton text="YAKIN" type="success" @click="handleSubmitExam" />
    </div>
  </CustomModal>
  <main v-else-if="!loading && !showModal" class="w-full self-start">
    <div class="sticky top-0 bg-gray-100 py-3 flex gap-2 justify-center shadow-sm">
      <CustomButton text="KEMBALI" type="secondary" @click="router.replace({ name: 'home' })" />
      <CustomButton
        :text="timerHours + ':' + timerMinutes + ':' + timerSeconds"
        type="danger"
        :disabled="true"
      />
      <CustomButton text="KIRIM" @click="handleSubmit" />
    </div>
    <div class="flex-col gap-5 flex p-5">
      <div
        class="flex flex-col gap-2"
        v-for="(question, idx) in questions"
        :key="question.id"
        :id="'question-' + question.id"
      >
        <h5 class="text-md" v-html="idx + 1 + '. ' + question.description"></h5>

        <div v-if="question.answers.length < 1">
          <input
            :value="isSavedAnswer(question, null, true)?.answer"
            @input="(event) => answerQuestion(question, event.target.value, true)"
            placeholder="Masukkan Jawaban..."
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              :for="question.id + '-' + answer.id"
              class="ms-2 text-sm font-medium"
              v-html="answer.description"
            ></label>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
