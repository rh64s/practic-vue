Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
         <p>
           <label for="name">Name:</label>
           <input id="name" v-model="name" placeholder="name">
         </p>
        
         <p>
           <label for="review">Review:</label>
           <textarea id="review" v-model="review"></textarea>
         </p>
        
         <p>
           <label for="rating">Rating:</label>
           <select id="rating" v-model.number="rating">
             <option>5</option>
             <option>4</option>
             <option>3</option>
             <option>2</option>
             <option>1</option>
           </select>
         </p>
        
         <p>
           <input type="submit" value="Submit"> 
         </p>
        
        </form>

    `, data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: null,
        }
    },
    methods: {
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
            };
            this.$emit('review-submitted', productReview)
            this.name = null;
            this.review = null;
            this.rating = null;
        }
    }
})

Vue.component('product-details', {
    template: `
    <div>
        <p>Детали:</p>
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    </div>
    `, props: {
        details: {
            type: Array, required: true
        }
    }
})

Vue.component('product', {
    template: `
    <div class="product">
        <div class="product-image">
            <img alt="#" :src="image" :alt="altText"/>
        </div>
    
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <p v-if="inventory > 10 && inStock">In stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0 && inStock">Almost sold out!</p>
            <p v-else :class="{ textLineThrough: !inStock }">Out of stock</p>
            <!--            <p v-show="inStock">In Stock</p>-->
            <!--            <span v-show="onSale">On sale!</span>-->
            <span>{{ sale }}</span>
            <p>Shipping: {{ shipping }}</p>
            <product-details :details="details"></product-details>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            >
            </div>
<!--            <div v-for="size in sizes">-->
<!--                <p>{{ size }}</p>-->
<!--            </div>-->
            <button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button v-on:click="removeFromCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Remove from cart
            </button>

            <hr>
            
            <a :href="link">More products like this</a>
            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <product-review @review-submitted="addReview"></product-review>
        </div>        
   </div>
    `, props: {
        premium: {
            type: Boolean, required: true
        }
    }, data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: false,
            details: ['80% cotton', '20% polyester', 'Gender-natural'],
            variants: [{
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            }, {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }], // sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    }, methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        }, removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        }, updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },

    }, computed: {
        title() {
            return this.brand + ' ' + this.product;
        }, image() {
            return this.variants[this.selectedVariant].variantImage;
        }, inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        }, sale() {
            return this.brand + ' ' + this.product + ' ' + (["not on sale", "on sale!"])[Number(this.onSale)];
        }, shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return 2.99
            }
        },
    }
})

let app = new Vue({
    el: "#app", data: {
        premium: true, cart: [],
    }, methods: {
        updateCart(id) {
            this.cart.push(id);
        }, removeFromCart(id) {
            this.cart.pop(this.cart.findIndex(idElem => idElem !== id));
        }
    }
})