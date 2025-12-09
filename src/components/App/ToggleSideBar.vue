<template>
    <teleport to="body">
        <div
            class="fixed left-0 top-22 w-12 h-12 bg-400 border-r-2 border-y-2 border-color-600 rounded-r-full flex items-center justify-center transition duration-200 z-50"
            :class="
                props.isVisible ? `opacity-70 hover:opacity-100` : `opacity-0`
            "
            @click="extend"
        >
            <img
                src="/icons/collapse.png"
                class="-scale-x-100 w-[80%] h-[80%]"
            />
        </div>
    </teleport>
</template>

<script setup>
const props = defineProps({
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['extend']);
function extend() {
    emit('extend');
}
</script>
