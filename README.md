<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quiz Języki Programowania</title>
  <style>
    :root {
     --base-font-size: 16px;
    }
    body {
      font-size: var(--base-font-size);
    }
    h2 {
      text-align: center;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
    }
    .draggable {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 10px;
      border-radius: 8px;
      cursor: grab;
      width: 250px;
      font-size: 14px;
      white-space: pre-wrap;
      user-select: none;
    }
    .quiz-grid {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap; /* Prevent wrapping */
      overflow-x: auto;   /* Allow horizontal scroll if needed */
      -webkit-overflow-scrolling: touch;
      gap: 0px;
      margin: 0 auto;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 0px; /* No vertical gap between label and dropzone */
      flex: 1 1 45%;
      min-width: 150px;
      max-width: 300px;
      box-sizing: border-box;
    }
    .label, .dropzone {
      width: 100%;
      font-size: clamp(13px, 2vw, 16px); /* Responsive font size */
    }
    .labels .label {
      font-weight: bold;
      padding: 10px;
      background: #f0f0f0;
      border-radius: 6px;
      width: 200px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .dropzones .dropzone {
      border: 2px dashed #ccc;
      border-radius: 0 0 6px 6px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: auto;
      min-height: 60px;
      max-width: 200px;
    }
    .dropzone.hovered {
      border-color: #4a90e2;
      background: #e6f0ff;
    }
    .correct {
      border-color: green !important;
      background-color: #e0ffe0 !important;
    }
    .incorrect {
      border-color: red !important;
      background-color: #ffe0e0 !important;
    }
    #checkBtn {
      font-size: clamp(14px, 2vw, 18px);
      padding: 10px 20px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: block;
      margin: 50px auto 30px; /* więcej przestrzeni nad i pod */
      max-width: 90%;
      text-align: center;
    }
    #score {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    @media (max-width: 900px) {
      :root {
        --base-font-size: 15px;
      }
      .draggable, .label {
        width: 45vw;
        padding: 8px;
      }
    }
    @media (max-width: 600px) {
      :root {
        --base-font-size: 14px;
      }
      .draggable, .label {
        width: 90vw;
        padding: 6px;
      }
    }

  </style>
</head>
<body>
  <h2>Połącz kod z językien programowania</h2>
  <p style="text-align:center;">Przeciągnij kod do poprawnego języka programowania.</p>

  <div class="container" id="draggables">
    <div class="draggable" draggable="true" id="python">print("Hello, world!")</div>
    <div class="draggable" draggable="true" id="javascript">console.log("Hello, world!");</div>
    <div class="draggable" draggable="true" id="java">System.out.println("Hello, world!");</div>
    <div class="draggable" draggable="true" id="csharp">Console.WriteLine("Hello, world!");</div>
    <div class="draggable" draggable="true" id="sql">SELECT * FROM users;</div>
    <div class="draggable" draggable="true" id="html">&lt;h1&gt;Hello, world!&lt;/h1&gt;</div>
    <div class="draggable" draggable="true" id="css">h1 { color: blue; }</div>
  </div>

  <div class="quiz-grid">
    <div class="column labels">
      <div class="label">Python</div>
      <div class="label">JavaScript</div>
      <div class="label">Java</div>
      <div class="label">C#</div>
      <div class="label">SQL</div>
      <div class="label">HTML</div>
      <div class="label">CSS</div>
    </div>
    <div class="column dropzones">
      <div class="dropzone" data-accept="python"></div>
      <div class="dropzone" data-accept="javascript"></div>
      <div class="dropzone" data-accept="java"></div>
      <div class="dropzone" data-accept="csharp"></div>
      <div class="dropzone" data-accept="sql"></div>
      <div class="dropzone" data-accept="html"></div>
      <div class="dropzone" data-accept="css"></div>
    </div>
  </div>

  <button id="checkBtn">Sprawdź odpowiedzi</button>
  <div id="score"></div>

  <script>
    const draggableContainer = document.getElementById('draggables');
    const dropzones = document.querySelectorAll('.dropzone');

    function makeDraggable(el) {
      el.setAttribute('draggable', 'true');
      el.style.cursor = 'grab';
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', el.id);
      });
    }

    document.querySelectorAll('.draggable').forEach(makeDraggable);

    dropzones.forEach(zone => {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('hovered');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('hovered');
      });

      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('hovered');
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedEl = document.getElementById(draggedId);

        // Remove draggedEl from its current parent
        if (draggedEl.parentElement) {
          draggedEl.parentElement.removeChild(draggedEl);
        }

        // Remove any existing child in the dropzone
        const existing = zone.querySelector('.draggable');
        if (existing) {
          draggableContainer.appendChild(existing);
        }

        zone.innerHTML = '';
        zone.appendChild(draggedEl);
        zone.setAttribute('data-dropped', draggedId);
        makeDraggable(draggedEl);
      });
    });

    draggableContainer.addEventListener('dragover', e => {
      e.preventDefault();
    });

    draggableContainer.addEventListener('drop', e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const draggedEl = document.getElementById(draggedId);

      // Remove from dropzone if needed
      dropzones.forEach(zone => {
        if (zone.getAttribute('data-dropped') === draggedId) {
          zone.innerHTML = '';
          zone.removeAttribute('data-dropped');
          zone.classList.remove('correct', 'incorrect');
        }
      });

      if (!draggableContainer.contains(draggedEl)) {
        draggableContainer.appendChild(draggedEl);
        makeDraggable(draggedEl);
      }
    });

    document.getElementById('checkBtn').addEventListener('click', () => {
      let score = 0;
      dropzones.forEach(zone => {
        zone.classList.remove('correct', 'incorrect');
        const expected = zone.getAttribute('data-accept');
        const actual = zone.getAttribute('data-dropped');
        if (expected === actual) {
          zone.classList.add('correct');
          score++;
        } else {
          zone.classList.add('incorrect');
        }
      });
      document.getElementById('score').textContent = `Twój wynik: ${score} / 7`;
    });
  </script>
</body>
</html>
