<template>
  <div class="app-container">
    <nav class="main-nav">
      <div class="nav-logo">AI 챗봇</div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">홈</router-link>
        <router-link to="/examples" class="nav-link">사용 예시</router-link>
        <router-link to="/technology" class="nav-link">AI 기술</router-link>
        <router-link to="/faq" class="nav-link">FAQ</router-link>
        <router-link to="/feedback" class="nav-link">피드백</router-link>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- 채팅 아이콘 -->
    <div class="chat-icon" @click="toggleChat" :class="{ active: isChatOpen }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        ></path>
      </svg>
      <span class="notification-dot" v-if="hasNewMessage"></span>
    </div>

    <!-- 채팅 컴포넌트 -->
    <div class="chat-widget" :class="{ open: isChatOpen }">
      <Chat @new-message="handleNewMessage" />
    </div>
  </div>
</template>

<script>
import Chat from "./components/Chat.vue";

export default {
  name: "App",
  components: {
    Chat,
  },
  data() {
    return {
      isChatOpen: false,
      hasNewMessage: false,
    };
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.hasNewMessage = false;
      }
    },
    handleNewMessage() {
      if (!this.isChatOpen) {
        this.hasNewMessage = true;
      }
    },
  },
};
</script>
