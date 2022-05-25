<script setup lang="ts">
import '@splidejs/splide/dist/css/splide-core.min.css'
import { useHistory } from '../store/history'
import Pane from './pane.vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import { watch, ref, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const history = useHistory().history

interface display {
  currentEquation: string | null
  currentResult: string | null
}
defineProps<display>()

const sliderOptions: any = {
  fixedWidth: '100%',
  width: '28rem',
  fixedHeight: '10rem',
  direction: 'rtl',
  wheel: true,
  gap: '1rem',
  pagination: false,
  arrows: false,
  useScroll: true,
  wheelMinThreshold: 5,
  type: 'slide'
}
const sliderKey = ref(uuidv4())
const setSliderWidth = () => {
  sliderKey.value = uuidv4()
  history.length ? sliderOptions.fixedWidth = '18rem' : sliderOptions.fixedWidth = '100%'
}
watch([history], () => {
  setSliderWidth()
})
onMounted(() => {
  setSliderWidth()
})

</script>

<template>
  <Splide
    rounded-lg overflow-hidden
    :options="sliderOptions"
    :key="sliderKey">
    <SplideSlide>
      <Pane
        :equation="currentEquation"
        :result="currentResult" />
    </SplideSlide>
    <SplideSlide v-for="(item, i) in history" :key="item.id">
      <Pane
        :equation="item.equation"
        :result="item.result" />
    </SplideSlide>
  </Splide>
</template>
