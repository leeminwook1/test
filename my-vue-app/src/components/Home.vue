<template>
  <div class="container">
    <section class="section hero-section">
      <h1 class="section-title">AI 챗봇 서비스</h1>
      <p class="hero-subtitle">24시간 언제든지 도움을 받을 수 있는 AI 비서</p>
      <div class="grid grid-3">
        <div class="card animate-fade-in-up">
          <div class="icon">💬</div>
          <h3>실시간 대화</h3>
          <p>언제든지 즉각적인 응답을 받아보세요</p>
        </div>
        <div class="card animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="icon">🎯</div>
          <h3>정확한 답변</h3>
          <p>AI 기술로 정확하고 신뢰할 수 있는 정보를 제공합니다</p>
        </div>
        <div class="card animate-fade-in-up" style="animation-delay: 0.4s">
          <div class="icon">⚡</div>
          <h3>빠른 응답</h3>
          <p>몇 초 만에 답변을 받아보세요</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">실시간 서비스 현황</h2>
      <div class="stats-grid">
        <div
          class="stat-card animate-fade-in-up"
          v-for="(stat, index) in stats"
          :key="index"
        >
          <div class="icon">{{ stat.icon }}</div>
          <div
            class="stat-value"
            :class="{ counting: true }"
            :data-target="stat.value"
          >
            {{ stat.value }}
          </div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trend">
            {{ stat.trend === "up" ? "↑" : "↓" }} {{ stat.change }}%
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">실시간 인기 질문</h2>
      <div class="trending-list">
        <div
          class="trending-item animate-fade-in-up"
          v-for="(item, index) in trendingQuestions"
          :key="index"
        >
          <span class="trending-number">{{ index + 1 }}</span>
          <div class="trending-content">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
            <div class="trending-meta">
              <span class="trending-views">{{ item.views }} 조회</span>
              <span class="trending-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">사용자 후기</h2>
      <div class="testimonials-carousel">
        <div
          class="testimonial-card animate-fade-in-up"
          v-for="(testimonial, index) in testimonials"
          :key="index"
        >
          <div class="testimonial-content">
            <div class="testimonial-rating">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ filled: n <= testimonial.rating }"
                >★</span
              >
            </div>
            <p class="testimonial-text">{{ testimonial.text }}</p>
            <div class="testimonial-author">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="author-avatar"
              />
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      stats: [
        { value: "98%", label: "정확도", trend: "up" },
        { value: "24/7", label: "가용성", trend: "up" },
        { value: "10K+", label: "사용자", trend: "up" },
      ],
      trendingQuestions: [
        { id: 1, question: "AI 챗봇이 어떻게 작동하나요?", views: 1234 },
        { id: 2, question: "다국어 지원이 가능한가요?", views: 987 },
        { id: 3, question: "보안은 어떻게 유지되나요?", views: 876 },
      ],
      testimonials: [
        {
          id: 1,
          text: "정말 놀라운 서비스입니다! AI 챗봇의 응답 속도와 정확도가 인상적이었어요.",
          name: "김철수",
          title: "개발자",
          rating: 5,
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        {
          id: 2,
          text: "매우 만족스러운 경험이었습니다. 특히 다국어 지원이 정말 유용했어요.",
          name: "이영희",
          title: "디자이너",
          rating: 5,
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        {
          id: 3,
          text: "생산성이 크게 향상되었습니다. 복잡한 질문에도 정확한 답변을 제공해주네요.",
          name: "박지민",
          title: "마케터",
          rating: 4,
          avatar: "https://i.pravatar.cc/150?img=3",
        },
      ],
    };
  },
  mounted() {
    this.animateNumbers();
  },
  methods: {
    animateNumbers() {
      const elements = document.querySelectorAll(".counting");
      elements.forEach((element) => {
        const target = parseInt(element.getAttribute("data-target"));
        const duration = 2000; // 2초
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateNumber = () => {
          current += step;
          if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateNumber);
          } else {
            element.textContent = target.toLocaleString();
          }
        };

        updateNumber();
      });
    },
  },
};
</script>
