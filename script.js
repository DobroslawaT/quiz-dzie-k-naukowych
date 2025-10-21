const draggableContainer = document.getElementById("draggables");
const dropzones = document.querySelectorAll(".dropzone");
const isMobile = window.matchMedia("(max-width: 600px)").matches;
function makeDraggable(el) {
  el.setAttribute("draggable", "true");
  el.style.cursor = "grab";
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", el.id);
  });
}
if (!isMobile) {
  document.querySelectorAll(".draggable").forEach(makeDraggable);
  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("hovered");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("hovered");
    });
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("hovered");
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedEl = document.getElementById(draggedId);
      if (draggedEl.parentElement) {
        draggedEl.parentElement.removeChild(draggedEl);
      }
      const existing = zone.querySelector(".draggable");
      if (existing) {
        draggableContainer.appendChild(existing);
      }
      zone.innerHTML = "";
      zone.appendChild(draggedEl);
      zone.setAttribute("data-dropped", draggedId);
      makeDraggable(draggedEl);
    });
  });
  draggableContainer.addEventListener("dragover", (e) => e.preventDefault());
  draggableContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);
    dropzones.forEach((zone) => {
      if (zone.getAttribute("data-dropped") === draggedId) {
        zone.innerHTML = "";
        zone.removeAttribute("data-dropped");
        zone.classList.remove("correct", "incorrect");
      }
    });
    if (!draggableContainer.contains(draggedEl)) {
      draggableContainer.appendChild(draggedEl);
      makeDraggable(draggedEl);
    }
  });
}
if (isMobile) {
  document.querySelectorAll(".draggable").forEach((el) => {
    let touchEl = null;
    let scrollInterval = null;
    let isScrolling = false;
    el.addEventListener("touchstart", (e) => {
      if (isDragging) return;
      isDragging = true;

      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      touchEl = el.cloneNode(true);
      touchEl.id = el.id;
      touchEl.classList.add("dragging");
      touchEl.style.position = "absolute";
      touchEl.style.width = `${rect.width}px`;
      touchEl.style.height = `${rect.height}px`;
      touchEl.style.left = `${touch.pageX - rect.width / 2}px`;
      touchEl.style.top = `${touch.pageY - rect.height / 2}px`;
      touchEl.style.zIndex = 1000;
      touchEl.style.pointerEvents = "none";
      document.body.appendChild(touchEl);
      document.body.style.overflow = "hidden";
    });
    el.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      if (touchEl) {
        touchEl.style.left = `${touch.pageX - rect.width / 2}px`;
        touchEl.style.top = `${touch.pageY - rect.height / 2}px`;
      }
      const buffer = 50;
      const scrollSpeed = 5;
      if (touch.pageY < buffer && !isScrolling) {
        isScrolling = true;
        scrollInterval = setInterval(() => {
          window.scrollBy(0, -scrollSpeed);
        }, 30);
      } else if (touch.pageY > window.innerHeight - buffer && !isScrolling) {
        isScrolling = true;
        scrollInterval = setInterval(() => {
          window.scrollBy(0, scrollSpeed);
        }, 30);
      } else if (
        touch.pageY >= buffer &&
        touch.pageY <= window.innerHeight - buffer
      ) {
        isScrolling = false;
        clearInterval(scrollInterval);
      }
    });
    el.addEventListener("touchend", (e) => {
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
        if (existing) {
          draggableContainer.appendChild(existing);
        }
        dropTarget.innerHTML = "";
        dropTarget.appendChild(el);
        dropTarget.setAttribute("data-dropped", el.id);
      } else {
        draggableContainer.appendChild(el);
      }
    });
  });
}
document.getElementById("checkBtn").addEventListener("click", () => {
  let score = 0;
  dropzones.forEach((zone) => {
    zone.classList.remove("correct", "incorrect");
    const expected = zone.getAttribute("data-accept");
    const actual = zone.getAttribute("data-dropped");
    if (expected === actual) {
      zone.classList.add("correct");
      score++;
    } else {
      zone.classList.add("incorrect");
    }
  });
  document.getElementById("score").textContent = `Twój wynik: ${score} / 7`;
});
