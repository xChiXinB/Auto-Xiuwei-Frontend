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
    NewYears:
        '退退退 夫妻肺片 林黛玉 抱头痛哭 背对背拥抱 浊容嬷嬷 不打不相识 张牙舞爪 打乒乓球 笑里藏刀 新白娘子传奇 四脚朝天 变形金刚 理发店 蒙娜丽莎 花样游泳 走钢丝 啄木鸟 看演唱会 烧烤 系鞋带泷 蒲公英 emo 点头哈腰 功夫熊猫 蜘蛛侠 听音乐 社牛 唐人街探案 高考 吃瓜 翻跟斗 拔刀相助 王者荣耀 泰酷辣 五音不全 小黄人啻 亮剑螂 成龙猖 吹泡泡 加勒比海盗 打麻将 社死 美女与野兽 垂头丧气疝 奥特曼 钓鱼 牛顿 打火锅 广播体操 酒醉的蝴蝶茏 瑜伽 小猪佩奇爵 显眼包 树懒 打台球 小红帽 最炫民族风嫡 佛系 大眼瞪小眼 冰激凌 干饭人 吸星大法 插秧 猩猩 公交车站 旱鸭子 迈克尔·杰克逊 打羽毛球 飞驰人生 紫薇 孤勇者 翻墙 乘风破浪 做家务 家有儿女 指手画脚 摄影师甾 洗碗桫 告白气球 翩翩起舞 新闻联播 举重 哈利·波特 地震 交警 美少女战士 打呼噜 隐形眼镜 陶喆 无缝街接 表情包 冰雪大世界 画家 坐井观天 舞狮 凡尔赛 龇牙咧嘴 拖拉机 挖墙脚 吹空调 小拳拳捶你胸 菠萝菠萝蜜 男才女貌 植物大战僵尸 你是我的神 拂袖而去 江南style 穿针引线 打工人 泰坦尼克号 出海捕鱼 贵妃醉酒 我想静静 不倒翁 塑料姐妹花 葛优躺 黄金矿工 打草惊蛇 丢手绢 霸道总裁爱上我 mua～'.split(
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
