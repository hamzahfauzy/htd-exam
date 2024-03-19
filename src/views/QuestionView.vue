<script setup>
import CustomButton from '../components/CustomButton.vue'
import { store } from '@/store/index'
const questions = store.questions
</script>

<template>
  <main class="w-full">
    <div class="sticky top-0 bg-gray-100 py-2 flex justify-center">
      <CustomButton text="KEMBALI" type="secondary" @click="this.$router.back()" />
      <CustomButton text="60:00" type="danger" />
      <CustomButton
        text="LIST SOAL"
        type="warning"
        @click="this.$router.push({ name: 'list-question' })"
      />
      <CustomButton text="SELANJUTNYA" @click="this.$router.push({ name: 'confirmation' })" />
    </div>
    <div class="flex-col gap-5 flex">
      <div
        class="flex flex-col gap-2"
        v-for="(question, idx) in questions"
        :key="idx"
        :id="'question-' + question.id"
      >
        <h5 class="text-xl">{{ idx + 1 }}. {{ question.title }}</h5>
        <p class="text-justify">
          {{ question.description }}
        </p>

        <div v-if="question.type == 'single'" class="flex flex-col gap-1">
          <div v-for="(answer, id) in question.answers" :key="id" class="flex items-center">
            <input
              :id="question.id + '-' + answer.key"
              type="radio"
              :value="answer.value"
              :name="question.id"
              @input="store.answer(question, answer)"
              :checked="question.selectedAnswer.includes(answer)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label :for="question.id + '-' + answer.key" class="ms-2 text-sm font-medium">{{
              answer.value
            }}</label>
          </div>
        </div>

        <div v-else-if="question.type == 'multiple'" class="flex flex-col gap-1">
          <div v-for="(answer, id) in question.answers" :key="id" class="flex items-center">
            <input
              :id="question.id + '-' + answer.key"
              type="checkbox"
              :value="answer.value"
              :name="question.id + '[]'"
              @input="store.answer(question, answer)"
              :checked="question.selectedAnswer.includes(answer)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label :for="question.id + '-' + answer.key" class="ms-2 text-sm font-medium">{{
              answer.value
            }}</label>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
