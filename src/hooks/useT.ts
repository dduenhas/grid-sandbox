import { useStore } from '../store/useStore';
import { tx } from '../i18n';

/** `tx` bound to a store subscription, so the component re-renders when the language changes. */
export function useT() {
  useStore((s) => s.uiLang);
  return tx;
}
