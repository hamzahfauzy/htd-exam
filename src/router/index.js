import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from '@/views/QuestionView.vue'
import FinishView from '@/views/FinishView.vue'
import ConfirmationView from '@/views/ConfirmationView.vue'
import ListQuestionsView from '@/views/ListQuestionsView.vue'
import LoginView from '@/views/LoginView.vue'
import ResultView from '@/views/ResultView.vue'

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
  defaultRoute: '/login',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/question/:id',
      name: 'question',
      component: QuestionView
    },
    {
      path: '/result/:id',
      name: 'result',
      component: ResultView
    },
    {
      path: '/confirmation/:id',
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

router.beforeEach(async (to) => {
  if (!localStorage.getItem('token') && to.name !== 'login') {
    return { name: 'login' }
  }

  if (localStorage.getItem('token') && to.name == 'login') {
    return { name: 'home' }
  }
})

export default router
