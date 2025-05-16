<template>
  <div class="container">
    <section class="section">
      <h2 class="section-title">AI 챗봇 예시</h2>
      <div class="category-buttons">
        <button
          v-for="category in categories"
          :key="category"
          class="category-btn"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="grid grid-3">
        <div
          v-for="example in filteredExamples"
          :key="example.title"
          class="card example-card"
          :class="{ expanded: expandedCard === example.title }"
          @click="toggleCard(example.title)"
        >
          <img
            :src="example.image"
            :alt="example.title"
            class="example-image"
          />
          <div class="example-content">
            <h3>{{ example.title }}</h3>
            <p>{{ example.description }}</p>
            <div class="tags">
              <span v-for="tag in example.tags" :key="tag" class="tag">{{
                tag
              }}</span>
            </div>
            <div class="example-actions">
              <button class="btn btn-primary" @click.stop="tryExample(example)">
                시도해보기
              </button>
              <button
                class="btn btn-secondary"
                @click.stop="shareExample(example)"
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedExample?.title }}</h3>
          <button class="btn btn-icon" @click="closeModal">×</button>
        </div>
        <div class="chat-container" style="height: 500px; max-width: 100%">
          <div class="chat-messages messages-wrapper" ref="demoMessagesEnd">
            <div
              v-for="(message, index) in demoMessages"
              :key="index"
              class="message-container"
              :class="{ 'user-message': message.type === 'user' }"
            >
              <div
                class="message-avatar"
                :class="{ user: message.type === 'user' }"
              >
                <span v-if="message.type === 'user'">👤</span>
                <span v-else>🤖</span>
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  {{ message.text }}
                </div>
                <div class="message-time">{{ formatTime(message.time) }}</div>
              </div>
            </div>
            <div v-if="isDemoLoading" class="message-container">
              <div class="message-avatar"><span>🤖</span></div>
              <div class="message-content">
                <div class="message-bubble">
                  <span class="loading-spinner"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="chat-input">
            <input
              v-model="demoInput"
              type="text"
              placeholder="메시지를 입력하세요..."
              @keyup.enter="sendDemoMessage"
              :disabled="isDemoLoading"
            />
            <button
              class="btn btn-primary"
              @click="sendDemoMessage"
              :disabled="isDemoLoading || !demoInput.trim()"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Examples",
  data() {
    return {
      selectedCategory: "전체",
      expandedCard: null,
      showModal: false,
      selectedExample: null,
      demoInput: "",
      demoMessages: [],
      categories: ["전체", "학습", "코딩", "번역"],
      examples: [
        {
          title: "학습 도우미",
          description: "복잡한 개념을 쉽게 설명해주는 AI 튜터",
          image: "https://picsum.photos/400/300?random=1",
          tags: ["학습", "교육", "튜터"],
          category: "학습",
          features: ["개념 설명", "예제 제공", "퀴즈 생성"],
        },
        {
          title: "코딩 어시스턴트",
          description: "코드 작성과 디버깅을 도와주는 AI 개발자",
          image: "https://picsum.photos/400/300?random=2",
          tags: ["코딩", "개발", "디버깅"],
          category: "코딩",
          features: ["코드 생성", "버그 수정", "최적화"],
        },
        {
          title: "번역 도우미",
          description: "자연스러운 번역을 제공하는 AI 번역가",
          image: "https://picsum.photos/400/300?random=3",
          tags: ["번역", "언어", "통역"],
          category: "번역",
          features: ["다국어 지원", "맥락 이해", "문화적 고려"],
        },
      ],
      isDemoLoading: false,
    };
  },
  computed: {
    filteredExamples() {
      if (this.selectedCategory === "전체") {
        return this.examples;
      }
      return this.examples.filter(
        (example) => example.category === this.selectedCategory
      );
    },
  },
  methods: {
    toggleCard(title) {
      this.expandedCard = this.expandedCard === title ? null : title;
    },
    tryExample(example) {
      this.selectedExample = example;
      this.showModal = true;
      this.demoMessages = [
        {
          type: "ai",
          text: `안녕하세요! ${example.title}입니다. 무엇을 도와드릴까요?`,
        },
      ];
    },
    closeModal() {
      this.showModal = false;
      this.selectedExample = null;
      this.demoMessages = [];
      this.demoInput = "";
    },
    sendDemoMessage() {
      if (!this.demoInput.trim() || this.isDemoLoading) return;
      const now = new Date();
      this.demoMessages.push({
        type: "user",
        text: this.demoInput,
        time: now,
      });
      this.isDemoLoading = true;
      const userInput = this.demoInput;
      this.demoInput = "";
      this.$nextTick(this.scrollToBottom);
      setTimeout(() => {
        this.demoMessages.push({
          type: "ai",
          text: this.getAIResponse(userInput),
          time: new Date(),
        });
        this.isDemoLoading = false;
        this.$nextTick(this.scrollToBottom);
      }, 1200);
    },
    getAIResponse(input) {
      const responses = {
        학습: "이 개념을 더 자세히 설명해드릴게요...",
        코딩: "이 코드를 개선하는 방법을 알려드릴게요...",
        번역: "이 문장을 자연스럽게 번역해드릴게요...",
      };
      return (
        responses[this.selectedExample.category] ||
        "이해했습니다. 더 자세히 설명해주세요."
      );
    },
    shareExample(example) {
      if (navigator.share) {
        navigator.share({
          title: example.title,
          text: example.description,
          url: window.location.href,
        });
      } else {
        alert("공유 기능이 지원되지 않는 브라우저입니다.");
      }
    },
    formatTime(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
    scrollToBottom() {
      const el = this.$refs.demoMessagesEnd;
      if (el && el.scrollTo) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } else if (el && el.scrollTop !== undefined) {
        el.scrollTop = el.scrollHeight;
      }
    },
  },
  watch: {
    showModal(val) {
      if (val) this.$nextTick(this.scrollToBottom);
    },
    demoMessages() {
      this.$nextTick(this.scrollToBottom);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 3rem;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.category-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
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
}

.category-btn.active {
  background: var(--primary-color);
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.example-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.example-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .example-image img {
  transform: scale(1.1);
}

.example-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.example-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.example-content p {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: var(--primary-color);
  color: white;
}

.example-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn:hover {
  transform: translateY(-2px);
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--text-color);
  transform: scale(1.1);
}

.chat-container {
  background: #f8fafc;
  border-radius: 0.5rem;
  overflow: hidden;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  max-width: 80%;
  line-height: 1.5;
}

.message.user {
  background: var(--primary-color);
  color: white;
  margin-left: auto;
}

.message.ai {
  background: white;
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-input {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.chat-input input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.chat-input input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.chat-input button {
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.chat-input button:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .example-actions {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .chat-messages {
    height: 300px;
  }

  .message {
    max-width: 90%;
  }
}
</style>
