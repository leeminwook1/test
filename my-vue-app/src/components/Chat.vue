<template>
  <div class="chat-container">
    <!-- 채팅방 헤더 -->
    <div class="chat-header">
      <div class="chat-header-content">
        <div class="ai-avatar">AI</div>
        <div class="chat-info">
          <h2>Gemini AI 챗봇</h2>
          <p>온라인</p>
        </div>
      </div>
      <button class="new-chat-btn" @click="startNewChat">
        <span>새 대화</span>
      </button>
    </div>

    <!-- 채팅 메시지 영역 -->
    <div class="chat-messages" ref="messageContainer">
      <div class="messages-wrapper">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'message-container',
            msg.sender === '나' ? 'user-message' : 'ai-message',
          ]"
        >
          <!-- AI 메시지 -->
          <template v-if="msg.sender !== '나'">
            <div class="message-avatar">AI</div>
            <div class="message-content">
              <div class="message-bubble">{{ msg.text }}</div>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </template>

          <!-- 사용자 메시지 -->
          <template v-else>
            <div class="message-content">
              <div class="message-bubble">{{ msg.text }}</div>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div class="message-avatar user">나</div>
          </template>
        </div>
      </div>
    </div>

    <!-- 메시지 입력 영역 -->
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
        :disabled="loading"
      />
      <button @click="sendMessage" :disabled="loading">
        <span>전송</span>
        <div v-if="loading" class="loading-spinner"></div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newMessage: "",
      messages: [],
      loading: false,
      API_KEY: "you_API",
      API_URL:
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    };
  },
  mounted() {
    this.messages.push({
      sender: "AI",
      text: "안녕하세요! 저는 Gemini AI 챗봇입니다. 무엇을 도와드릴까요?",
      timestamp: new Date(),
    });
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    startNewChat() {
      if (this.messages.length > 1) {
        if (confirm("새로운 대화를 시작하시겠습니까?")) {
          this.messages = [
            {
              sender: "AI",
              text: "안녕하세요! 저는 Gemini AI 챗봇입니다. 무엇을 도와드릴까요?",
              timestamp: new Date(),
            },
          ];
        }
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          sender: "나",
          text: this.newMessage,
          timestamp: new Date(),
        });
        const userMsg = this.newMessage;
        this.newMessage = "";
        this.loading = true;
        this.scrollToBottom();

        try {
          const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: userMsg,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
              ],
            }),
          });

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error.message);
          }

          const aiResponse = data.candidates[0].content.parts[0].text;
          this.messages.push({
            sender: "AI",
            text: aiResponse || "죄송합니다. 응답을 생성하지 못했습니다.",
            timestamp: new Date(),
          });
          this.scrollToBottom();
        } catch (error) {
          console.error("AI 응답 에러:", error);
          this.messages.push({
            sender: "AI",
            text: "죄송합니다. API 응답에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
            timestamp: new Date(),
          });
          this.scrollToBottom();
        } finally {
          this.loading = false;
        }
      }
    },
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
    },
  },
};
</script>
