<template>
    <div class="w-full h-full big-bg flex flex-col items-start p-10"
        v-if="successAPI === successAPITarget">

        <h1 class="w-full text-3xl font-bold p-3">
            {{ t('settings.class_selection.title') }}
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <label for="class" class="px-3 text-2xl font-extrabold">
                {{ t('settings.class_selection.label') }}
            </label>
            <select id="class" v-model="class_name" class="border-2 border-black rounded-[4px]">
                <option v-for="(class_name, class_id) in classes" :key="class_id" :value="class_id">
                    {{ class_name }}
                </option>
            </select>
        </div>

        <h1 class="w-full text-3xl font-bold p-3">
            {{ t('settings.language_selection.title') }}
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <label for="lang" class="px-3 text-2xl font-extrabold">
                {{ t('settings.language_selection.label') }}
            </label>
            <select id="lang" v-model="lang" class="border-2 border-black rounded-[4px]">
                <option v-for="(lang, langAbbr) in languages" :key="langAbbr" :value="langAbbr">
                    {{ lang }}
                </option>
            </select>
        </div>

        <h1 class="w-full text-3xl font-bold p-3">
            {{ t('settings.color_style.title') }}
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="blue" id="blue" v-model="style"></input>
                <label for="blue" class="px-3 text-blue-500 text-2xl font-extrabold">{{ t('settings.color_style.options.blue') }}</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="pink" id="pink" v-model="style"></input>
                <label for="pink" class="px-3 text-pink-500 text-2xl font-extrabold">{{ t('settings.color_style.options.pink') }}</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="green" id="green" v-model="style"></input>
                <label for="green" class="px-3 text-green-500 text-2xl font-extrabold">{{ t('settings.color_style.options.green') }}</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="custom" id="custom" v-model="style"></input>
                <label for="custom" class="px-3 text-2xl font-extrabold">{{ t('settings.color_style.options.custom') }}</label>
                <div class="p-0.5 flex flex-row items-center border-2 border-black rounded-[4px]">
                    <input type="color" class="p-0" v-model="custom_color"></input>
                    <span class="px-0.5">{{ t('settings.color_style.color_picker') }}</span>
                </div>
            </div>
        </div>

        <h1 class="w-full text-3xl font-bold p-3">
            {{ t('settings.display_order.title') }}
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="order" value="1" id="order1" v-model="order"></input>
                <label for="order1" class="px-3 text-2xl font-extrabold">{{ t('settings.display_order.options.chronological') }}</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="order" value="-1" id="order-1" v-model="order"></input>
                <label for="order-1" class="px-3 text-2xl font-extrabold">{{ t('settings.display_order.options.reverse') }}</label>
            </div>
        </div>

        <h1 class="w-full text-3xl font-bold p-3">
            {{ t('settings.display_zero_scores.title') }}
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="is0Shown" value="t" id="is0Shown-t" v-model="is0Shown"></input>
                <label for="is0Shown-t" class="px-3 text-2xl font-extrabold">{{ t('settings.display_zero_scores.options.yes') }}</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="is0Shown" value="f" id="is0Shown-f" v-model="is0Shown"></input>
                <label for="is0Shown-f" class="px-3 text-2xl font-extrabold">{{ t('settings.display_zero_scores.options.no') }}</label>
            </div>
        </div>
    </div>
    <div v-else-if="successAPI < 0">
        <FetchUnsuccessful></FetchUnsuccessful>
    </div>
    <div v-else>
        <Loading></Loading>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t, locale } = useI18n({useScope: 'global'});
    import { apply_color, remove_all_color } from '../composables/settings/apply_color';
    import { getClasses } from '../composables/configurations.mts';
    import FetchUnsuccessful from '../components/FetchUnsuccessful.vue';
    import Loading from '../components/Loading.vue';

    // 网络请求状态
    function handle_e(): void {
        successAPI.value = -Infinity;
    }
    const successAPI = ref<number>(0);
    const successAPITarget: number = 1;

    // 解析promise
    let classes = ref();
    getClasses().then(res => {
        classes.value = res;
        successAPI.value++;
    }).catch(_ => handle_e());

    // 初始化颜色
    const custom_color = ref(localStorage.getItem('custom') || "#8B95C9");
    const style = ref<string>('');
    style.value = localStorage.getItem('style') || '';
    document.body.className = style.value;
    // 给定颜色调节
    watch(style, (_new, _) => {
        document.body.className = _new;
        localStorage.setItem('style', _new);
        if (_new === 'custom') {
            localStorage.setItem('custom', custom_color.value);
            apply_color(localStorage.getItem('custom') || '');
        } else {
            remove_all_color();
        }
    });
    // 自定义颜色调节
    watch(custom_color, (_new, _) => {
        if (localStorage.getItem('style') !== 'custom') return;
        localStorage.setItem('custom', _new);
        apply_color(localStorage.getItem('custom') || '');
    });

    // transactions展示顺序初始化
    const order = ref();
    order.value = localStorage.getItem('order');
    // 展示顺序调节
    watch(order, (_new, _) => {
        localStorage.setItem('order', _new);
    });

    // 初始化class选择
    const class_name = ref(Number(localStorage.getItem('class')) || 0);
    watch(class_name, (_new, _) => {
        localStorage.setItem('class', _new.toString());
    });

    // 初始化is0Shown选择
    const is0Shown = ref<string>(localStorage.getItem('is0Shown') || 't');
    watch(is0Shown, (_new, _) => {
        localStorage.setItem('is0Shown', _new);
    });

    // 初始化语言选择
    const languages = {
        zh: '中文',
        en: 'English'
    };
    const lang = ref<string>(locale.value);
    watch(lang, (_new, _) => {
        locale.value = _new;
        localStorage.setItem('lang', _new);
    });
</script>