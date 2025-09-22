# 기출넷플러스

기출넷(rlcnf.net)에서 문제플이/속성암기 기능 이용 시 단축키와 편의기능을 사용할 수 있게 해주는 스크립트입니다.
![demo](./demo.gif)

## 기능

### 키보드 단축키

- 키보드 `1`, `2`, `3`, `4`번을 눌러 보기를 선택할 수 있습니다.
- 키보드 `E`를 눌러 뒤로 갈 수 있습니다.
- 키보드 `R`을 눌러 채점하고, 다시 눌러 다음 문제로 갈 수 있습니다.
  - 속성암기 모드일 때는 한 번만 누르면 다음 문제로 갑니다.

### 자동화 기능

- **자동 상세 풀이 보기**: 페이지 로드 시 자동으로 상세 풀이를 펼쳐줍니다.
- **좌우 나란히 보기**: 문제와 풀이를 좌우로 나란히 배치하여 비교하며 학습할 수 있습니다.
  - 드래그로 좌우 패널 크기 조절 가능 (20%-80% 범위)
- **문제 영역으로 자동 스크롤**: 페이지 로드 시 자동으로 문제 영역으로 스크롤합니다.

### 설정 패널

화면 우하단의 설정 아이콘(⚙️)에 마우스를 올리면 각 기능을 개별적으로 ON/OFF 할 수 있습니다.

## 설치하는 법

> 이 프로그램은 UserScript입니다. Tampermonkey나 이에 준하는 UserScript 확장을 설치해야만 사용할 수 있습니다.

1. Tampermonkey 확장을 설치
   - [이 링크](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ko)에서 설치하실 수 있습니다.
2. 확장 프로그램 개발자 모드 ON
   - Chrome은 주소창에 `chrome://extensions/` 입력하고
   - Edge는 주소창에 `edge://extensions/` 입력하고
   - "개발자 모드" 스위치를 켜주시면 됩니다.
     - [왜 켜야 하나요?(영문)](https://www.tampermonkey.net/faq.php?locale=en#Q209)
3. 이 스크립트 설치
   - [이 링크](https://greasyfork.org/en/scripts/549136-%EA%B8%B0%EC%B6%9C%EB%84%B7-%EC%86%8D%EC%84%B1%EC%95%94%EA%B8%B0-%EB%8B%A8%EC%B6%95%ED%82%A4)에서 `Install this script` 버튼 클릭
4. 설치 완료!
