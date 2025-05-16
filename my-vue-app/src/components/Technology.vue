<template>
  <div class="container">
    <section class="section">
      <h2 class="section-title">AI 기술 소개</h2>
      <div class="grid grid-3">
        <div
          v-for="tech in technologies"
          :key="tech.id"
          class="card tech-card"
          :class="{ expanded: expandedTech === tech.id }"
          @click="toggleTech(tech.id)"
        >
          <div class="icon">{{ tech.icon }}</div>
          <h3>{{ tech.title }}</h3>
          <p>{{ tech.description }}</p>
          <div class="tech-features">
            <div
              v-for="feature in tech.features"
              :key="feature"
              class="feature"
            >
              <span class="feature-icon">✓</span>
              {{ feature }}
            </div>
          </div>
          <div v-if="expandedTech === tech.id" class="tech-details">
            <div class="performance-stats">
              <div class="stat">
                <span class="stat-label">정확도</span>
                <div class="stat-bar">
                  <div
                    class="stat-fill"
                    :style="{ width: tech.performance.accuracy + '%' }"
                  ></div>
                </div>
                <span class="stat-value">{{ tech.performance.accuracy }}%</span>
              </div>
              <div class="stat">
                <span class="stat-label">속도</span>
                <div class="stat-bar">
                  <div
                    class="stat-fill"
                    :style="{ width: tech.performance.speed + '%' }"
                  ></div>
                </div>
                <span class="stat-value">{{ tech.performance.speed }}ms</span>
              </div>
              <div class="stat">
                <span class="stat-label">지원 언어</span>
                <div class="stat-bar">
                  <div
                    class="stat-fill"
                    :style="{ width: tech.performance.languages + '%' }"
                  ></div>
                </div>
                <span class="stat-value"
                  >{{ tech.performance.languages }}개</span
                >
              </div>
            </div>
            <div class="demo-section">
              <h4>데모</h4>
              <div class="demo-input">
                <input
                  v-model="tech.demoInput"
                  type="text"
                  :placeholder="'예시: ' + tech.demoPlaceholder"
                  @keyup.enter="processDemoInput(tech)"
                />
                <button class="btn btn-primary" @click="processDemoInput(tech)">
                  실행
                </button>
              </div>
              <div v-if="tech.demoOutput" class="demo-output">
                <p>{{ tech.demoOutput }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">기술 비교</h2>
      <div class="comparison-chart">
        <div class="chart-bars">
          <div
            v-for="tech in technologies"
            :key="tech.id"
            class="chart-bar"
            :style="{
              height: tech.performance.accuracy + '%',
              backgroundColor: tech.color,
            }"
          >
            <span class="bar-label">{{ tech.title }}</span>
            <span class="bar-value">{{ tech.performance.accuracy }}%</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Technology",
  data() {
    return {
      expandedTech: null,
      technologies: [
        {
          id: 1,
          icon: "🤖",
          title: "자연어 처리",
          description: "인간의 언어를 이해하고 처리하는 AI 기술",
          features: ["텍스트 분석", "감정 분석", "문맥 이해", "다국어 지원"],
          performance: {
            accuracy: 95,
            speed: 100,
            languages: 50,
          },
          color: "#4CAF50",
          demoPlaceholder: "오늘 날씨가 어때요?",
          demoInput: "",
          demoOutput: "",
        },
        {
          id: 2,
          icon: "🧠",
          title: "머신러닝",
          description: "데이터로부터 학습하고 예측하는 AI 기술",
          features: ["패턴 인식", "예측 분석", "자동화 학습", "최적화"],
          performance: {
            accuracy: 92,
            speed: 150,
            languages: 30,
          },
          color: "#2196F3",
          demoPlaceholder: "다음 주 주가 예측",
          demoInput: "",
          demoOutput: "",
        },
        {
          id: 3,
          icon: "👁️",
          title: "컴퓨터 비전",
          description: "이미지와 비디오를 분석하는 AI 기술",
          features: ["객체 인식", "얼굴 인식", "이미지 분류", "동영상 분석"],
          performance: {
            accuracy: 88,
            speed: 200,
            languages: 20,
          },
          color: "#9C27B0",
          demoPlaceholder: "이미지에서 객체 찾기",
          demoInput: "",
          demoOutput: "",
        },
      ],
    };
  },
  methods: {
    toggleTech(id) {
      this.expandedTech = this.expandedTech === id ? null : id;
    },
    processDemoInput(tech) {
      if (!tech.demoInput.trim()) return;

      const responses = {
        1: "자연어 처리 기술로 분석한 결과: 날씨 정보를 제공할 수 없습니다. 위치 정보가 필요합니다.",
        2: "머신러닝 모델 분석 결과: 주가 예측을 위해서는 더 많은 데이터가 필요합니다.",
        3: "컴퓨터 비전 분석 결과: 이미지에서 객체를 인식하기 위해서는 이미지 파일이 필요합니다.",
      };

      tech.demoOutput = responses[tech.id];
      setTimeout(() => {
        tech.demoOutput = "";
        tech.demoInput = "";
      }, 3000);
    },
  },
};
</script>
