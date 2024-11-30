class Slide {
  transformers = [];
  constructor(containerId) {
    this.containerId = containerId;
    this.initializeStage();
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

    this.newCircle(400, 200);
    this.newText(0, 0);
    this.newText(500, 500);
    this.newRect(200, 400);

    this.printBorder();

    // this.stage.on("click", () => this.toJSON());
  }

  printBorder() {
    const border = new Konva.Rect({
      width: 1920,
      height: 1080,
      x: 0,
      y: 0,
      strokeWidth: 4,
      stroke: "black",
    });
    this.layer.add(border);

    border.on("click", () => {
      this.transformers.forEach((tr) => tr.hide());
    });
  }

  clear() {
    this.layer.destroyChildren();
    this.transformers = [];
    this.layer.draw();
    this.printBorder();
  }

  loadElements(elements) {
    this.clear();
    elements.forEach((el) => {
      if (el.type === "circle") {
        this.newCircle(el.x, el.y);
      } else if (el.type === "rectangle") {
        this.newRect(el.x, el.y);
      } else if (el.type === "text") {
        this.newText(el.x, el.y, el.text);
      }
    });
    this.layer.draw();
  }

  toJSON() {
    let json = this.stage.toJSON();

    console.log(json);
  }

  newCircle(x, y) {
    const circle = new Konva.Circle({
      x,
      y,
      radius: 150,
      fill: "black",
      draggable: true,
    });

    this.layer.add(circle);

    const tr = new Konva.Transformer();
    this.transformers.push(tr);
    this.layer.add(tr);
    tr.nodes([circle]);
    tr.hide();

    circle.on("click", () => {
      this.transformers.forEach((tr) => tr.hide());
      tr.show();
    });
  }

  newRect(x, y) {
    const rect = new Konva.Rect({
      x,
      y,
      width: 400,
      height: 300,
      fill: "black",
      draggable: true,
    });

    this.layer.add(rect);

    const tr = new Konva.Transformer({});
    this.transformers.push(tr);
    this.layer.add(tr);
    tr.nodes([rect]);
    tr.hide();

    rect.on("click", () => {
      this.transformers.forEach((tr) => tr.hide());
      tr.show();
    });
  }

  newText(x, y) {
    const textNode = new Konva.Text({
      text: "Double click to edit",
      x,
      y,
      fontSize: 40,
      draggable: true,
      width: 200,
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

    tr.hide();

    textNode.on("click", () => {
      this.transformers.forEach((tr) => tr.hide());
      tr.show();
    });

    textNode.on("transform", function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    this.layer.add(tr);

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
      textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + "px";
      textarea.style.fontSize = textNode.fontSize() + "px";
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

      let px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

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

    this.stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    this.stage.position(newPos);
  }
}

let slide;

window.initializeKonva = () => {
  slide = new Slide("slideEditorArea");
};

window.updateSlideElements = (elements) => {
  slide.loadElements(elements);
};
