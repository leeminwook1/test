<template>
  <div class="container">
    <section class="section">
      <h2 class="section-title">사용자 피드백</h2>
      <p class="hero-subtitle">서비스 개선을 위한 여러분의 의견을 들려주세요</p>
    </section>

    <div class="feedback-form">
      <div class="form-group">
        <label for="feedback-type">피드백 유형</label>
        <select id="feedback-type" v-model="feedbackType" class="input">
          <option value="suggestion">제안사항</option>
          <option value="bug">버그 신고</option>
          <option value="feature">기능 요청</option>
          <option value="other">기타</option>
        </select>
      </div>

      <div class="form-group">
        <label for="feedback-content">내용</label>
        <textarea
          id="feedback-content"
          v-model="feedbackText"
          placeholder="피드백 내용을 자세히 작성해주세요..."
          class="input"
          rows="5"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="feedback-email">이메일 (선택사항)</label>
        <input
          type="email"
          id="feedback-email"
          v-model="email"
          placeholder="답변을 받으실 이메일 주소"
          class="input"
        />
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="allowContact" />
          <span>추가 문의가 있을 경우 연락받기를 원합니다</span>
        </label>
      </div>

      <button
        class="btn btn-primary"
        @click="submitFeedback"
        :disabled="!feedbackText"
      >
        피드백 제출하기
      </button>
    </div>

    <div class="feedback-stats" v-if="showStats">
      <h3 class="section-title">피드백 현황</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">전체 피드백</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">{{ stats.implemented }}</div>
          <div class="stat-label">반영된 피드백</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">검토 중</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Feedback",
  data() {
    return {
      feedbackType: "suggestion",
      feedbackText: "",
      email: "",
      allowContact: false,
      showStats: true,
      stats: {
        total: 156,
        implemented: 89,
        pending: 42,
      },
    };
  },
  methods: {
    submitFeedback() {
      if (!this.feedbackText) return;

      // 피드백 제출 로직
      console.log({
        type: this.feedbackType,
        content: this.feedbackText,
        email: this.email,
        allowContact: this.allowContact,
      });

      // 폼 초기화
      this.feedbackText = "";
      this.email = "";
      this.allowContact = false;

      alert("피드백이 성공적으로 제출되었습니다. 감사합니다!");
    },
  },
};
</script>
