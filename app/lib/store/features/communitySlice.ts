import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  communityService,
  CommunityDiscussionItem,
  CommunityCreatorItem,
  CommunityContributorItem,
  CommunitySettingItem,
  CommunityTopicItem,
  CommunityPageData,
} from "@/app/sercices/user/community.service";

interface CommunityState {
  pageData: CommunityPageData | null;
  discussions: CommunityDiscussionItem[];
  creators: CommunityCreatorItem[];
  contributors: CommunityContributorItem[];
  settings: CommunitySettingItem | null;
  topics: CommunityTopicItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommunityState = {
  pageData: null,
  discussions: [],
  creators: [],
  contributors: [],
  settings: null,
  topics: [],
  status: "idle",
  actionStatus: "idle",
  error: null,
};

// Helper to convert object to FormData
const toFormData = (payload: FormData | Record<string, any>): FormData => {
  if (payload instanceof FormData) return payload;
  const fd = new FormData();
  Object.keys(payload).forEach((key) => {
    const val = payload[key];
    if (val !== undefined && val !== null) {
      if (val instanceof File) {
        fd.append(key, val);
      } else {
        fd.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
      }
    }
  });
  return fd;
};

// Helper to normalize items ensuring isActive boolean matches status
const normalizeItem = <T extends { status?: string; isActive?: boolean }>(item: T): T => ({
  ...item,
  isActive: item.isActive !== undefined ? item.isActive : item.status === "active",
});

// ==========================================
// ASYNC THUNKS
// ==========================================

// Public Storefront Data
export const fetchCommunityPageData = createAsyncThunk(
  "community/fetchPageData",
  async () => {
    return await communityService.getPageData();
  }
);

export const voteDiscussionThunk = createAsyncThunk(
  "community/voteDiscussion",
  async ({ id, delta }: { id: number; delta: number }) => {
    await communityService.voteDiscussion(id, delta);
    return { id, delta };
  }
);

// Admin: Discussions
export const fetchDiscussionsAdmin = createAsyncThunk(
  "community/fetchDiscussionsAdmin",
  async () => {
    return await communityService.getAllDiscussionsAdmin();
  }
);

export const createDiscussionThunk = createAsyncThunk(
  "community/createDiscussion",
  async (payload: FormData | Record<string, any>) => {
    return await communityService.createDiscussion(toFormData(payload));
  }
);

export const updateDiscussionThunk = createAsyncThunk(
  "community/updateDiscussion",
  async ({ id, data }: { id: number; data: FormData | Record<string, any> }) => {
    return await communityService.updateDiscussion(id, toFormData(data));
  }
);

export const toggleDiscussionStatusThunk = createAsyncThunk(
  "community/toggleDiscussionStatus",
  async (id: number) => {
    const res = await communityService.toggleDiscussionStatus(id);
    return res.discussion;
  }
);

export const toggleDiscussionPinnedThunk = createAsyncThunk(
  "community/toggleDiscussionPinned",
  async (id: number) => {
    const res = await communityService.toggleDiscussionPinned(id);
    return res.discussion;
  }
);

export const deleteDiscussionThunk = createAsyncThunk(
  "community/deleteDiscussion",
  async (id: number) => {
    await communityService.deleteDiscussion(id);
    return id;
  }
);

// Admin: Creators
export const fetchCreatorsAdmin = createAsyncThunk(
  "community/fetchCreatorsAdmin",
  async () => {
    return await communityService.getAllCreatorsAdmin();
  }
);

export const createCreatorThunk = createAsyncThunk(
  "community/createCreator",
  async (payload: FormData | Record<string, any>) => {
    return await communityService.createCreator(toFormData(payload));
  }
);

export const updateCreatorThunk = createAsyncThunk(
  "community/updateCreator",
  async ({ id, data }: { id: number; data: FormData | Record<string, any> }) => {
    return await communityService.updateCreator(id, toFormData(data));
  }
);

export const toggleCreatorStatusThunk = createAsyncThunk(
  "community/toggleCreatorStatus",
  async (id: number) => {
    const res = await communityService.toggleCreatorStatus(id);
    return res.creator;
  }
);

export const deleteCreatorThunk = createAsyncThunk(
  "community/deleteCreator",
  async (id: number) => {
    await communityService.deleteCreator(id);
    return id;
  }
);

// Admin: Contributors
export const fetchContributorsAdmin = createAsyncThunk(
  "community/fetchContributorsAdmin",
  async () => {
    return await communityService.getAllContributorsAdmin();
  }
);

export const createContributorThunk = createAsyncThunk(
  "community/createContributor",
  async (payload: FormData | Record<string, any>) => {
    return await communityService.createContributor(toFormData(payload));
  }
);

export const updateContributorThunk = createAsyncThunk(
  "community/updateContributor",
  async ({ id, data }: { id: number; data: FormData | Record<string, any> }) => {
    return await communityService.updateContributor(id, toFormData(data));
  }
);

export const toggleContributorStatusThunk = createAsyncThunk(
  "community/toggleContributorStatus",
  async (id: number) => {
    const res = await communityService.toggleContributorStatus(id);
    return res.contributor;
  }
);

export const deleteContributorThunk = createAsyncThunk(
  "community/deleteContributor",
  async (id: number) => {
    await communityService.deleteContributor(id);
    return id;
  }
);

// Admin: Settings
export const fetchSettingsAdmin = createAsyncThunk(
  "community/fetchSettingsAdmin",
  async () => {
    return await communityService.getSettings();
  }
);

export const updateSettingsThunk = createAsyncThunk(
  "community/updateSettings",
  async (payload: FormData | Record<string, any>) => {
    const res = await communityService.updateSettings(toFormData(payload));
    return res.settings;
  }
);

// Admin: Topics
export const fetchTopicsAdmin = createAsyncThunk(
  "community/fetchTopicsAdmin",
  async () => {
    return await communityService.getAllTopicsAdmin();
  }
);

export const createTopicThunk = createAsyncThunk(
  "community/createTopic",
  async (payload: Record<string, any>) => {
    return await communityService.createTopic(payload);
  }
);

export const updateTopicThunk = createAsyncThunk(
  "community/updateTopic",
  async ({ id, data }: { id: number; data: Record<string, any> }) => {
    return await communityService.updateTopic(id, data);
  }
);

export const toggleTopicStatusThunk = createAsyncThunk(
  "community/toggleTopicStatus",
  async (id: number) => {
    const res = await communityService.toggleTopicStatus(id);
    return res.topic || res;
  }
);

export const deleteTopicThunk = createAsyncThunk(
  "community/deleteTopic",
  async (id: number) => {
    await communityService.deleteTopic(id);
    return id;
  }
);

// ==========================================
// SLICE
// ==========================================
const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Public Storefront Data
    builder.addCase(fetchCommunityPageData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCommunityPageData.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.pageData = action.payload;
      state.discussions = action.payload.discussions;
      state.creators = action.payload.creators;
      state.contributors = action.payload.contributors;
      state.settings = action.payload.settings;
      state.topics = action.payload.topics;
    });
    builder.addCase(fetchCommunityPageData.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to load community page";
    });

    // Upvote
    builder.addCase(voteDiscussionThunk.fulfilled, (state, action) => {
      const { id, delta } = action.payload;
      const disc = state.discussions.find((d) => d.id === id);
      if (disc) {
        disc.votes = Math.max(0, disc.votes + delta);
      }
      if (state.pageData) {
        const pDisc = state.pageData.discussions.find((d) => d.id === id);
        if (pDisc) {
          pDisc.votes = Math.max(0, pDisc.votes + delta);
        }
      }
    });

    // Discussions Admin
    builder.addCase(fetchDiscussionsAdmin.fulfilled, (state, action) => {
      state.discussions = action.payload;
    });
    builder.addCase(createDiscussionThunk.fulfilled, (state, action) => {
      state.discussions.unshift(action.payload);
    });
    builder.addCase(updateDiscussionThunk.fulfilled, (state, action) => {
      const idx = state.discussions.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.discussions[idx] = action.payload;
    });
    builder.addCase(toggleDiscussionStatusThunk.fulfilled, (state, action) => {
      const idx = state.discussions.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.discussions[idx] = action.payload;
    });
    builder.addCase(toggleDiscussionPinnedThunk.fulfilled, (state, action) => {
      const idx = state.discussions.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.discussions[idx] = action.payload;
    });
    builder.addCase(deleteDiscussionThunk.fulfilled, (state, action) => {
      state.discussions = state.discussions.filter((d) => d.id !== action.payload);
    });

    // Creators Admin
    builder.addCase(fetchCreatorsAdmin.fulfilled, (state, action) => {
      state.creators = action.payload;
    });
    builder.addCase(createCreatorThunk.fulfilled, (state, action) => {
      state.creators.push(action.payload);
    });
    builder.addCase(updateCreatorThunk.fulfilled, (state, action) => {
      const idx = state.creators.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.creators[idx] = action.payload;
    });
    builder.addCase(toggleCreatorStatusThunk.fulfilled, (state, action) => {
      const idx = state.creators.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.creators[idx] = action.payload;
    });
    builder.addCase(deleteCreatorThunk.fulfilled, (state, action) => {
      state.creators = state.creators.filter((c) => c.id !== action.payload);
    });

    // Contributors Admin
    builder.addCase(fetchContributorsAdmin.fulfilled, (state, action) => {
      state.contributors = action.payload;
    });
    builder.addCase(createContributorThunk.fulfilled, (state, action) => {
      state.contributors.push(action.payload);
      state.contributors.sort((a, b) => a.rank - b.rank);
    });
    builder.addCase(updateContributorThunk.fulfilled, (state, action) => {
      const idx = state.contributors.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.contributors[idx] = action.payload;
      state.contributors.sort((a, b) => a.rank - b.rank);
    });
    builder.addCase(toggleContributorStatusThunk.fulfilled, (state, action) => {
      const idx = state.contributors.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.contributors[idx] = action.payload;
    });
    builder.addCase(deleteContributorThunk.fulfilled, (state, action) => {
      state.contributors = state.contributors.filter((c) => c.id !== action.payload);
    });

    // Settings Admin
    builder.addCase(fetchSettingsAdmin.fulfilled, (state, action) => {
      state.settings = action.payload;
    });
    builder.addCase(updateSettingsThunk.fulfilled, (state, action) => {
      state.settings = action.payload;
      if (state.pageData) state.pageData.settings = action.payload;
    });

    // Topics Admin
    builder.addCase(fetchTopicsAdmin.fulfilled, (state, action) => {
      state.topics = action.payload;
    });
    builder.addCase(createTopicThunk.fulfilled, (state, action) => {
      state.topics.push(action.payload);
      state.topics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      if (state.pageData) {
        state.pageData.topics = state.topics;
      }
    });
    builder.addCase(updateTopicThunk.fulfilled, (state, action) => {
      const idx = state.topics.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.topics[idx] = action.payload;
      state.topics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      if (state.pageData) {
        const pIdx = state.pageData.topics.findIndex((t) => t.id === action.payload.id);
        if (pIdx !== -1) state.pageData.topics[pIdx] = action.payload;
      }
    });
    builder.addCase(toggleTopicStatusThunk.fulfilled, (state, action) => {
      const idx = state.topics.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.topics[idx] = action.payload;
      if (state.pageData) {
        const pIdx = state.pageData.topics.findIndex((t) => t.id === action.payload.id);
        if (pIdx !== -1) state.pageData.topics[pIdx] = action.payload;
      }
    });
    builder.addCase(deleteTopicThunk.fulfilled, (state, action) => {
      state.topics = state.topics.filter((t) => t.id !== action.payload);
      if (state.pageData) {
        state.pageData.topics = state.pageData.topics.filter((t) => t.id !== action.payload);
      }
    });
  },
});

export default communitySlice.reducer;
