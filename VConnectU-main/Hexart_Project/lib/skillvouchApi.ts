export const apiService = {
  async generateQuiz(skill: string, difficulty: string) {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, difficulty }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to generate quiz');
    }
    return res.json();
  },

  async generateRoadmap(skillName: string) {
    const res = await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillName }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to generate roadmap');
    }
    return res.json();
  },

  async getPeerRecommendations(skillsToLearn: string[]) {
    const res = await fetch('/api/peer-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillsToLearn }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to get recommendations');
    }
    return res.json();
  },

  async analyzeMatch(user1: any, user2: any) {
    const res = await fetch('/api/match/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user1, user2 }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to analyze match');
    }
    return res.json();
  },

  async suggestSkills(currentSkills: string[], currentGoals: string[]) {
    const res = await fetch('/api/skills/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentSkills, currentGoals }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to suggest skills');
    }
    return res.json();
  },

  async updateSkills(skillsKnown: any[], skillsToLearn: string[]) {
    const res = await fetch('/api/skills/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillsKnown, skillsToLearn }),
    });
    if (!res.ok) {
      throw new Error('Failed to update skills');
    }
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch('/api/user/profile');
    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return res.json();
  },

  // --- MESSAGING ---
  async sendMessage(receiverId: string, content: string) {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async getConversation(withUserId: string) {
    const res = await fetch(`/api/messages/conversation?withUserId=${withUserId}`);
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return res.json();
  },

  async getConversations() {
    const res = await fetch('/api/conversations');
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async markAsRead(senderId: string) {
    const res = await fetch('/api/messages/mark-as-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId }),
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return res.json();
  },

  subscribeToConversation(withUserId: string, callback: (messages: any[]) => void) {
    const checkMessages = async () => {
      try {
        const conversation = await this.getConversation(withUserId);
        callback(conversation);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    checkMessages();
    const interval = setInterval(checkMessages, 2000); // 2s polling
    return () => clearInterval(interval);
  },

  // --- EXCHANGE REQUESTS ---
  async createExchangeRequest(request: any) {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error('Failed to create exchange request');
    return res.json();
  },

  async getRequests() {
    const res = await fetch('/api/requests');
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  async updateExchangeStatus(id: string, status: string) {
    const res = await fetch(`/api/requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update request status');
    return res.json();
  }
};
