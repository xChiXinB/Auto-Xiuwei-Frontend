<template>
  <ToggleSideBar
  :is-visible="collapsed"
  @extend="extend"></ToggleSideBar>

  <div class="w-[100px] h-screen fixed top-0 left-0 transition duration-200 ease-in-out shrink-0"
  :class="collapsed && `translate-x-[-100px]`">
    <SideBar @collapse="collapse"
    :md="md"></SideBar>
  </div>

  <div class="min-h-full transition duration-200 ease-in-out shrink"
  :class="collapsed ? `ml-0 w-full` : `ml-[100px] w-[calc(100vw-100px)]`">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import SideBar from "./src/components/SideBar.vue";
  import ToggleSideBar from './src/components/ToggleSideBar.vue';

  const md: number = 768;
  let w: number = md;
  let timeout: any;

  const collapsed = ref<boolean>(window.innerWidth < md);
  function collapse() {
    collapsed.value = true;
  }
  function extend() {
    collapsed.value = false;
  }

  onMounted(() => {
    resize_e();
    window.addEventListener('resize', resize_e);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize_e);
  })

  function resize_e() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (w < md) {
        if (window.innerWidth < md) return;
      } else if (w >= md) {
        if (window.innerWidth >= md) return;
      }
      w = window.innerWidth;
      if (w >= md) {
        collapsed.value = false;
      } else {
        collapsed.value = true;
      }
    }, 100);
  }

</script>