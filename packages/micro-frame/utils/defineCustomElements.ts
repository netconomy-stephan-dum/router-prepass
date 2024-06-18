const defineCustomElements = (customElements: Record<string, CustomElementConstructor>) => {
  Object.entries(customElements).forEach(([name, customElement]) => {
    if (!window.customElements.get(name)) {
      window.customElements.define(name, customElement);
    }
  });
};

export default defineCustomElements;
