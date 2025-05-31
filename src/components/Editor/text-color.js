const CustomTextColor = Extension.create({
  name: "textColor",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.color) {
                return {};
              }
              return { style: `color: ${attributes.color}` };
            },
            parseHTML: (element) => ({
              color: element.style.color || "",
            }),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { color }).run();
        },
      unsetColor:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { color: null }).run();
        },
    };
  },
});
