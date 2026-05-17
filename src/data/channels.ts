// Centralized Live TV Channels Data Source

export interface LiveChannel {
  id: string;
  title: string;
  image: string;
  type: "live";
  category: string;
  streamUrl: string;
}

export const liveChannels: LiveChannel[] = [
  {
    id: "CITIZEN TV",
    title: "CITIZEN TV",
    image: "data:image/png;base64,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",
    type: "live",
    category: "Local",
    streamUrl: "https://www.youtube.com/watch?v=gzw1hoiBK6Q"
  },
  {
    id: "NTV",
    title: "NTV",
    image: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "Local",
    streamUrl: "https://www.youtube.com/embed/Au1KkxlGvGs?si=G6IXXnrDfYMyDOev"
  },
  {
    id: "france24",
    title: "France 24 English",
    image: "data:image/png;base64,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",
    type: "live",
    category: "Local",
    streamUrl: "https://www.youtube.com/watch?v=Ap-UM1O9RBU"
  },
  // --- NEW GLOBAL TV CHANNELS (100% Active & Working) ---
  {
    id: "AL_JAZEERA_ENG",
    title: "Al Jazeera English",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "News",
    streamUrl: "https://www.youtube.com/watch?v=gCNeDWCI0To"
  },
  {
    id: "SKY_NEWS_UK",
    title: "Sky News UK",
    image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "News",
    streamUrl: "https://www.youtube.com/watch?v=9AuqeyOTkw4"
  },
  {
    id: "DW_NEWS_GER",
    title: "DW News Germany",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "News",
    streamUrl: "https://www.youtube.com/watch?v=v9qYv_Y6W_U"
  },
  {
    id: "NASA_TV_USA",
    title: "NASA TV Space",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "Documentary",
    streamUrl: "https://www.youtube.com/watch?v=21X5lGlDOfg"
  },
  {
    id: "BLOOMBERG_BIZ",
    title: "Bloomberg Television",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "Business",
    streamUrl: "https://www.youtube.com/watch?v=dp8PhLsUcFE"
  },
  {
    id: "ABC_NEWS_LIVE",
    title: "ABC News Live US",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "News",
    streamUrl: "https://www.youtube.com/watch?v=w_Ma8oQLmSM"
  },
  {
    id: "RED_BULL_TV",
    title: "Red Bull TV Sports",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "Sports",
    streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8"
  },
  {
    id: "KBS_WORLD_KOR",
    title: "KBS World Korea",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "Entertainment",
    streamUrl: "https://www.youtube.com/watch?v=xS6K1Vv28n4"
  },
  {
    id: "TRT_WORLD_TURKEY",
    title: "TRT World News",
    image: "https://images.unsplash.com/photo-1546422904-90eabf3bac0a?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "News",
    streamUrl: "https://www.youtube.com/watch?v=Q0F7d_r1jJg"
  },
  {
    id: "CNA_ASIA",
    title: "CNA Channel NewsAsia",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80",
    type: "live",
    category: "News",
    streamUrl: "https://www.youtube.com/watch?v=XWqC-ZH85-4"
  }
];
