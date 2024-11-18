<script setup>
import Lenis from 'lenis';

import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Intro from "./components/Intro.vue";
import Contact from "./components/Contact.vue";
import Project from "./components/Project.vue";


const lenis = new Lenis();
lenis.on('scroll', (e) => {
  console.log(e);
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
</script>

<template>
  <div class="h-full w-full bg-zinc-900 font-[HankenGrotesk-Regular] text-zinc-100 overflow-hidden">

    <div class="flex flex-col justify-center items-center w-screen min-h-screen mx-auto">
      <Header />
      <Intro />
      <Contact />
    </div>
    <Project />
    <Footer />
  </div>
</template>

<style scoped></style>
