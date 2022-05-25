import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

interface HistoryItem {
  id: string
  equation: string
  result: string
}

export const useHistory = defineStore('history', {
  state: () => ({
    history: [] as HistoryItem[],
  }),
  actions: {
    createHistoryItem(equation: string, result: string) {
      const item = {
        id: uuidv4(),
        equation,
        result,
      }
      this.history.unshift(item)
    },
    deleteHistoryItem(id: string) {
      this.history = this.history.filter(item => item.id !== id)
    },
    getHistoryItem(id: string) {
      return this.history.find(item => item.id === id)
    }
  },
  getters: {
    latestHistoryItem(state) {
      return state.history[state.history.length - 1]
    }
  }
})
