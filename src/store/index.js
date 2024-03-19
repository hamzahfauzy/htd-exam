import { reactive } from 'vue'

export const store = reactive({
  questions: [
    {
      id: 1,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'single',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 2,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'multiple',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 3,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'single',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 4,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'multiple',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 5,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'single',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 6,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'multiple',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 7,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'single',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    },
    {
      id: 8,
      title: 'Apakah ini ?',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt natus modi, minus doloreobcaecati sed laudantium nostrum ducimus atque? Aperiam?',
      type: 'multiple',
      selectedAnswer: [],
      answers: [
        {
          key: 'A',
          value: 'A'
        },
        {
          key: 'B',
          value: 'B'
        },
        {
          key: 'C',
          value: 'C'
        },
        {
          key: 'D',
          value: 'D'
        }
      ]
    }
  ],
  answer(question, answer) {
    this.questions = this.questions.map((q) =>
      q.id == question.id ? { ...q, selectedAnswer: [...q.selectedAnswer, answer] } : q
    )
  }
})
