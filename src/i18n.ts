export type UiLang = 'pt' | 'en';

let current: UiLang = 'pt';

export const getLang = () => current;

export function setLang(l: UiLang) {
  current = l;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR';
    document.title = l === 'en' ? 'Grid Sandbox — a drawing board for grids and layout' : 'Grid Sandbox — prancheta de grids e diagramação';
  }
}

export const isUiLang = (v: unknown): v is UiLang => v === 'pt' || v === 'en';

/** Picks the Portuguese or English version for the current interface language. */
export const tx = <T>(pt: T, en: T): T => (current === 'en' ? en : pt);

/** English replacement for a value: arrays and primitives are replaced whole, plain objects key by key. */
export type Overlay<T> = T extends readonly unknown[] ? T : T extends (...a: never[]) => unknown ? never : T extends object ? { [K in keyof T]?: Overlay<T[K]> } : T;

const isPlain = (v: unknown): v is object => typeof v === 'object' && v !== null && !Array.isArray(v);
const nestedCache = new WeakMap<object, WeakMap<object, object>>();

/**
 * Wraps Portuguese content so that, while the interface is in English, reads return the English
 * overlay instead. The Portuguese object stays the single source of structure; identity is stable.
 */
export function bilingual<T extends object>(pt: T, en: Overlay<NoInfer<T>> | undefined): T {
  if (!en) return pt;
  const over = en as Record<PropertyKey, unknown>;
  return new Proxy(pt, {
    get(target, key, receiver) {
      const base = Reflect.get(target, key, receiver);
      if (current !== 'en' || typeof key === 'symbol' || !Object.prototype.hasOwnProperty.call(over, key)) return base;
      const o = over[key];
      if (o === undefined) return base;
      if (isPlain(base) && isPlain(o)) {
        let m = nestedCache.get(base);
        if (!m) nestedCache.set(base, (m = new WeakMap()));
        let p = m.get(o);
        if (!p) m.set(o, (p = bilingual<object>(base, o)));
        return p;
      }
      return o;
    },
  });
}

/** Applies a per-id overlay to every item of a list. */
export const bilingualList = <T extends { id: string }>(list: T[], en: Partial<Record<string, Overlay<NoInfer<T>>>>): T[] => list.map((x) => bilingual(x, en[x.id]));
