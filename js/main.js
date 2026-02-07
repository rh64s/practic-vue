let eventBus = new Vue()

Vue.component('createTask', {
    data() {
        return {
            name: "",
            tasks: [],
            isDisabled: true
        }
    },
    template: `
<div>
    <button type="submit" class="button-create" v-on:click="changeVisibility">Создать карточку</button>
    <div class="modal" v-bind:class="{ isvisible: isDisabled }">
        <div class="modal-background" v-on:click="changeVisibility"></div>
        <form class="form-create-task" @submit.prevent="addCart">
            <div class="form-group">
                <label for="form-cart-name">Название</label>
                <input id="form-cart-name" type="text" v-model="name">
            </div>
            <button type="button" class="button-second" v-on:click="addTask">Добавить задание</button>
            <div class="form-group">
                <div class="form-task" v-for="(task, index) in tasks">
                    <label>Задание {{index}}</label>
                    <input type="text" v-model="tasks[index].description">
                </div>
            </div>
            
            <button type="submit" class="button-create" v-on:click="changeVisibility">Создать карточку</button>
        </form>
    </div>
</div>
    `,
    methods: {
        addCart() {
            console.log(this.name)
            console.log(this.tasks.length)
            this.$emit('add-cart', this.name, this.tasks);
            this.name = ""
            this.tasks = []
        },
        addTask() {
            this.tasks.push({
                "description": "пример слова",
                "isChecked": false,
            })
        },
        changeVisibility() {
            this.isDisabled = !this.isDisabled
        }
    },
})

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
            <p>{{ this.name }}, index = {{ this.index }}</p>
            <div class="card-task">
                <task v-for="(task, index) in tasks" 
                        :task="task" :index="index"
                        @sendTaskStatus="sendTaskStatus"></task>
            </div>
        </div>
    `,
    methods: {
        sendTaskStatus(task, taskIndex) {
            eventBus.$emit('changeTaskStatus', this.index, this.completedPercent);
        }
    },
    computed: {
        completedPercent() {
            let completedPercent = 0;
            for (task of this.tasks) {
                if (task.isChecked) {
                    completedPercent++;
                }
            }
            return (completedPercent / this.tasks.length) * 100;
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
            <card v-for="card in cards" :key="card.id" :index="card.id" :name="card.name" :tasks="card.tasks"></card>
        </div>
    `,
});

let app = new Vue({
    el: '#app',
    data: {
        nextId: 0, // следующий id (index в template) внутри объекта card при добавлении
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
        cards: [],
    },
    methods: {
        addCart(name, tasks) {
            let allCards = localStorage.getItem("cards") ? JSON.parse(localStorage.getItem("cards")) : [];
            this.cards.push({
                id: this.nextId++,
                name: name,
                tasks: tasks,
                columnNum: 0,
            })
        },
        
        checkCard(cardIndex, completedPercent) {
            console.log(cardIndex, completedPercent);
            this.cards[cardIndex].columnNum = Math.floor(completedPercent / 50);
        }
        
    },
    computed: {
        cardsToColumn() {
            return this.columns.map((column, index) => {
                return this.cards.filter(function (card) {
                    return card.columnNum === index;
                })
            })
        },
        cardsInStorage() {

        }
    },
    mounted() {
        this.cards = localStorage.getItem("cards") ? JSON.parse(localStorage.getItem("cards")) : [];
        let checkCard = this.checkCard.bind(this);
        eventBus.$on('changeTaskStatus', function (cardIndex, completedPercent) {
            checkCard(cardIndex, completedPercent);
        });
    },
})