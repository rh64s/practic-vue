let eventBus = new Vue()
Vue.component('task', {
    props: {
        task: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
    },
    template: `
    <div class="task">
        <p>{{ task.description }}</p>
    </div>
    `,
    methods: {
        changeTask() {
            eventBus.$emit('changeTask', this.task, this.index);
        },
    },
})

Vue.component('card', {
    props: {
        index: {
            type: Number,
            required: true
        },
        name: {
            String,
            required: true
        },
        tasks: {
            Array,
            required: true
        },
    },
    template: `
        <div class="card">
            <p>{{ this.name }}</p>
            <div class="card-task">
                <task v-for="(task, index) in tasks" 
                        :task="task" :index="index"></task>
            </div>
        </div>
    `,
})

Vue.component('column', {
    props: {
        name: {
            type: String,
            required: true
        },
        max: {
            type: Number,
            required: false,
            default: 0
        },
        cards: {
            type: Array,
            required: true,
            default: []
        },
    },
    template: `
        <div class="column">
            <p class="column-title">{{ this.name }}</p>
            <card v-for="(card, index) in cards" :index="index" :name="card.name" :tasks="card.tasks"></card>
        </div>
    `,
});

let app = new Vue({
    el: '#app',
    data: {
        columns: [
            {
                max: 3,
                name: "Первый столбец",
            },
            {
                max: 5,
                name: "Второй столбец",
            },
            {
                max: 0,
                name: "Третий столбец",
            },
        ],
        cards: [
            {
                name: "Card",
                tasks: [
                    {
                        "description": "asdasd",
                        "isChecked": false,
                    },
                ],
                columnNum: 0,
            },
        ],
    },
    methods: {
        addCart() {
            cards.push({
                name: "Card",
                tasks: [
                    {
                        "description": "asdasd",
                        "isChecked": false,
                    }
                ],
            })
        }
    },
    computed: {
        cards() {
            return this.columns.map((column, index) => {
                return this.cards.filter(card => card.columnNum === index)
            })
        }
    },
})