import { proxy, ref } from "valtio";

export const orbContext = proxy<{ target: HTMLElement | null }>({
  target: null,
});

// Helper action to update the target safely
export const setOrbTarget = (node: HTMLElement | null) => {
  // ref() tells Valtio NOT to deeply proxy the DOM node
  orbContext.target = node ? ref(node) : null;
};
