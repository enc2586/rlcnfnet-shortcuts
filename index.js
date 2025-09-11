// ==UserScript==
// @name         기출넷 속성암기 단축키
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  기출넷(rlcnf.net)에서 속성암기 기능 이용 시 단축키를 사용할 수 있게 해주는 스크립트입니다.
// @author       enc2586, Google Gemini
// @match        https://rlcnf.net/bbs/board.php?bo_table=*
// @match        http://rlcnf.net/bbs/board.php?bo_table=*
// @match        https://rlcnf.net/bbs/board.php*
// @match        http://rlcnf.net/bbs/board.php*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  let lastClickTime = 0;
  let lastBackTime = 0;
  const CLICK_COOLDOWN = 500;
  const BACK_COOLDOWN = 1000;

  const customCSS = `
        .kb-icon {
            display: inline-block;
            background-color: transparent;
            border: 1px solid #888;
            color: #555;
            box-shadow: none;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            font-family: 'Arial', sans-serif;
            margin-left: 9px;
            vertical-align: middle;
            position: relative;
            top: -1px;
        }
        .btn-container-flex {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
        }
    `;

  function addGlobalStyle(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = css;
      head.appendChild(style);
    }
  }

  function setupUI() {
    const nextButton = document.querySelector("#scoring");
    if (!nextButton) return;

    const container = nextButton.parentElement;
    if (!container || !container.classList.contains("text-center")) return;

    container.classList.add("btn-container-flex");

    const nIcon = document.createElement("span");
    nIcon.className = "kb-icon";
    nIcon.textContent = "N";
    nextButton.append(nIcon);

    const bIcon = document.createElement("span");
    bIcon.className = "kb-icon";
    bIcon.textContent = "B";

    const prevButton = document.createElement("span");
    prevButton.id = "prev-problem-btn";

    const classesToCopy = Array.from(nextButton.classList).filter(
      (cls) => cls !== "trans-bg-crimson"
    );
    prevButton.className = classesToCopy.join(" ");

    prevButton.style.cursor = "pointer";

    prevButton.style.setProperty(
      "background-color",
      "transparent",
      "important"
    );
    prevButton.style.setProperty("color", "#000", "important");
    prevButton.style.setProperty("border", "none", "important");
    prevButton.style.setProperty("opacity", "1", "important");

    prevButton.textContent = "이전문제";
    prevButton.append(bIcon);

    prevButton.addEventListener("click", () => {
      const currentTime = Date.now();
      if (currentTime - lastBackTime >= BACK_COOLDOWN) {
        window.history.back();
        lastBackTime = currentTime;
      }
    });

    container.insertBefore(prevButton, nextButton);
  }

  console.log(`
키보드 단축키가 로드되었습니다:
- N: 다음문제
- B: 이전문제
    `);

  function isInInputField() {
    const activeElement = document.activeElement;
    if (!activeElement) return false;
    const tagName = activeElement.tagName.toUpperCase();
    const isContentEditable =
      activeElement.isContentEditable ||
      activeElement.getAttribute("contentEditable") === "true";
    return (
      ["INPUT", "TEXTAREA", "SELECT"].includes(tagName) || isContentEditable
    );
  }

  function isModalOpen() {
    const modalSelectors = [".modal", ".popup", ".dialog", '[role="dialog"]'];
    return modalSelectors.some((selector) => {
      const element = document.querySelector(selector);
      return element && (element.offsetWidth > 0 || element.offsetHeight > 0);
    });
  }

  function isElementVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return !(
      el.offsetParent === null ||
      style.display === "none" ||
      style.visibility === "hidden"
    );
  }

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
      return;
    if (isInInputField()) return;
    if (isModalOpen()) return;

    const currentTime = Date.now();
    let actionTaken = false;

    switch (event.key) {
      case "n":
      case "N":
      case "ㅜ":
        if (currentTime - lastClickTime < CLICK_COOLDOWN) break;
        const scoringButton = document.querySelector("#scoring");
        if (!scoringButton) {
          break;
        }
        if (!isElementVisible(scoringButton)) {
          break;
        }
        scoringButton.click();
        lastClickTime = currentTime;
        actionTaken = true;
        break;

      case "b":
      case "B":
      case "ㅠ":
        if (currentTime - lastBackTime < BACK_COOLDOWN) break;
        window.history.back();
        lastBackTime = currentTime;
        actionTaken = true;
        break;
    }

    if (actionTaken) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  addGlobalStyle(customCSS);
  setupUI();
})();
