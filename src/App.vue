<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHistory } from './store/history'
import Pad from './components/pad.vue'
import Display from './components/display.vue'

const currentEquation = ref<string | null>(null)
const currentEquationResult = ref<string | null>(null)

const solveEquation = (equation: string | null) => {
  if (equation && equation.match(/\d$/)) {
    const result = eval(equation)
    currentEquationResult.value = result.toString()
  } else if (!currentEquation.value) {
    currentEquationResult.value = null
  }
}
const pushSolvedEquation = () => {
  const equation = currentEquation.value
  const result = currentEquationResult.value
  if (equation && result) {
    useHistory().createHistoryItem(equation.toString(), result.toString())
  }
}
watch([currentEquation], () => {
  solveEquation(currentEquation.value)
})

</script>

<template>
  <div min-h-screen min-w-screen bg-black text-gray-100 font-sans>
    <div w-28rem py-6 px-5 grid gap-8>
      <Display
        :current-equation="currentEquation"
        :current-result="currentEquationResult" />
      <Pad
        v-model="currentEquation"
        @solve="pushSolvedEquation" />
    </div>
  </div>
</template>
