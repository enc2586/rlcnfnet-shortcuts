// ==UserScript==
// @name         기출넷 속성암기 단축키
// @namespace    http://tampermonkey.net/
// @version      1.1
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
  let autoExplanationEnabled = true;

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
        .auto-explanation-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 10000;
        }
        .auto-explanation-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .toggle-switch {
            position: relative;
            width: 36px;
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .toggle-switch.active {
            background: #374151;
        }
        .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: white;
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.active .toggle-slider {
            transform: translateX(16px);
        }
        .toggle-label {
            color: #374151;
            font-size: 13px;
            font-weight: 500;
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
    nIcon.textContent = "R";
    nextButton.append(nIcon);

    const bIcon = document.createElement("span");
    bIcon.className = "kb-icon";
    bIcon.textContent = "E";

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

    prevButton.textContent = "뒤로가기";
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

  function checkAndClickExplanationButton() {
    if (!autoExplanationEnabled) return;

    const explanationButton = document.querySelector("#more-explanation-btn");
    if (explanationButton && isElementVisible(explanationButton)) {
      explanationButton.click();
    }
  }

  function createTogglePopup() {
    const popup = document.createElement("div");
    popup.className = "auto-explanation-popup";
    popup.innerHTML = `
      <div class="auto-explanation-toggle">
        <span class="toggle-label">자동 상세 풀이 보기</span>
        <div class="toggle-switch ${
          autoExplanationEnabled ? "active" : ""
        }" id="explanation-toggle">
          <div class="toggle-slider"></div>
        </div>
      </div>
    `;

    const toggleSwitch = popup.querySelector("#explanation-toggle");
    toggleSwitch.addEventListener("click", () => {
      autoExplanationEnabled = !autoExplanationEnabled;
      toggleSwitch.classList.toggle("active", autoExplanationEnabled);
      localStorage.setItem("autoExplanationEnabled", autoExplanationEnabled);
    });

    document.body.appendChild(popup);
  }

  function initAutoExplanation() {
    const saved = localStorage.getItem("autoExplanationEnabled");
    if (saved !== null) {
      autoExplanationEnabled = saved === "true";
    }

    createTogglePopup();

    const observer = new MutationObserver(() => {
      checkAndClickExplanationButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    checkAndClickExplanationButton();
  }

  console.log(`
키보드 단축키가 로드되었습니다:
- R: 다음문제
- E: 뒤로가기
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
      case "r":
      case "R":
      case "ㄱ":
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

      case "e":
      case "E":
      case "ㄷ":
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
  initAutoExplanation();
})();
