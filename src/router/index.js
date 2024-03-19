import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InstructionView from '@/views/InstructionView.vue'
import QuestionView from '@/views/QuestionView.vue'
import FinishView from '@/views/FinishView.vue'
import ConfirmationView from '@/views/ConfirmationView.vue'
import ListQuestionsView from '@/views/ListQuestionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 100,
        behavior: 'smooth'
      }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: InstructionView
    },
    {
      path: '/question',
      name: 'question',
      component: QuestionView
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: ConfirmationView
    },
    {
      path: '/finish',
      name: 'finish',
      component: FinishView
    },
    {
      path: '/list-question',
      name: 'list-question',
      component: ListQuestionsView
    }
  ]
})

export default router
