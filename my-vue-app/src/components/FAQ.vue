<template>
  <div class="container">
    <section class="section">
      <h2 class="section-title">자주 묻는 질문</h2>
      <p class="hero-subtitle">서비스 이용 중 궁금하신 점을 확인하세요</p>
    </section>

    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="질문을 검색해보세요..."
        class="input"
        @input="handleSearch"
      />
    </div>

    <div class="category-buttons">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-btn"
        :class="{ active: selectedCategory === category.id }"
        @click="filterByCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="faq-list">
      <div
        v-for="(item, index) in filteredFAQs"
        :key="index"
        class="faq-item"
        :class="{ expanded: expandedItem === index }"
      >
        <div class="faq-question" @click="toggleItem(index)">
          <h3>{{ item.question }}</h3>
          <span class="toggle-icon">{{
            expandedItem === index ? "−" : "+"
          }}</span>
        </div>
        <div v-if="expandedItem === index" class="faq-answer">
          <p>{{ item.answer }}</p>
          <div class="faq-actions">
            <button class="btn btn-secondary" @click="copyToClipboard(item)">
              복사하기
            </button>
            <button class="btn btn-secondary" @click="shareFAQ(item)">
              공유하기
            </button>
            <div class="feedback-buttons">
              <button
                class="btn btn-icon"
                :class="{ active: item.feedback === 'helpful' }"
                @click="submitFeedback(item, 'helpful')"
              >
                👍
              </button>
              <button
                class="btn btn-icon"
                :class="{ active: item.feedback === 'not-helpful' }"
                @click="submitFeedback(item, 'not-helpful')"
              >
                👎
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="related-questions" v-if="relatedQuestions.length > 0">
      <h3 class="section-title">관련 질문</h3>
      <div class="related-list">
        <div
          v-for="(question, index) in relatedQuestions"
          :key="index"
          class="related-item"
          @click="navigateToFAQ(question)"
        >
          <h4>{{ question.question }}</h4>
          <p>{{ question.answer.substring(0, 100) }}...</p>
        </div>
      </div>
    </div>

    <div class="suggestion-section">
      <h3 class="section-title">원하는 답변을 찾지 못하셨나요?</h3>
      <div class="suggestion-form">
        <textarea
          v-model="newQuestion"
          placeholder="궁금하신 점을 입력해주세요..."
          class="input"
        ></textarea>
        <button
          class="btn btn-primary"
          @click="submitNewQuestion"
          :disabled="!newQuestion"
        >
          질문하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQ",
  data() {
    return {
      searchQuery: "",
      selectedCategory: "all",
      expandedItem: null,
      newQuestion: "",
      categories: [
        { id: "all", name: "전체" },
        { id: "general", name: "일반" },
        { id: "technical", name: "기술" },
        { id: "account", name: "계정" },
        { id: "billing", name: "결제" },
      ],
      faqs: [
        {
          id: 1,
          category: "general",
          question: "AI 챗봇은 어떻게 작동하나요?",
          answer:
            "최신 자연어 처리 기술을 활용하여 사용자의 질문을 이해하고 적절한 답변을 제공합니다.",
          feedback: null,
        },
        {
          id: 2,
          category: "billing",
          question: "서비스 이용 요금은 어떻게 되나요?",
          answer:
            "기본 요금제와 프리미엄 요금제가 있으며, 사용량에 따라 선택하실 수 있습니다.",
          feedback: null,
        },
        {
          id: 3,
          category: "account",
          question: "계정을 어떻게 생성하나요?",
          answer:
            "홈페이지의 '회원가입' 버튼을 클릭하여 이메일 주소와 비밀번호를 입력하면 계정을 생성할 수 있습니다. 소셜 로그인(Google, GitHub)도 지원합니다.",
          feedback: null,
        },
      ],
      expandedFaqs: new Set(),
    };
  },
  computed: {
    filteredFAQs() {
      return this.faqs.filter((faq) => {
        const matchesSearch =
          faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          this.selectedCategory === "all" ||
          faq.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
    relatedQuestions() {
      if (!this.searchQuery && this.selectedCategory === "all") return [];
      return this.filteredFAQs.slice(0, 3);
    },
  },
  methods: {
    handleSearch() {
      this.expandedItem = null;
    },
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.expandedItem = null;
    },
    toggleItem(index) {
      if (this.expandedFaqs.has(this.filteredFAQs[index].id)) {
        this.expandedFaqs.delete(this.filteredFAQs[index].id);
      } else {
        this.expandedFaqs.add(this.filteredFAQs[index].id);
      }
    },
    copyToClipboard(item) {
      const text = `Q: ${item.question}\nA: ${item.answer}`;
      navigator.clipboard.writeText(text).then(() => {
        alert("클립보드에 복사되었습니다.");
      });
    },
    shareFAQ(item) {
      if (navigator.share) {
        navigator.share({
          title: item.question,
          text: item.answer,
          url: window.location.href,
        });
      } else {
        this.copyToClipboard(item);
      }
    },
    submitFeedback(item, type) {
      item.feedback = type;
      console.log(
        `FAQ ${item.id}에 대한 피드백: ${
          type === "helpful" ? "도움됨" : "도움안됨"
        }`
      );
    },
    navigateToFAQ(question) {
      const index = this.faqs.findIndex(
        (item) => item.question === question.question
      );
      if (index !== -1) {
        this.expandedItem = index;
      }
    },
    submitNewQuestion() {
      if (!this.newQuestion) return;
      console.log("새 질문 제출:", this.newQuestion);
      this.newQuestion = "";
      alert("질문이 제출되었습니다. 빠른 시일 내에 답변 드리겠습니다.");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.section {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 2rem auto;
}

.input {
  width: 100%;
  padding: 1.25rem 3rem 1.25rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: white;
}

.input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.category-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0 3rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 2rem;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.category-btn.active {
  background: var(--primary-color);
  color: white;
}

.faq-list {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.faq-item {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.faq-question {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color);
  line-height: 1.5;
}

.toggle-icon {
  font-size: 1.5rem;
  color: #64748b;
  transition: transform 0.3s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq-answer {
  padding: 0 2rem 2rem;
  color: #475569;
  line-height: 1.8;
}

.faq-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.feedback-buttons {
  display: flex;
  gap: 1rem;
}

.btn-icon {
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.btn-icon.active {
  opacity: 1;
  color: var(--primary-color);
}

.related-questions {
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid #e2e8f0;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.related-item {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.related-item h4 {
  margin: 0 0 1rem;
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.5;
}

.related-item p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.suggestion-section {
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.suggestion-form {
  max-width: 600px;
  margin: 2rem auto 0;
}

.suggestion-textarea {
  width: 100%;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  resize: vertical;
  margin-bottom: 1.5rem;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  min-height: 150px;
}

.suggestion-textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  padding: 1rem 2.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:disabled {
  background: #e2e8f0;
  cursor: not-allowed;
}

.btn-primary:not(:disabled):hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .category-buttons {
    gap: 0.75rem;
    margin: 1.5rem 0 2rem;
  }

  .category-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .faq-question {
    padding: 1.25rem 1.5rem;
  }

  .faq-answer {
    padding: 0 1.5rem 1.5rem;
  }

  .related-list {
    grid-template-columns: 1fr;
  }

  .suggestion-form {
    padding: 0 1rem;
  }
}
</style>
