const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

class Editor {
  selectedSlide;

  constructor(containerId) {
    this.containerId = containerId;
    this.initializeStage();
  }

  selectSlide(slide) {
    this.selectedSlide = slide;
  }

  initializeStage() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error("slideEditorArea not found!");
      return;
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    this.stage = new Konva.Stage({
      container: "slideEditorArea",
      width: width,
      height: height,
    });

    this.stage.on("wheel", (e) => this.scale(e));

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.scale({
      x: (this.stage.width() / SLIDE_WIDTH) * 0.9,
      y: (this.stage.width() / SLIDE_WIDTH) * 0.9,
    });

    this.stage.position({
      x: -(SLIDE_WIDTH * this.stage.scaleX() - this.stage.width()) / 2,
      y: -(SLIDE_HEIGHT * this.stage.scaleY() - this.stage.height()) / 2,
    });

    this.setWorkingPlace();

    // this.stage.on("click", () => this.toJSON());
  }

  setWorkingPlace() {
    const space = new Konva.Rect({
      width: SLIDE_WIDTH * 3,
      height: SLIDE_HEIGHT * 3,
      x: -SLIDE_WIDTH,
      y: -SLIDE_HEIGHT,
      strokeWidth: 4,
      stroke: "black",
      fill: "#ccc",
    });
    this.layer.add(space);

    const slideArea = new Konva.Rect({
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      x: 0,
      y: 0,
      fill: "white",
    });
    this.layer.add(slideArea);

    slideArea.on("click", () => {
      slide.transformers.forEach((tr) => tr.hide());
    });
  }

  // clear() {
  //   this.layer.destroyChildren();
  //   this.transformers = [];
  //   this.layer.draw();
  //   this.setWorkingPlace();
  // }

  // loadElements(elements) {
  //   this.clear();
  //   elements.forEach((el) => {
  //     if (el.type === "circle") {
  //       this.newCircle(el.x, el.y);
  //     } else if (el.type === "rectangle") {
  //       this.newRect(el.x, el.y);
  //     } else if (el.type === "text") {
  //       this.newText(el.x, el.y, el.text);
  //     }
  //   });
  //   this.layer.draw();
  // }

  // toJSON() {
  //   let json = this.stage.toJSON();
  //
  //   console.log(json);
  // }

  scale(e) {
    e.evt.preventDefault();

    let oldScale = this.stage.scaleX();
    let pointer = this.stage.getPointerPosition();

    let mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const SCALEBY = 1.05;

    let newScale = direction > 0 ? oldScale * SCALEBY : oldScale / SCALEBY;

    if (
      this.stage.width() / newScale < SLIDE_WIDTH / 2 ||
      this.stage.width() / newScale > SLIDE_WIDTH * 2
    ) {
      return;
    }

    this.stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    this.stage.position(newPos);
  }
}

class Slide {
  transformers = [];

  constructor(history, stage) {
    this.stage = stage;
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  addCircle(id) {
    const DEFAULT_RADIUS = 150;
    const circle = new Konva.Circle({
      x: SLIDE_WIDTH / 2,
      y: SLIDE_HEIGHT / 2,
      radius: DEFAULT_RADIUS,
      fill: "black",
      draggable: true,
      id,
    });

    this.layer.add(circle);

    const tr = new Konva.Transformer();
    this.transformers.push(tr);
    this.activateTransformer(tr);
    this.layer.add(tr);
    tr.nodes([circle]);

    circle.on("click", () => this.activateTransformer(tr));

    circle.on("transformend", () => {
      console.log(circle.toJSON());
      console.log("asdf");
    });
  }

  addRect(id) {
    const DEFAULT_WIDTH = 400;
    const DEFAULT_HEIGHT = 300;
    const rect = new Konva.Rect({
      x: SLIDE_WIDTH / 2 - DEFAULT_WIDTH / 2,
      y: SLIDE_HEIGHT / 2 - DEFAULT_HEIGHT / 2,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fill: "black",
      draggable: true,
      id,
    });

    this.layer.add(rect);

    const tr = new Konva.Transformer({});
    this.transformers.push(tr);
    this.activateTransformer(tr);
    this.layer.add(tr);
    tr.nodes([rect]);

    rect.on("click", () => this.activateTransformer(tr));

    rect.on("transformend", () => {
      console.log(rect.toJSON());
      console.log("asdf");
    });
  }

  activateTransformer(tr) {
    this.transformers.forEach((tr) => tr.hide());
    tr.show();
  }

  addText(id) {
    const DEFAULT_WIDTH = 200;
    const DEFAULT_FONTSIZE = 40;
    const textNode = new Konva.Text({
      text: "Double click to edit",
      x: SLIDE_WIDTH / 2 - DEFAULT_WIDTH / 2,
      y: SLIDE_HEIGHT / 2 - DEFAULT_FONTSIZE / 2,
      fontSize: DEFAULT_FONTSIZE,
      draggable: true,
      width: DEFAULT_WIDTH,
      id,
    });

    this.layer.add(textNode);

    const tr = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ["middle-left", "middle-right"],
      // set minimum width of text
      boundBoxFunc: function (_, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    this.transformers.push(tr);
    this.activateTransformer(tr);
    textNode.on("click", () => this.activateTransformer(tr));

    textNode.on("transform", function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    this.layer.add(tr);

    textNode.on("transformend", () => {
      console.log(textNode.toJSON());
      console.log("asdf");
    });

    const handleDoubleClick = () => {
      // hide text node and transformer:
      textNode.hide();
      tr.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      let textPosition = textNode.absolutePosition();

      // so position of textarea will be the sum of positions above:
      let areaPosition = {
        x: this.stage.container().offsetLeft + textPosition.x,
        y: this.stage.container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      let textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = "absolute";
      textarea.style.top = areaPosition.y + "px";
      textarea.style.left = areaPosition.x + "px";
      textarea.style.width =
        (textNode.width() - textNode.padding() * 2) * this.stage.scaleX() +
        "px";
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + "px";
      textarea.style.fontSize =
        textNode.fontSize() * this.stage.scaleX() + "px";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      let rotation = textNode.rotation();
      let transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = "auto";
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + "px";

      textarea.focus();

      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        textNode.show();
        tr.show();
        tr.forceUpdate();
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        let isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent,
        );
        let isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + "px";
      }

      textarea.addEventListener("keydown", function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener("keydown", function (e) {
        scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = "auto";
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + "px";
      });

      function handleOutsideClick(e) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
    };

    textNode.on("dblclick", () => handleDoubleClick());
    textNode.on("dbltap", () => handleDoubleClick());
  }
}

let editor;
let slide;

window.initializeKonva = () => {
  editor = new Editor("slideEditorArea");
  if (!editor) {
    console.error("Editor is not initialized");
    return;
  }

  // delete
  slide = new Slide({}, editor.stage);
};

window.addRect = () => {
  if (!slide) {
    console.error("No slide selected");
    return;
  }
  slide.addRect();
};

window.addText = () => {
  if (!slide) {
    console.error("No slide selected");
    return;
  }
  slide.addText();
};

window.addCircle = () => {
  if (!slide) {
    console.error("No slide selected");
    return;
  }
  slide.addCircle();
};

window.restoreSlide = (history) => {
  if (!editor) {
    console.error("Editor is not initialized");
    return;
  }
  slide = new Slide(history, editor.stage);
};

window.applyToSlide = (command) => {
  if (!slide) {
    console.error("No slide selected");
    return;
  }
  slide.execute(command);
};
