<script setup>
import CustomButton from '../components/CustomButton.vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import CustomLoading from '@/components/CustomLoading.vue'

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

async function getResult() {
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL + '/exam/result?id=' + route.params.id,
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
    router.back()
  }
}

function findAnswer(id) {
  return answers.value[id]
}
</script>

<template>
  <CustomLoading v-if="loading" />
  <main v-else class="w-full">
    <div class="sticky top-0 bg-gray-100 py-3 flex gap-2 justify-center shadow-sm">
      <CustomButton text="KEMBALI" type="secondary" @click="router.back()" />
      <CustomButton
        :text="'SCORE : ' + totalScore + '/' + questions.length"
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
        <h5 class="text-md" v-html="idx + 1 + '. ' + question.description"></h5>

        <div class="flex flex-col gap-1">
          <div class="flex flex-col gap-1">
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
                  'ms-2 text-sm font-medium',
                  findAnswer(question.id).answer_id == answer.id &&
                  findAnswer(question.id).score == 1
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
    </div>
  </main>
</template>
