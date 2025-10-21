const draggableContainer = document.getElementById("draggables");
const dropzones = Array.from(document.querySelectorAll(".dropzone"));
const isMobile = window.matchMedia("(max-width: 600px)").matches;

// Global flag used by both desktop and mobile handlers
let isDragging = false;

function makeDraggable(el) {
  el.setAttribute("draggable", "true");
  el.style.cursor = "grab";
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", el.id);
  });
}

function clearZone(zone) {
  zone.innerHTML = "";
  zone.removeAttribute("data-dropped");
  zone.classList.remove("correct", "incorrect", "hovered");
}

function handleDesktopDrop(zone, e) {
  e.preventDefault();
  zone.classList.remove("hovered");
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedEl = document.getElementById(draggedId);
  if (!draggedEl) return;

  // If zone already has an element, move it back to container
  const existing = zone.querySelector(".draggable");
  if (existing) {
    draggableContainer.appendChild(existing);
  }

  // Place dragged element into zone
  zone.innerHTML = "";
  zone.appendChild(draggedEl);
  zone.dataset.dropped = draggedId;
  makeDraggable(draggedEl);
}

function initDesktopDragDrop() {
  document.querySelectorAll(".draggable").forEach(makeDraggable);

  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("hovered");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("hovered"));
    zone.addEventListener("drop", (e) => handleDesktopDrop(zone, e));
  });

  draggableContainer.addEventListener("dragover", (e) => e.preventDefault());
  draggableContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);
    if (!draggedEl) return;

    // Remove dragged reference from any zone that had it
    dropzones.forEach((zone) => {
      if (zone.dataset.dropped === draggedId) {
        clearZone(zone);
      }
    });

    if (!draggableContainer.contains(draggedEl)) {
      draggableContainer.appendChild(draggedEl);
      makeDraggable(draggedEl);
    }
  });
}

function initMobileDragDrop() {
  document.querySelectorAll(".draggable").forEach((el) => {
    let touchEl = null;
    let scrollInterval = null;
    let isScrolling = false;

    function startTouch(e) {
      if (isDragging) return;
      isDragging = true;
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();

      touchEl = el.cloneNode(true);
      touchEl.id = el.id + "-touch"; // ensure unique id for cloned helper
      touchEl.classList.add("dragging");
      Object.assign(touchEl.style, {
        position: "absolute",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        left: `${touch.pageX - rect.width / 2}px`,
        top: `${touch.pageY - rect.height / 2}px`,
        zIndex: 1000,
        pointerEvents: "none",
      });
      document.body.appendChild(touchEl);
      document.body.style.overflow = "hidden";
    }

    function moveTouch(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      if (touchEl) {
        touchEl.style.left = `${touch.pageX - rect.width / 2}px`;
        touchEl.style.top = `${touch.pageY - rect.height / 2}px`;
      }

      // Auto-scroll when near viewport edges
      const buffer = 50;
      const scrollSpeed = 5;
      if (touch.pageY < buffer && !isScrolling) {
        isScrolling = true;
        scrollInterval = setInterval(
          () => window.scrollBy(0, -scrollSpeed),
          30
        );
      } else if (touch.pageY > window.innerHeight - buffer && !isScrolling) {
        isScrolling = true;
        scrollInterval = setInterval(() => window.scrollBy(0, scrollSpeed), 30);
      } else if (
        touch.pageY >= buffer &&
        touch.pageY <= window.innerHeight - buffer
      ) {
        isScrolling = false;
        clearInterval(scrollInterval);
      }
    }

    function endTouch(e) {
      isDragging = false;
      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );

      if (touchEl) {
        touchEl.remove();
        touchEl = null;
      }
      clearInterval(scrollInterval);
      isScrolling = false;
      document.body.style.overflow = "";

      if (dropTarget && dropTarget.classList.contains("dropzone")) {
        const existing = dropTarget.querySelector(".draggable");
        if (existing) draggableContainer.appendChild(existing);
        dropTarget.innerHTML = "";
        dropTarget.appendChild(el);
        dropTarget.dataset.dropped = el.id;
      } else {
        draggableContainer.appendChild(el);
      }
    }

    el.addEventListener("touchstart", startTouch);
    el.addEventListener("touchmove", moveTouch, { passive: false });
    el.addEventListener("touchend", endTouch);
  });
}

// Initialize appropriate handlers
if (!isMobile) initDesktopDragDrop();
if (isMobile) initMobileDragDrop();

document.getElementById("checkBtn").addEventListener("click", () => {
  let score = 0;
  const total = dropzones.length;
  dropzones.forEach((zone) => {
    zone.classList.remove("correct", "incorrect");
    const expected = zone.dataset.accept;
    const actual = zone.dataset.dropped || null;
    if (expected === actual) {
      zone.classList.add("correct");
      score++;
    } else {
      zone.classList.add("incorrect");
    }
  });
  document.getElementById(
    "score"
  ).textContent = `Twój wynik: ${score} / ${total}`;
});
