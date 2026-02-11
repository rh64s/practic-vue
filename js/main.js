let eventBus = new Vue()

Vue.component('createTask', {
    data() {
        return {
            name: "",
            tasks: [],
            isDisabled: true,
            errors: [
            ]
        }
    },
    props: {
        isLocked: {
            type: Boolean,
        }
    },
    template: `
<div>
    <button type="submit" class="button-create"  v-bind:class="{buttonLocked: isLocked}" v-on:click="changeVisibility">Создать карточку</button>
    <div class="modal" v-bind:class="{ isvisible: isDisabled }">
        <div class="modal-background" v-on:click="changeVisibility"></div>
        <form v-if="isLocked === false" class="form-create-task" @submit.prevent="addCart">
            <div class="form-group">
                <label for="form-cart-name">Название</label>
                <input id="form-cart-name" type="text" v-model="name" placeholder="Введите название">
            </div>
            <button type="button" class="button-second" v-on:click="addTask">Добавить задание</button>
            <div class="form-group">
                <div class="form-task" v-for="(task, index) in tasks">
                    <label>Задание {{index+1}}</label>
                    <input type="text" v-model="tasks[index].description" placeholder="Введите описание задачи">
                </div>
            </div>
            <div class="form-error" v-for="textError in errors">
                <p>{{textError}}</p>
            </div>
            <button type="submit" class="button-create">Создать карточку</button>
        </form>
        <div v-else class="form-create-task">
            <p>Вы не можете добавить больше 3 карточек</p>
        </div>
    </div>
</div>
    `,
    methods: {
        addCart() {
            this.errors = [];
            let hasEmptyTask = false
            for (let task of this.tasks) {
                if (!task.description) {
                    hasEmptyTask = true
                }
            }
            if(this.name && (this.tasks.length >= 3 && this.tasks.length <= 5) && !hasEmptyTask) {
                this.$emit('add-cart', this.name, this.tasks);
                this.name = ""
                this.tasks = []
                this.isDisabled = true;
                return
            }
            if(hasEmptyTask) {
                this.errors.push("В задаче должен быть текст!")
            }
            if(!(this.tasks.length >= 3 && this.tasks.length <= 5)){
                this.errors.push("Количество задач должно быть от 3 до 5 (включительно)!")
            }
            if(!this.name) {
                this.errors.push("Введите название карточки")
            }
        },
        addTask() {
            if(this.tasks.length === 5){
                this.errors = []
                this.errors.push("Вы не можете добавить больше 5 задач")
                return
            }
            this.tasks.push({
                "description": "",
                "isChecked": false,
            })
        },
        changeVisibility() {
            this.name = ""
            this.tasks = []
            this.errors = []
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
        isLocked: {
            type: Boolean,
            default: false
        }
    },
    template: `
    <div class="task">
        <p>{{ task.description }}</p>
        <label>
            <input type="checkbox" v-model="task.isChecked" v-on:change="sendTaskStatus" :disabled="isLocked">
        </label>
    </div>
    `,
    methods: {
        sendTaskStatus() {
            this.$emit('sendTaskStatus');
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
        isLocked: {
            type: Boolean,
        },
        whenCompleted: {
            type: String,
            required: false
        }
    },
    template: `
        <div class="card">
            <p>{{ this.name }}</p>
            <div class="card-task">
                <task v-for="(task, index) in tasks" 
                        :task="task" :index="index" :is-locked="isLocked"
                        @sendTaskStatus="sendTaskStatus"></task>
            </div>
            <p v-if="whenCompleted != null">Выполнено: {{ this.whenCompleted }}</p>
            
        </div>
    `,
    methods: {
        sendTaskStatus() {
            eventBus.$emit('changeTaskStatus', this.index);
        }
    },
})

Vue.component('column', {
    props: {
        column: {
            type: Array,
            required: true
        },
        cards: {
            type: Array,
            required: true,
            default: []
        },
        index: {
            type: Number,
            required: true
        },
        isLocked: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="column"">
            <p class="column-title">{{ this.column.name }}</p>
            <card v-for="card in cards" :key="card.id" :index="card.id" :name="card.name" :tasks="card.tasks" :is-locked="isLocked" :when-completed="card.whenCompleted"></card>
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
                isLocked: false,
                cardReadyToGo: -1,
            },
            {
                max: 5,
                name: "Второй столбец",
                isLocked: false,
                cardReadyToGo: -1,
            },
            {
                max: 0,
                name: "Третий столбец",
                isLocked: true,
                cardReadyToGo: -1,
            },
        ],
        cards: [],
    },
    methods: {
        addCart(name, tasks) {
            let allCards = localStorage.getItem("cards") ? JSON.parse(localStorage.getItem("cards")) : [];
            let nextId = JSON.parse(localStorage.getItem("index") || 0);
            allCards.push({
                id: nextId++,
                name: name,
                tasks: tasks,
                columnNum: 0,
                whenCompleted: null,
            })
            localStorage.setItem("index", JSON.stringify(nextId));
            localStorage.setItem("cards", JSON.stringify(allCards));
            this.cards = allCards;
        },
        completedPercentOfCard(cardIndex) {
            let completedPercent = 0;
            for (task of this.cards[cardIndex].tasks) {
                if (task.isChecked) {
                    completedPercent++;
                }
            }
            return (completedPercent / this.cards[cardIndex].tasks.length) * 100;
        },
        getTargetColumnIndex(cardIndex) {
            return Math.floor(this.completedPercentOfCard(cardIndex) / 50);
        },
        checkCard(cardIndex) {
            let currentCard = this.cards[cardIndex];
            let targetIndex = this.getTargetColumnIndex(cardIndex);
            // let canPlaceInPrev = true;
            // if (targetIndex < currentCard.columnNum) {
            //     canPlaceInPrev = !(this.cards.filter(card => card.columnNum === targetIndex).length >= this.columns[targetIndex].max);
            // }
            // if (!canPlaceInPrev) {
            //     targetIndex = currentCard.columnNum;
            // }
            //
            if (this.isColumnFull(targetIndex) || (this.columns[targetIndex].isLocked && this.columns[targetIndex].max > 0)) {
                this.columns[currentCard.columnNum].cardReadyToGo = currentCard.id;
            } else {
                currentCard.columnNum = targetIndex;
                this.columns[currentCard.columnNum].cardReadyToGo = -1;
                this.columns[currentCard.columnNum].isLocked = false;
                if (targetIndex >= this.columns.length-1) {
                    currentCard.whenCompleted = new Date().toLocaleString("ru-RU");
                }
            }
            localStorage.setItem("cards", JSON.stringify(this.cards));
            this.cards = [...this.cards];
            console.log("сейчас такая карта ", this.columns[currentCard.columnNum].cardReadyToGo);
            this.columnsWithLockState;
        },
        isColumnFull(columnIndex) {
            if (this.columns[columnIndex].max === 0) return false;
            return this.cards.filter(card => card.columnNum === columnIndex).length >= this.columns[columnIndex].max
        },
        
    },
    computed: {
        cardsToColumn() {
            return this.columns.map((column, index) => {
                return this.cards.filter(function (card ) {
                    return card.columnNum === index;
                })
            })
        },
        isAddLocked() { // блокирование добавления
            this.cards = [...this.cards];
            return this.cards.filter(card => card.columnNum === 0).length >= this.columns[0].max 
                || this.columns[0].isLocked
        },
        columnsWithLockState() {
            this.columns.forEach((column, index) => {
                if (index >= this.columns.length-1) {
                    column.isLocked = true;
                    return;
                }
                if (this.columns[index+1].max === 0) {
                    column.isLocked = false;
                    return;
                }
                
                if (this.columns[index].cardReadyToGo < 0) {
                    column.isLocked = false;
                }
                
                if (this.columns[index].cardReadyToGo >= 0 && this.isColumnFull(this.getTargetColumnIndex(this.columns[index].cardReadyToGo))) {
                    column.isLocked = true;
                } else if (this.columns[index].cardReadyToGo >= 0 && !(this.isColumnFull(this.getTargetColumnIndex(this.columns[index].cardReadyToGo)))) {
                    this.columns[index].cardReadyToGo = -1;
                    this.checkCard(this.columns[index].cardReadyToGo);
                }
                
                const cardsInNextColumn = this.cards.filter(card => card.columnNum === index+1);
                // column.isLocked = (cardsInNextColumn.length >= this.columns[index+1].max);
            })
        },
    },
    mounted() {
        this.cards = localStorage.getItem("cards") ? JSON.parse(localStorage.getItem("cards")) : [];
        let checkCard = this.checkCard.bind(this);
        this.cards.forEach(card => {
            checkCard(card.id);
        })
        eventBus.$on('changeTaskStatus', function (cardIndex) {
            checkCard(cardIndex);
        });
    },
})