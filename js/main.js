let eventBus = new Vue()

Vue.component('card', {
    data() {
        return {
            currentModalMode: 0,
            errors: [],
            redactedName: this.card.name,
            redactedDescription: this.card.description,
            redactedDeadline: this.card.deadline,
            redactedMessage: "",
        }
    },
    props: {
        card: {
            type: Object,
            required: true
        },
    },
    template: `
<div class="card" :class="{ expired: card.is_expired, success: !card.is_expired }">
    <div v-if="currentModalMode === 0">
        <div class="card-header">
            <p class="card-name">{{ card.name }}</p>
        </div>
        <div class="card-info">
            <p class="card-description">{{card.description}}</p>
            <p class="card-created_at">Создана: {{new Date(card.created_at).toLocaleString('ru-RU')}}</p>
            <p class="card-created_at" v-if="card.updated_at != null">Изменена: {{new Date(card.updated_at).toLocaleString('ru-RU')}}</p>
            <p class="card-deadline">Дедлайн: {{new Date(card.deadline).toLocaleString('ru-RU')}}</p>
            <div v-if="card.messages.length > 0">
                <p v-for="message in card.messages" class="card-message warning">{{message}}</p>
            </div>
        </div>
        <div v-if="card.column_id < 3" class="card-controller">
            <div>
                <button class="card-button-delete" v-on:click="deleteCard">Удалить</button>
                <button class="card-button-change" v-on:click="currentModalMode = 1">Изменить</button>
            </div>
            <div>
                <button class="card-button-move" v-if="card.column_id > 1 && card.column_id < 4" v-on:click="moveCard(-1)"><-</button>
                <button class="card-button-move" v-if="card.column_id < 3" v-on:click="moveCard(+1)">-></button>
            </div>
        </div>
    </div>
    <div v-else-if="currentModalMode === 1 && card.column_id !== 3">
        <form @submit.prevent="saveCard">
            <div class="form-group">
                <label>Название задачи</label>
                <input type="text" v-model="redactedName" placeholder="Название">
            </div>
            <div class="form-group">
                <label>Описание задачи</label>
                <textarea v-model="redactedDescription"></textarea>
            </div>
            <div class="form-group">
                <label>Дэдлайн</label>
                <input type="date" v-model="redactedDeadline">
            </div>
            <button type="submit" class="btn btn-primary">Сохранить задачу</button>
            <button type="button" class="btn btn-secondary" v-on:click="close">Сбросить и закрыть</button>
        </form>
        <div class="errors" v-if="errors.length > 0">
            <p class="error" v-for="error in errors">{{error}}</p>
        </div>
    </div>
    <div v-else-if="currentModalMode === 2 && card.column_id !== 3">
        <form>
            <div class="form-group">
                <label>Введите причину перевода</label>
                <input type="text" v-model="redactedMessage" placeholder="Название">
            </div>
            <button type="submit" class="btn btn-primary" v-on:click="moveCard(-1)">Сохранить и перевести</button>
            <button type="button" class="btn btn-secondary" v-on:click="close">Отменить и закрыть</button>
        </form>
        <div class="errors" v-if="errors.length > 0">
            <p class="error" v-for="error in errors">{{error}}</p>
        </div>
    </div>
</div>`,
    methods: {
        moveCard(direction) { 
            if(direction === -1) {
                if (this.redactedMessage.length === 0) {
                    this.currentModalMode = 2;
                    return
                } else if (this.redactedMessage.length > 0) {
                    eventBus.$emit('attach-message', this.card.id, this.redactedMessage)
                    this.redactedMessage = "";
                }
            }
            eventBus.$emit('move-card', this.card.id, direction);
        },
        deleteCard() {eventBus.$emit('delete-card', this.card.id); },
        saveCard() {
            this.errors = []
            if (this.redactedName === "") {
                this.errors.push("Введите название задачи")
            }
            if (this.redactedDescription === "") {
                this.errors.push("Введите описание задачи")
            }
            if (this.redactedDeadline === null) {
                this.errors.push("Укажите дэдлайн!")
            } else if (new Date(this.redactedDeadline) < Date.now()) {
                this.errors.push("Дэдлайн не может быть раньше, чем текущее время")
            }
            if(this.errors.length > 0) {
                return;
            }
            this.currentModalMode = 0;
            
            this.card.name = this.redactedName;
            this.card.description = this.redactedDescription;
            this.card.deadline = this.redactedDeadline;
            eventBus.$emit('save-card', this.card);
        },
        close() {
            this.redactedName = this.card.name;
            this.redactedDescription = this.card.description;
            this.redactedDeadline = this.card.deadline;
            this.redactedMessage = "";
            this.currentModalMode = 0;
        }
    }
})

