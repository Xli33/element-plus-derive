import { inject, type ComputedRef } from 'vue'
import { getPathValue } from 'utils-where'
import { CPKey } from '@/utils'
import { $i18n } from '@/locale/i18n'

export function useLang() {
  const configContext = inject<{ locale?: ComputedRef<object>; msgPrefix: string }>(CPKey)

  //computed(() => configContext?.locale?.value)

  const t = (key: string, ...args: any[]) => {
    const currentMsg = configContext?.locale?.value
    return currentMsg
      ? (getPathValue(currentMsg, configContext!.msgPrefix + '.' + key) ?? key)
      : $i18n.t(key, ...args)
  }

  return { t }
}
