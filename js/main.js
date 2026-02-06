Vue.component('task', {
})

Vue.component('card', {
    data: {
        tasks: []
    }
})

Vue.component('column', {
    data: {
        cards: [],
    },
    props: {
        name: {
            type: String,
            required: true
        },
        max: {
            type: Number,
            required: false,
            default: 0
        }
    },
    template: `
    <div class="column">
        <h3 class="column-title">{{ name }}</h3>
        <div class="card" v-for="(card, cards)">
            <card></card>
        </div>
        <
    </div>
    
    `
})

let app = new Vue({
    el: '#app',
    data: {
        columns: []
    },
    template: `
    <div class="todo-body">
        <column :max="3" :name="'Первый столбец'"></column>
        <column :max="5" :name="'Второй столбец'"></column>
        <column :name="'Третий столбец'"></column>
    </div>
`
})