import Singleton from '../Base/Singleton'

interface IEventCallback {
  callback: Function
  context?: unknown
}

export class EventManager extends Singleton {
  static get Instance() {
    return super.getInstance<EventManager>()
  }

  private eventDic: Map<string, Array<IEventCallback>> = new Map()

  on(eventName: string, callback: Function, context?: unknown) {
    if (!this.eventDic.has(eventName)) {
      this.eventDic.set(eventName, [])
    }
    const callbacks: IEventCallback[] = this.eventDic.get(eventName)
    callbacks.push({ callback, context })
  }

  emit(eventName: string, ...args: unknown[]) {
    const callbacks = this.eventDic.get(eventName)
    if (callbacks) {
      callbacks.forEach(({ callback, context }) => {
        context ? callback.apply(context, args) : callback(...args)
      })
    }
  }

  off(eventName: string, callback: Function) {
    const callbacks = this.eventDic.get(eventName)
    if (callbacks) {
      const index = callbacks.findIndex(cb => cb.callback === callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }
}
