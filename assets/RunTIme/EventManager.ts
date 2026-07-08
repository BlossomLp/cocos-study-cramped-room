import Singleton from '../Base/Singleton'
import type { EventMap } from './EventMap'

type EventCallback<T extends unknown[]> = (...args: T) => void
interface IEventCallback {
  callback: Function
  context?: unknown
}

export class EventManager extends Singleton {
  static get Instance() {
    return super.getInstance<EventManager>()
  }

  private eventDic = new Map<keyof EventMap, IEventCallback[]>()

  on<K extends keyof EventMap>(eventName: K, callback: EventCallback<EventMap[K]>, context?: unknown) {
    if (!this.eventDic.has(eventName)) {
      this.eventDic.set(eventName, [])
    }
    const callbacks: IEventCallback[] = this.eventDic.get(eventName)
    callbacks.push({ callback, context })
  }

  emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
    const callbacks = this.eventDic.get(eventName)
    if (callbacks) {
      callbacks.forEach(({ callback, context }) => {
        context ? callback.apply(context, args) : callback(...args)
      })
    }
  }

  off<K extends keyof EventMap>(eventName: K, callback: EventCallback<EventMap[K]>) {
    const callbacks = this.eventDic.get(eventName)
    if (callbacks) {
      const index = callbacks.findIndex(cb => cb.callback === callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }
}
