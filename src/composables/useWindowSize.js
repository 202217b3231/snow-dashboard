export function useWindowSize() {
  const windowSize = ref({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const update = () => {
    windowSize.value = { width: window.innerWidth, height: window.innerHeight };
  };
  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });
  return { windowSize };
}
