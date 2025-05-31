// font-size.js (or in your setup)
import { Mark } from "@tiptap/core";

export const FontSize = Mark.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
      defaultSize: "16px",
    };
  },
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => {
          const hasFontSize =
            element.hasAttribute("style") &&
            /font-size/i.test(element.getAttribute("style"));
          if (hasFontSize) {
            return {};
          }
          return false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("fontSize", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("fontSize", { fontSize: null })
            .run()
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
