/** The small fixed words of the interface, in every language. */
export const ui = {
  title: {
    stamp: { en: 'NASA Space Apps Challenge 2026', ko: 'NASA Space Apps Challenge 2026' },
    name: { en: 'Dancing with the SARs', ko: 'Dancing with the SARs' },
    line: { en: 'Here is what the world missed', ko: '세상이 놓친 장면이 여기 있어요' },
    choose: { en: 'Choose a language to begin', ko: '언어를 골라 시작하세요' },
  },
  chapter: { en: 'Chapter', ko: '장' },
  /** The closing card. The five actions are the team's, from the story plan. */
  ending: {
    thanks: { en: 'Thanks for exploring with me', ko: '함께 살펴봐 줘서 고마워요' },
    title: {
      en: 'A closer look can be the beginning of a safer future',
      ko: '더 가까이 보는 일이 더 안전한 미래의 시작이 될 수 있어요',
    },
    lead: { en: 'What someone like you can do', ko: '당신 같은 사람이 할 수 있는 일' },
    /** The visitor's own case, read back from src/story/caseNotes.ts. */
    briefing: {
      lead: { en: 'Your briefing', ko: '당신의 브리핑' },
      marked: { en: 'You marked', ko: '표시한 곳' },
      checked: { en: 'You checked', ko: '확인한 것' },
      chose: { en: 'You chose', ko: '고른 기준' },
      needed: { en: 'Still needed', ko: '아직 필요한 것' },
      region: { en: 'Region', ko: '지점' },
      as: {
        changed: { en: 'as a new change', ko: '새로 달라진 곳으로' },
        present: { en: 'as already there', ko: '원래 있던 것으로' },
        unclear: { en: 'as unclear', ko: '불확실한 곳으로' },
      },
      noRegion: { en: 'No region marked', ko: '표시한 지점 없음' },
      reference: {
        en: 'The reference flood map, which covers only the east of the strip',
        ko: '기준 침수 지도 (띠의 동쪽만 덮음)',
      },
      noReference: { en: 'Evidence not checked', ko: '근거를 확인하지 않음' },
      cutOff: {
        en: 'A cut-off at {delta} on {channel}: {right} in 10 flags agree, {caught} in 10 floods caught',
        ko: '{channel} {delta} 기준선: 짚은 10곳 중 {right}곳 일치, 잠긴 10곳 중 {caught}곳 발견',
      },
      noCutOff: { en: 'No cut-off chosen', ko: '기준선을 고르지 않음' },
      missing: {
        en: 'Evidence that is not radar: ground reports or cloud-free optical images',
        ko: '레이더가 아닌 근거: 현장 보고나 구름 없는 광학 영상',
      },
    },
    sources: { en: 'Data and sources', ko: '자료와 출처' },
    actions: [
      {
        name: { en: 'Know your risk', ko: '위험을 알아 두기' },
        line: { en: 'Find out if flooding could happen where you live', ko: '사는 곳에 홍수가 날 수 있는지 알아보세요' },
      },
      {
        name: { en: 'Stay informed', ko: '소식을 챙기기' },
        line: {
          en: 'Know where to find flood warnings and follow local instructions',
          ko: '홍수 경보를 어디서 확인하는지 알아 두고 지역 안내를 따르세요',
        },
      },
      {
        name: { en: 'Make a plan', ko: '계획 세우기' },
        line: {
          en: 'Talk with your family about where to go and how to stay in touch',
          ko: '어디로 갈지, 어떻게 연락할지 가족과 이야기하세요',
        },
      },
      {
        name: { en: 'Look out for others', ko: '이웃을 살피기' },
        line: {
          en: 'Share trusted information and check on people who may need help',
          ko: '믿을 수 있는 정보를 나누고 도움이 필요한 사람을 살피세요',
        },
      },
      {
        name: { en: 'Stay safe during a flood', ko: '홍수 때 안전 지키기' },
        line: {
          en: 'Follow evacuation instructions and stay out of floodwater',
          ko: '대피 안내를 따르고 물에 들어가지 마세요',
        },
      },
    ],
  },
  back: { en: 'Back', ko: '뒤로' },
  backToStart: { en: 'Back to start', ko: '처음으로' },
  continue: { en: 'Continue', ko: '계속' },
  musicOn: { en: 'Turn sound on', ko: '소리 켜기' },
  musicOff: { en: 'Turn sound off', ko: '소리 끄기' },
  scan: {
    lead: { en: 'Synthetic aperture radar', ko: '합성개구레이더(SAR)' },
    rest: { en: 'illustration over an optical photo', ko: '광학 사진 위에 그린 설명용 그림' },
    drag: { en: 'Drag the radar across', ko: '레이더를 끌어서 훑어 보세요' },
  },
  lesson: {
    yours: { en: 'Your radar', ko: '당신의 레이더' },
    fire: { en: 'Fire', ko: '발사' },
    sent: { en: 'Signal sent', ko: '보낸 신호' },
    echo: { en: 'Echo', ko: '메아리' },
    away: { en: 'Bounced away', ko: '다른 쪽으로 튕김' },
    dry: { en: 'Dry ground', ko: '마른 땅' },
    wet: { en: 'Calm water', ko: '잔잔한 물' },
    records: { en: 'What the radar records', ko: '레이더에 찍히는 모습' },
    bright: { en: 'Bright', ko: '밝음' },
    dark: { en: 'Dark', ko: '어두움' },
    before: { en: 'Before', ko: '전' },
    after: { en: 'After', ko: '후' },
    darker: { en: 'Darker than before', ko: '전보다 어두워짐' },
    alt: {
      en: 'A diagram of a radar satellite sending a signal to the ground and receiving its echo.',
      ko: '레이더 위성이 땅으로 신호를 보내고 메아리를 받는 모습을 그린 그림.',
    },
  },
  /** The cut-off chart. Figures come from src/content/histogram.ts. */
  cut: {
    axis: {
      en: 'How the radar echo changed between the two passes · each group drawn as a share of itself',
      ko: '두 촬영 사이 레이더 메아리의 변화 · 각 무리를 그 안에서의 비율로 그림',
    },
    flooded: { en: 'Newly flooded in the reference map', ko: '기준 지도에서 새로 잠긴 곳' },
    other: { en: 'Everything else', ko: '그 밖의 모든 곳' },
    pixels: { en: 'pixels', ko: '픽셀' },
    fell: { en: 'Echo fell', ko: '메아리 약해짐' },
    rose: { en: 'Echo rose', ko: '메아리 강해짐' },
    flagged: { en: 'Flagged as flooded', ko: '침수로 짚은 구간' },
    channel: { en: 'Radar channel', ko: '레이더 채널' },
    right: {
      en: 'of every 10 flagged places are flooded in the reference map',
      ko: '짚은 10곳 가운데 기준 지도에서도 잠긴 곳',
    },
    caught: { en: 'of every 10 flooded places are caught', ko: '잠긴 10곳 가운데 찾아낸 곳' },
    drag: { en: 'Drag the line', ko: '선을 움직여 보세요' },
    keep: { en: 'Keep this cut-off', ko: '이 기준선으로 정하기' },
    source: {
      en: 'Every pixel both passes cover · the reference map is Sentinel-1 too, so this is a comparison, not a validation',
      ko: '두 촬영이 모두 덮는 모든 픽셀 · 기준 지도도 Sentinel-1이라 검증이 아닌 비교입니다',
    },
    alt: {
      en: 'Two overlapping histograms of radar echo change. The orange one, for places the reference map marks newly flooded, sits to the left of the blue one for everything else, and they overlap. A vertical line marks the cut-off.',
      ko: '레이더 메아리 변화 히스토그램 두 개가 겹쳐 있다. 기준 지도에서 새로 잠긴 곳을 나타내는 주황색이 그 밖의 곳을 나타내는 파랑보다 왼쪽에 있고, 둘은 서로 겹친다. 세로선이 기준선을 나타낸다.',
    },
  },
  /** The warning-time calculation. Wording follows the solutions paper, section 4. */
  window: {
    axis: { en: 'Minutes after the flood starts, 35 km upstream', ko: '35km 상류에서 홍수가 시작된 뒤 흐른 시간(분)' },
    manualDelay: { en: 'Detect 10 + alert 5', ko: '감지 10분 + 경보 5분' },
    automaticDelay: { en: 'Detect and alert 5', ko: '감지와 경보 5분' },
    arrives: { en: 'Flood arrives', ko: '홍수 도착' },
    needed: { en: '15 min needed to get out', ko: '대피에 필요한 15분' },
    left: { en: 'left to get out', ko: '대피할 수 있는 시간' },
    enough: { en: 'Enough', ko: '충분해요' },
    short: { en: 'Just short', ko: '조금 모자라요' },
    min: { en: 'min', ko: '분' },
    speed: { en: 'If the flood moves at', ko: '홍수의 속도가 이렇다면' },
    illustrative: { en: 'Illustrative speeds, not measured in Nepal', ko: '설명용 속도이며 네팔에서 잰 값이 아닙니다' },
    automate: {
      en: 'Wire sensor, model and phone alert together',
      ko: '센서, 모델, 휴대폰 경보를 자동으로 잇기',
    },
    source: {
      en: 'Team Wave of Change · solutions paper, 14 Nov 2026',
      ko: 'Team Wave of Change · 해결책 문서, 2026년 11월 14일',
    },
    alt: {
      en: 'A timeline in minutes from the start of a flood to its arrival at a village 35 km downstream, showing the minutes lost to detecting and alerting and the minutes left to get out.',
      ko: '홍수가 시작된 순간부터 35km 하류 마을에 닿기까지를 분 단위로 그린 시간선. 감지와 경보에 쓰인 시간과 대피에 남은 시간을 보여 준다.',
    },
  },
}

/** "Chapter 2" in English, "2장" in Korean. */
export const chapterLabel = (number: number, word: string, lang: 'en' | 'ko') =>
  lang === 'ko' ? `${number}${word}` : `${word} ${number}`
