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
        <label>
            <input type="checkbox" v-model="task.isChecked" v-on:change="sendTaskStatus">
        </label>
    </div>
    `,
    methods: {
        sendTaskStatus() {
            this.$emit('sendTaskStatus', this.task, this.index);
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
            type: String,
            required: true
        },
        tasks: {
            type: Array,
            required: true,
            min: 3,
            max: 5,
        },
    },
    template: `
        <div class="card">
            <p>{{ this.name }}</p>
            <div class="card-task">
                <task v-for="(task, index) in tasks" 
                        :task="task" :index="index"
                        @sendTaskStatus="sendTaskStatus"></task>
            </div>
        </div>
    `,
    methods: {
        sendTaskStatus(task, taskIndex) {
            eventBus.$emit('changeTaskStatus', this.index, task, taskIndex);
        }
    }
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
                    {
                        "description": "asdasd",
                        "isChecked": false,
                    },
                    {
                        "description": "asdasd",
                        "isChecked": false,
                    },
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
        cardsToColumn() {
            return this.columns.map((column, index) => {
                return this.cards.filter(card => card.columnNum === index)
            })
        }
    },
    mounted() {
        eventBus.$on('changeTaskStatus', function (cardIndex, task, taskIndex) {
            console.log("ага", task.isChecked, taskIndex);
        })
    }
})