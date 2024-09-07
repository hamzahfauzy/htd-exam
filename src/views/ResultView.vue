<script setup>
import CustomButton from '../components/CustomButton.vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import CustomLoading from '@/components/CustomLoading.vue'
import he from 'he/he';

const route = useRoute()
const router = useRouter()
const token = ref(localStorage.getItem('token'))
const questions = ref()
const answers = ref()
const loading = ref(true)
const totalScore = ref(0)

onMounted(async () => {
  await getResult()

  loading.value = false
})

function decode (value) {
  let decoded = value
  if(value){ decoded = he.decode(value) }
  return decoded 
}

async function getResult() {
  try {
    const { data } = await axios.get(
      window.base_api_url + '/exam/result?id=' + route.params.id,
      {
        headers: {
          Authorization: 'Bearer ' + token.value
        }
      }
    )
    questions.value = data.data.schedule_user_data.data
    answers.value = data.data.normalizeAnswers
    totalScore.value = data.data.totalScore
  } catch (e) {
    router.replace({ name: 'home' })
  }
}

function findAnswer(id) {
  return answers.value[id]
}

function numberFormat(number)
{
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(
    number
  )
}
</script>

<template>
  <CustomLoading v-if="loading" />
  <main v-else class="w-full self-start">
    <div class="sticky top-0 bg-gray-100 py-3 flex gap-2 justify-center shadow-sm">
      <CustomButton text="KEMBALI" type="secondary" @click="router.replace({ name: 'home' })" />
      <CustomButton
        :text="`SCORE : ${totalScore}/${questions.length} (${numberFormat((totalScore / questions.length) * 100)})`"
        type="primary"
        :disabled="true"
      />
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

        <div v-if="question.answers.length < 1" class="flex flex-col gap-2 items-start">
          <p :class="['text-sm font-medium']" v-html="decode(findAnswer(question.id).answer_id)"></p>
          <span
            v-if="findAnswer(question.id).score != null"
            :class="[
              'text-xs font-medium px-2.5 py-0.5 rounded border',
              findAnswer(question.id).score > 0
                ? 'bg-green-100 text-green-800 border-green-800 '
                : 'bg-red-100 text-red-800 border-red-800 '
            ]"
            >Score : {{ findAnswer(question.id).score }}</span
          >
        </div>
        <div v-else class="flex flex-col gap-1">
          <div v-for="answer in question.answers" :key="answer.id" class="flex items-center">
            <input
              :id="question.id + '-' + answer.id"
              type="radio"
              :value="answer.id"
              :name="question.id"
              :checked="findAnswer(question.id).answer_id == answer.id"
              :disabled="findAnswer(question.id).answer_id != answer.id"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              :for="question.id + '-' + answer.id"
              :class="[
                'ms-2 text-sm',
                findAnswer(question.id).answer_id == answer.id && findAnswer(question.id).score == 1
                  ? 'text-green-700'
                  : findAnswer(question.id).answer_id == answer.id &&
                      findAnswer(question.id).score == 0
                    ? 'text-red-700'
                    : ''
              ]"
              v-html="answer.description"
            ></label>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
