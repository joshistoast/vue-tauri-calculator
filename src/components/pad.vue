<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { useClipboard, usePermission } from '@vueuse/core'

interface Pad {
  modelValue: string | number | null
}
defineProps<Pad>()

const actions = [
  [
    { label: 'C', key: 'c' },
    { label: '+/-', key: 'i' },
    { label: 'gg:math-percent', key: '%' },
    { label: 'gg:math-divide', key: '/' },
  ],
  [
    { label: '7', key: '7' },
    { label: '8', key: '8' },
    { label: '9', key: '9' },
    { label: 'gg:close', key: '*' },
  ],
  [
    { label: '4', key: '4' },
    { label: '5', key: '5' },
    { label: '6', key: '6' },
    { label: 'gg:math-minus', key: '-' },
  ],
  [
    { label: '1', key: '1' },
    { label: '2', key: '2' },
    { label: '3', key: '3' },
    { label: 'gg:math-plus', key: '+' },
  ],
  [
    { label: 'gg:undo', key: 'u' },
    { label: '0', key: '0' },
    { label: '.', key: '.' },
    { label: 'gg:math-equal', key: '=' },
  ],
]
const currentValue = ref('')

const { isSupported, copy, text } = useClipboard()
const clipboardReadPermission = usePermission('clipboard-read')
const canPaste = isSupported && clipboardReadPermission.value === 'granted'

const isIcon = (button: string | number) => button.toString().startsWith('gg:')
const emit = defineEmits(['input', 'update:modelValue', 'solve'])
const handleValue = (value: string | number) => {
  if (value === 'd') {
    currentValue.value = currentValue.value.slice(0, -1)
  } else if (value === 'c') {
    currentValue.value = ''
  } else {
    currentValue.value += value
  }

  if (value === '=') {
    emit('solve')
    currentValue.value = ''
    emit('update:modelValue', null)
  } else {
    emit('input', currentValue.value)
    emit('update:modelValue', currentValue.value)
  }
  handleFocus(value)
}
const onKeyEvent = (e: any) => {
  const key = e.key
  const keyAction = actions.map(row => row.map(button => button.key).find(value => value === key)).find(value => value)

  // key shortcuts
  if (keyAction) {
    handleValue(keyAction)
  } else if (key === 'Enter') {
    handleValue('=')
  } else if (key === 'Backspace') {
    handleValue('d')
  } else if (key === 'x' || key === 'X') {
    handleValue('*')
  } else if ((key === 'z' || key === 'Z') && (e.ctrlKey || e.metaKey)) {
    handleValue('u')
  } else if ((key === 'v' || key === 'V') && (e.ctrlKey || e.metaKey)) {
    // TODO: paste from clipboard
  } else {
    return false
  }
}
const handleFocus = (value: string | number) => {
  const button = document.getElementById(value.toString())
  if (button) {
    button.focus()
  } else {
    if ('activeElement' in document) {
      (document.activeElement as HTMLElement).blur()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyEvent)
})
</script>

<template>
  <div grid gap-2 w-full min-h-400px>
    <div
      v-for="(row, rowIndex) in actions"
      grid gap-2 grid-cols-4
    >
      <button
        v-for="(button, buttonIndex) in row"
        :key="buttonIndex + rowIndex"
        :tabindex="0"
        @click="handleValue(button.key)"
        @keyup.enter="handleValue(button.key)"
        @keyup.space="handleValue(button.key)"
        :data-key="button.key"
        :data-value="button.label"
        :id="button.key"
        place-items-center appearance-none select-none transition-all duration-50 font-bold col-span-1 text-lg grid rounded-xl transform active:scale-90 outline-none cursor-default ring-transparent ring-2 focus:ring-offset-black focus:ring-offset-3 focus:ring-emerald-5
        :text="
          buttonIndex === (row.length - 1) && rowIndex === (actions.length - 1) ? 'neutral-1'
          : (buttonIndex === (row.length - 1) || rowIndex === 0) ? 'emerald-6 hover:emerald-4 focus:emerald-4'
          : 'neutral-4 hover:neutral-1 focus:neutral-1'"
        :bg="
          buttonIndex === (row.length - 1) && rowIndex === (actions.length - 1) ?'emerald-7 hover:emerald-6'
          : buttonIndex === (row.length - 1) ? 'neutral-9 hover:neutral-8'
          : 'transparent hover:neutral-9'"
      >
        <Icon v-if="isIcon(button.label)" :icon="button.label" w-6 h-6 />
        <span v-else>{{ button.label }}</span>
      </button>
    </div>
  </div>
</template>
