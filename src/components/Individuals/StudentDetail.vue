<template>
    <div class="w-[90%] lg:w-[30%] min-h-[30vh] lg:h-160 shadow-2xl rounded-4xl big-bg mb-4 flex flex-col"
    ref="main">
        <template v-if="props.show">
            <div class="w-full h-18 rounded-t-4xl bg-400 flex items-center justify-center">
                <p class="text-4xl font-bold">
                    {{ users[user_id] }}: {{ Object.values(transactions).map(val => val.variation).reduce((a, b) => a+b, 0).toFixed(2) }}'
                </p>
            </div>
            <div class="w-full overflow-auto">
                <div v-for="transaction_id in sorted_transaction_id" :key="transaction_id"
                class="w-full border-b-2 border-gray-600 last:border-b-0 p-2 text-center hover:font-bold">
                    <span v-for="(data, key) in props.transactions[transaction_id]" :key="key">
                        <template v-if="key == 'time'">
                            {{ new Date(data * 1000).toLocaleString() }},
                        </template>
                        <template v-else-if="key == 'variation'">
                            {{ data >= 0 ? `+` : `` }}{{ data }}
                        </template>
                        <template v-else>
                            because {{ data }}
                        </template>
                    </span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="w-full h-full flex-1 flex flex-col items-center justify-center">
                <h1 class="text-3xl font-bold p-4 text-black/50">
                    Click on a ball to see details.
                </h1>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { users } from '../../composables/configurations.mjs';

    const props = defineProps({
        show: {
            type: Object,
            required: true,
        },
        transactions: {
            type: Object,
            required: true,
        },
        // 1: {
        //     time: 1760140343,
        //     variation: -1,
        //     reason: "迟到",
        // }, 
        // 2: { time: ...... }
        user_id: {
            type: Number,
            required: true,
        },
        clicks: {
            type: Number,
            required: true,
        },
    });

    const main = ref();
    watch(() => props.clicks, (_, __) => {
        main.value.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    });

    let sorted_transaction_id;
    watch(() => props.transactions, () => {
        sorted_transaction_id = Object.keys(props.transactions).sort((a, b) => a-b);
    });
</script>
