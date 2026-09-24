import axiosInstance from "@/app/utils/axiosinterceptor";

export interface CommunityDiscussionItem {
  id: number;
  title: string;
  desc?: string;
  author: string;
  authorAvatar?: string;
  avatar?: string;
  category: string;
  tag: string;
  votes: number;
  comments: number;
  views: string;
  time: string;
  status: "active" | "inactive";
  isActive?: boolean;
  isPinned: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityCreatorItem {
  id: number;
  handle: string;
  role: string;
  img: string;
  displayOrder: number;
  status: "active" | "inactive";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityContributorItem {
  id: number;
  rank: number;
  name: string;
  points: string;
  role: string;
  avatar?: string;
  badgeClass: string;
  status: "active" | "inactive";
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunitySettingItem {
  id?: number;
  heroTag?: string;
  heroTitle?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroImage?: string;
  membersCount?: string;
  heroMembersCount?: string;
  discussionsCount?: string;
  heroDiscussionsCount?: string;
  answersCount?: string;
  heroAnswersCount?: string;
  expertsCount?: string;
  heroExpertsCount?: string;
  memberQuote?: string;
  heroQuote?: string;
  quoteAuthor?: string;
  heroQuoteAuthor?: string;
  watchStoryText?: string;
  watchStoryUrl?: string;
  joinButtonText?: string;
  pillarsText?: string;
  ideaCardTitle?: string;
  ideaCardSubtitle?: string;
  ideaCardButtonText?: string;
  missionCardTitle?: string;
  missionCardSubtitle?: string;
  missionCardBadge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityTopicItem {
  id: number;
  topicId?: string;
  slug?: string;
  title: string;
  desc?: string;
  icon?: string;
  iconName?: string;
  displayOrder: number;
  status: "active" | "inactive";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityPageData {
  settings: CommunitySettingItem;
  discussions: CommunityDiscussionItem[];
  creators: CommunityCreatorItem[];
  contributors: CommunityContributorItem[];
  topics: CommunityTopicItem[];
}

export const communityService = {
  // Public Storefront Data
  getPageData: async (): Promise<CommunityPageData> => {
    const response = await axiosInstance.get("/community/page-data");
    return response.data;
  },

  // Upvote discussion
  voteDiscussion: async (id: number, delta: number) => {
    const response = await axiosInstance.post(`/community/discussions/${id}/vote`, {
      delta,
    });
    return response.data;
  },

  // ==========================================
  // DISCUSSIONS (ADMIN)
  // ==========================================
  getAllDiscussionsAdmin: async (): Promise<CommunityDiscussionItem[]> => {
    const response = await axiosInstance.get("/community/admin/discussions");
    return response.data;
  },

  createDiscussion: async (data: FormData): Promise<CommunityDiscussionItem> => {
    const response = await axiosInstance.post(
      "/community/admin/discussions",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  updateDiscussion: async (
    id: number,
    data: FormData
  ): Promise<CommunityDiscussionItem> => {
    const response = await axiosInstance.put(
      `/community/admin/discussions/${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  toggleDiscussionStatus: async (id: number) => {
    const response = await axiosInstance.patch(
      `/community/admin/discussions/${id}/status`
    );
    return response.data;
  },

  toggleDiscussionPinned: async (id: number) => {
    const response = await axiosInstance.patch(
      `/community/admin/discussions/${id}/pinned`
    );
    return response.data;
  },

  deleteDiscussion: async (id: number) => {
    const response = await axiosInstance.delete(
      `/community/admin/discussions/${id}`
    );
    return response.data;
  },

  // ==========================================
  // CREATORS (ADMIN)
  // ==========================================
  getAllCreatorsAdmin: async (): Promise<CommunityCreatorItem[]> => {
    const response = await axiosInstance.get("/community/admin/creators");
    return response.data;
  },

  createCreator: async (data: FormData): Promise<CommunityCreatorItem> => {
    const response = await axiosInstance.post(
      "/community/admin/creators",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  updateCreator: async (
    id: number,
    data: FormData
  ): Promise<CommunityCreatorItem> => {
    const response = await axiosInstance.put(
      `/community/admin/creators/${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  toggleCreatorStatus: async (id: number) => {
    const response = await axiosInstance.patch(
      `/community/admin/creators/${id}/status`
    );
    return response.data;
  },

  deleteCreator: async (id: number) => {
    const response = await axiosInstance.delete(
      `/community/admin/creators/${id}`
    );
    return response.data;
  },

  // ==========================================
  // CONTRIBUTORS (ADMIN)
  // ==========================================
  getAllContributorsAdmin: async (): Promise<CommunityContributorItem[]> => {
    const response = await axiosInstance.get("/community/admin/contributors");
    return response.data;
  },

  createContributor: async (
    data: FormData
  ): Promise<CommunityContributorItem> => {
    const response = await axiosInstance.post(
      "/community/admin/contributors",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  updateContributor: async (
    id: number,
    data: FormData
  ): Promise<CommunityContributorItem> => {
    const response = await axiosInstance.put(
      `/community/admin/contributors/${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  toggleContributorStatus: async (id: number) => {
    const response = await axiosInstance.patch(
      `/community/admin/contributors/${id}/status`
    );
    return response.data;
  },

  deleteContributor: async (id: number) => {
    const response = await axiosInstance.delete(
      `/community/admin/contributors/${id}`
    );
    return response.data;
  },

  // ==========================================
  // SETTINGS (ADMIN)
  // ==========================================
  getSettings: async (): Promise<CommunitySettingItem> => {
    const response = await axiosInstance.get("/community/admin/settings");
    return response.data;
  },

  updateSettings: async (data: FormData): Promise<{ message: string; settings: CommunitySettingItem }> => {
    const response = await axiosInstance.put(
      "/community/admin/settings",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // ==========================================
  // TOPICS (ADMIN)
  // ==========================================
  getAllTopicsAdmin: async (): Promise<CommunityTopicItem[]> => {
    const response = await axiosInstance.get("/community/admin/topics");
    return response.data;
  },

  createTopic: async (data: Record<string, any>): Promise<CommunityTopicItem> => {
    const response = await axiosInstance.post("/community/admin/topics", data);
    return response.data;
  },

  updateTopic: async (id: number, data: Record<string, any>): Promise<CommunityTopicItem> => {
    const response = await axiosInstance.put(`/community/admin/topics/${id}`, data);
    return response.data;
  },

  toggleTopicStatus: async (id: number): Promise<{ message: string; topic: CommunityTopicItem }> => {
    const response = await axiosInstance.patch(
      `/community/admin/topics/${id}/status`
    );
    return response.data;
  },

  deleteTopic: async (id: number) => {
    const response = await axiosInstance.delete(`/community/admin/topics/${id}`);
    return response.data;
  },
};