Vue.component('create-form', {
    data() {
        return {
            isActive: false,
            card: {
                name: "",
                description: "",
                deadline: null,
            },
            errors: []
        }
    },
    template: `
<div class="create-form">
    <div v-if="!isActive">
        <button v-model="isActive" v-on:click="changeIsActive" class="btn btn-primary">Создать карточку</button>
    </div>
    <div v-if="isActive">
        <form @submit.prevent="createCard">
            <div class="form-group">
                <label>Название задачи</label>
                <input type="text" v-model="card.name" placeholder="Название">
            </div>
            <div class="form-group">
                <label>Описание задачи</label>
                <textarea v-model="card.description"></textarea>
            </div>
            <div class="form-group">
                <label>Дэдлайн</label>
                <input type="date" v-model="card.deadline">
            </div>
            <button type="submit" class="btn btn-primary">Создать задачу</button>
            <button type="button" class="btn btn-secondary" v-on:click="changeIsActive">Закрыть</button>
        </form>
        <div class="errors" v-if="errors.length > 0">
            <p class="error" v-for="error in errors">{{error}}</p>
        </div>
    </div>
</div>`,
    methods: {
        createCard() {
            this.errors = []
            if (this.card.name === "") {
                this.errors.push("Введите название задачи")
            }
            if (this.card.description === "") {
                this.errors.push("Введите описание задачи")
            }
            if (this.card.deadline === null) {
                this.errors.push("Укажите дэдлайн!")
            } else if (new Date(this.card.deadline) < Date.now()) {
                this.errors.push("Дэдлайн не может быть раньше, чем текущее время")
            }
            if(this.errors.length > 0) {
                return;
            }
            this.$emit('create-card', this.card);
            this.card.name = "";
            this.card.description = "";
            this.card.deadline = null;
        },
        changeIsActive() {
            this.isActive = !this.isActive;
            this.card.name = "";
            this.card.description = "";
            this.card.deadline = null;
        }
    }
})

Vue.component('column', {
    props: {
        cards: Array,
        column: Object,
        index: {
            type: Number,
            required: true
        },
    },
    template: `
<div class="column"> 
    <p class="column-title">{{ this.column.name }}</p>
    <div class="cards">
        <create-form v-if="index === 0" @create-card="createCard"></create-form>
        <card v-for="card in cards" :key="card.id" :card="card" ></card>
    </div>
</div>`,
    methods: {
        createCard(card) {
            this.$emit("create-card", card);
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [
        ],
        columns: [
            { name: 'Запланированные задачи' },
            { name: 'В работе' },
            { name: 'Тестирование' },
            { name: 'Выполненные задачи' },
        ]
    },
    methods: {
        createCard(card) {
            this.cards.push({
                id: typeof(this.cards[this.cards.length - 1]) != 'undefined' ? this.cards[this.cards.length - 1].id + 1 : 0,
                name: card.name,
                description: card.description,
                deadline: card.deadline,
                created_at: Date.now(),
                updated_at: null,
                messages: [],
                column_id: 0,
                is_expired: false
            })
            this.saveCards()
            this.cards = [...this.cards];
        },
        getCard(cardId) {
            return this.cards.find((card) => card.id === cardId);
        },
        moveCard(cardId, direction) {
            let card = this.getCard(cardId);
            card.column_id += direction
            if (card.column_id === 3) {
                console.log(Date.now(), card.deadline, Date.now() > card.deadline)
                card.is_expired = Date.now() > new Date(card.deadline);
                card.message = []
            }
            this.saveCards()
        },
        saveCards() {
            localStorage.setItem("cards", JSON.stringify(this.cards))
        },
        saveCard(newCard) {
            let card = this.getCard(newCard.id);
            card.name = newCard.name;
            card.description = newCard.description;
            card.deadline = newCard.deadline;
            card.updated_at = Date.now();
            this.saveCards()
        },
        deleteCard(cardId) {
            this.cards = this.cards.filter(card => card.id !== cardId);
            this.saveCards()
        },
        attachMessage(cardId, message) {
            this.getCard(cardId).messages.push(message);
            this.saveCards();
        }
    },
    computed: {
        cardsToColumns() {
            return this.columns.map((column, index) => {
                return this.cards.filter(function (card) {
                    return card.column_id === index;
                })
            })
        }
    },
    mounted() {
        this.cards = localStorage.getItem("cards") ? JSON.parse(localStorage.getItem("cards")) : [];
        eventBus.$on('move-card', this.moveCard);
        eventBus.$on('delete-card', this.deleteCard);
        eventBus.$on('save-card', this.saveCard);
        eventBus.$on('attach-message', this.attachMessage)
    }
})