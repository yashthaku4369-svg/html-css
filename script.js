// ============================================================
// ChatGPT Interface Interactive Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatViewport = document.getElementById('chatViewport');
  const welcomeScreen = document.getElementById('welcomeScreen');
  const conversationStream = document.getElementById('conversationStream');
  const newChatBtn = document.getElementById('newChatBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggleClose = document.getElementById('sidebarToggleClose');
  const sidebarToggleOpen = document.getElementById('sidebarToggleOpen');
  const modelDropdownBtn = document.getElementById('modelDropdownBtn');
  const modelDropdownMenu = document.getElementById('modelDropdownMenu');
  const currentModelName = document.getElementById('currentModelName');
  const suggestionCards = document.querySelectorAll('.suggestion-card');

  // 1. Textarea auto-grow & Send Button state
  messageInput.addEventListener('input', () => {
    // Reset height to compute scrollHeight accurately
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 180) + 'px';

    const hasText = messageInput.value.trim().length > 0;
    sendBtn.disabled = !hasText;
    if (hasText) {
      sendBtn.classList.add('active');
    } else {
      sendBtn.classList.remove('active');
    }
  });

  // Handle Enter to send (Shift+Enter for newline)
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) {
        handleSendMessage();
      }
    }
  });

  sendBtn.addEventListener('click', handleSendMessage);

  // 2. Suggestion Cards Click
  suggestionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      if (prompt) {
        messageInput.value = prompt;
        messageInput.dispatchEvent(new Event('input'));
        handleSendMessage();
      }
    });
  });

  // 3. Send Message Function
  function handleSendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Hide welcome screen if visible
    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
      welcomeScreen.style.display = 'none';
    }

    // Append User Message
    appendUserMessage(text);

    // Reset textarea
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    sendBtn.classList.remove('active');

    // Scroll to bottom
    scrollToBottom();

    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    scrollToBottom();

    // Simulate ChatGPT AI response
    setTimeout(() => {
      typingIndicator.remove();
      generateSimulatedResponse(text);
      scrollToBottom();
    }, 900);
  }

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerHTML = `
      <div class="message-inner">
        <div class="message-content">
          <p>${escapeHTML(text)}</p>
        </div>
      </div>
    `;
    conversationStream.appendChild(msgDiv);
  }

  function showTypingIndicator() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot-message typing-msg';
    msgDiv.innerHTML = `
      <div class="message-inner">
        <div class="avatar-container">
          <div class="avatar bot-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.475 4.475 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.47-4.47 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
          </div>
        </div>
        <div class="message-content">
          <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
    conversationStream.appendChild(msgDiv);
    return msgDiv;
  }

  function generateSimulatedResponse(userPrompt) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot-message';

    let contentHTML = '';
    const lower = userPrompt.toLowerCase();

    if (lower.includes('code') || lower.includes('html') || lower.includes('css') || lower.includes('javascript') || lower.includes('python')) {
      contentHTML = `
        <p>Here is a clean implementation example tailored for your request:</p>
        <div class="code-block">
          <div class="code-header">
            <span class="code-lang">css</span>
            <button class="copy-btn" onclick="copyCode(this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>Copy code</span>
            </button>
          </div>
          <pre><code>/* ChatGPT Message Styling */
.user-bubble {
  background-color: #2f2f2f;
  border-radius: 20px;
  padding: 10px 16px;
  max-width: 70%;
  color: #ececec;
}

.bot-container {
  display: flex;
  gap: 16px;
  color: #ececec;
}</code></pre>
        </div>
        <p>This layout uses CSS flexbox to cleanly position the avatar next to the stream of conversational markdown content.</p>
      `;
    } else {
      contentHTML = `
        <p>Thank you for reaching out! Here are key considerations regarding <strong>"${escapeHTML(userPrompt)}"</strong>:</p>
        <ul>
          <li><strong>Clarity & Structure:</strong> Keep core ideas organized into digestible sections.</li>
          <li><strong>Interactivity:</strong> Provide clear visual affordances for user interactions.</li>
          <li><strong>Adaptability:</strong> Seamlessly adjust between mobile, tablet, and desktop viewports.</li>
        </ul>
        <p>Let me know if you would like me to expand on any particular part or customize the styling further!</p>
      `;
    }

    msgDiv.innerHTML = `
      <div class="message-inner">
        <div class="avatar-container">
          <div class="avatar bot-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.475 4.475 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.47 4.47 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
          </div>
        </div>
        <div class="message-content">
          ${contentHTML}
          <div class="response-actions">
            <button class="action-btn" title="Copy response">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
            <button class="action-btn" title="Good response">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </button>
            <button class="action-btn" title="Bad response">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    conversationStream.appendChild(msgDiv);
  }

  function scrollToBottom() {
    chatViewport.scrollTop = chatViewport.scrollHeight;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 4. Sidebar Toggle (Mobile & Desktop)
  function toggleSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('active');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  }

  sidebarToggleOpen.addEventListener('click', toggleSidebar);
  sidebarToggleClose.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
  });

  // 5. New Chat Button
  newChatBtn.addEventListener('click', () => {
    conversationStream.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    sendBtn.classList.remove('active');
    messageInput.focus();
  });

  // 6. Model Dropdown Toggle
  modelDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modelDropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!modelDropdownContainerContains(e.target)) {
      modelDropdownMenu.classList.remove('show');
    }
  });

  function modelDropdownContainerContains(el) {
    return modelDropdownBtn.contains(el) || modelDropdownMenu.contains(el);
  }

  const modelOptions = document.querySelectorAll('.model-option');
  modelOptions.forEach((option) => {
    option.addEventListener('click', () => {
      modelOptions.forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
      const selectedModel = option.getAttribute('data-model');
      currentModelName.textContent = selectedModel;
      modelDropdownMenu.classList.remove('show');
    });
  });

  // 7. Chat History Item Selection
  const historyItems = document.querySelectorAll('.history-item');
  historyItems.forEach((item) => {
    item.addEventListener('click', () => {
      historyItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
});

// Copy Code Helper
function copyCode(button) {
  const codeBlock = button.closest('.code-block');
  const codeText = codeBlock.querySelector('code').innerText;

  navigator.clipboard.writeText(codeText).then(() => {
    const span = button.querySelector('span');
    const originalText = span.textContent;
    span.textContent = 'Copied!';
    button.style.color = '#10a37f';

    setTimeout(() => {
      span.textContent = originalText;
      button.style.color = '';
    }, 2000);
  });
}
