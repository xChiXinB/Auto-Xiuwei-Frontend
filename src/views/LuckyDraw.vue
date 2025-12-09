<template>
    <div class="w-full min-h-full big-bg">
        <div class="w-full h-14 shadow overflow-x-auto whitespace-nowrap">
            <div
                v-for="(contents, title) in all_contents"
                :key="title"
                class="inline-block h-full p-2 hover:bg-300 hover:font-bold border-r-2 border-gray-400 last:border-r-0 transition duration-200 ease-in-out"
                @click="select(title)"
                :class="selected_title === title ? 'bg-400' : 'bg-200'"
            >
                <div
                    class="flex items-center justify-center w-full h-full text-3xl text-gray-900"
                >
                    {{ title }}
                </div>
            </div>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 place-items-center w-[100%] mb-40"
        >
            <div
                v-for="(content, index) in card_contents"
                :key="index"
                class="bg-300 rounded-2xl w-[90%] h-20 border-6 border-color-400 shadow-md mt-2 mb-2 flex justify-center items-center hover:-translate-y-2 transition duration-200 ease-in-out"
                @click="
                    is_disappear && appear_index === -1 && click_card(index)
                "
            >
                <p
                    class="text-3xl transition duration-500"
                    :class="
                        is_disappear && appear_index !== index ? 'blur-sm' : ''
                    "
                >
                    {{ content }}
                </p>
            </div>
        </div>

        <teleport to="body">
            <div
                class="w-100 h-30 fixed bottom-10 left-[50%] translate-x-[-50%] bg-white/30 backdrop-blur-lg rounded-full overflow-hidden shadow-lg transition ease-in-out flex justify-center items-center"
                :class="
                    is_disappear && appear_index === -1
                        ? `duration-500 scale-0`
                        : `duration-300 hover:scale-x-110`
                "
                @click="draw()"
                ref="btn"
            >
                <p class="text-4xl font-bold">
                    {{ t('lucky_draw.draw_button') }}
                </p>
            </div>
        </teleport>

        <teleport to="body">
            <transition name="hint">
                <div
                    v-if="show_hint"
                    class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-65 md:w-110 h-30 opacity-60 bg-sec-300 backdrop-blur-sm border-4 border-sec-color-600 text-3xl md:text-5xl rounded-4xl shadow-2xl flex items-center justify-center"
                >
                    {{ t('lucky_draw.hint') }}
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const btn = ref(null);
const is_disappear = ref(false);
const appear_index = ref(-1);
const show_hint = ref(false);
let interval_id = null;

const all_contents = {
    Rewards:
        'Top30校徽pin 超可爱卡套 超可爱卡套 午休自由券 息怒卡 乾坤大挪移 乾坤大挪移 限时同桌卡（一天） Top10校徽pin Top10校徽pin 制定周五主题色 制定周五主题色 超励志书签 超励志书签 电话夸夸卡 电话夸夸卡 电话夸夸卡 与Tracy共进午餐 与Tracy共进午餐 自由换座位券（一天） 微信夸夸卡 一起打球儿去 免罚券 限时同桌卡（半天） 水豚便利贴 如有“文”助 拍立得合影券 雪王庆典（全组一个） 雪王庆典（全组一个） 雪王庆典（全组一个） 玉米：我有玉玉症 神经筷子：双手奉上今日の午餐 体育课不问理由准假权 家长会夸夸卡 活动协助卡 约饭卡 羽毛球陪练卡'.split(
            ' ',
        ),
    Punishments:
        '照片当作班级电脑壁纸一天 一击即中必答真心话 去老师办公室打扫卫生一次 选择这周中一天帮值日 平板支撑二分钟 发pyq“我是小猪头”一天 俯卧撑20个 公主抱一位组员 跨一个一字马 打扫老师办公室一次 楼道里大喊巴啦啦小魔仙全身变 爆料小名 涂口红 青青子衿，梅完梅了 青青子衿，梅完梅了 青青子衿，梅完梅了 青青子衿，梅完梅了 发箍：我是今日显眼包 对走廊大喊：君の名字 碳粉：15年白刷牙 小丑鼻子：小丑竟是我自己'.split(
            ' ',
        ),
    Students:
        '管一楠-Nancy 赵望舒-Hermia 王之众-Andy 赵子轩-Arnold 崔刘沛阳-Forrest 钟弘毅-Andy 汤辰希-DavidTang 马睿皓-Harry 高悠然-Andy 王馨彤-Jessica 冯逸轩-Jayden 齐予涵-Hannah 夏琳涵-Nina 王子暄-Tom 任聿翔-Roger 董易文-Rose 付唯松-David'.split(
            ' ',
        ),
};
function select(title) {
    clearInterval(interval_id);

    selected_title.value = title;
    actual_contents.value = [...all_contents[selected_title.value]];
    card_contents.value = [...actual_contents.value];

    is_disappear.value = false;
    appear_index.value = -1;
}
const selected_title = ref();
const actual_contents = ref();
const card_contents = ref();
select('Rewards');

function draw() {
    show_hint.value = true;
    setTimeout(() => {
        show_hint.value = false;
    }, 1500);

    is_disappear.value = true;
    appear_index.value = -1;

    clearInterval(interval_id);
    interval_id = setInterval(() => {
        for (let i = 0; i < card_contents.value.length; i++) {
            card_contents.value[i] = Math.random().toString().slice(10);
        }
    }, 500);
}

function click_card(i) {
    clearInterval(interval_id);

    const contents_id = Math.floor(
        Math.random() * actual_contents.value.length,
    );
    card_contents.value[i] = actual_contents.value[contents_id];
    appear_index.value = i;
}
</script>

<style>
.hint-enter-active,
.hint-leave-active {
    transition: all 0.5s ease;
}

.hint-enter-from {
    transform: scale(2);
    opacity: 0;
}
.hint-leave-to {
    transform: scale(0);
    opacity: 0;
}
</style>
