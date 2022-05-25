<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useClipboard, usePermission } from '@vueuse/core'
import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/api/notification'
import { computed } from 'vue'

interface Pane {
  equation: string | null
  result: string | null
}
const props = defineProps<Pane>()

const { isSupported, copy, text } = useClipboard()
const copyPermissionGranted = usePermission('clipboard-write')

const canCopyResult = computed(() => props.result !== null && isSupported && copyPermissionGranted.value === 'granted')

const copyResult = async () => {
  if (canCopyResult.value) {
    props.result ? copy(props.result) : false

    if (!isPermissionGranted()) {
      await requestPermission()
    }
    sendNotification({
      title: `Result: ${props.result} copied to clipboard`,
    })
  }
}

</script>

<template>
  <div
    style="direction:ltr"
    class="group"
    @click="copyResult"
    min-w-full rounded-xl bg-neutral-900 h-full pb-5 px-8 flex flex-col justify-end transition-all duration-100 relative border-2 border-transparent select-none
    :border="result ? 'active:emerald-6' : ''"
    :bg="result ? 'hover:neutral-8' : ''"
  >
    <div leading-none text-neutral-600 font-bold text-lg select-none cursor-default>
      {{ equation }}
    </div>
    <div
      leading-normal text-5xl font-bold select-none cursor-default
      :text="result && (
         result.length > 17 ? 'size-2xl' : result.length > 10 ? 'size-3xl' : result.length > 7 ? 'size-4xl' : 'size-5xl'
      )"
    >
      {{ result }}
    </div>
    <div
      v-if="canCopyResult"
      absolute top-3 cursor-default select-none text-neutral-300 left-3 flex flex-row items-center invisible opacity-0 transition-all duration-100 group-hover:visible group-hover:opacity-100 p-1 border border-neutral-7 rounded-md group-active:border-transparent group-active:bg-emerald-6
    >
      <Icon w-6 h-6 icon="gg:clipboard" />
      <span text-sm mx-1>Copy Answer: {{ result }}</span>
    </div>
  </div>
</template>
