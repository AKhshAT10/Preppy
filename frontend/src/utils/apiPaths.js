export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
        CHANGE_PASSWORD: "/api/auth/change-password",
    },

    DOCUMENTS: {
        UPLOAD: "/api/documents/upload",
        GET_DOCUMENTS: "/api/documents",
        GET_DOCUMENT_BY_ID: (id)=>`/api/documents/${id}`,
        UPDATE_DOCUMENT: (id)=>`/api/documents/${id}`,
        DELETE_DOCUMENT: (id)=>`/api/documents/${id}`,
    },

    AI: {
    GENERATE_FLASHCARDS: "/api/aiRoutes/generate-flashcards",
    GENERATE_QUIZ: "/api/aiRoutes/generate-quiz",
    GENERATE_SUMMARY: "/api/aiRoutes/generate-summary",
    CHAT: "/api/aiRoutes/chat",
    EXPLAIN_CONCEPT: "/api/aiRoutes/explain-concept",
    GET_CHAT_HISTORY: (documentId) => `/api/aiRoutes/chat-history/${documentId}`,
    },

    FLASHCARDS: {
        GET_ALL_FLASHCARD_SETS: "/api/flashcards",
        GET_FLASHCARDS_FOR_DOC: (documentId) => `/api/flashcards/${documentId}`,
        REVIEW_FLASHCARD: (cardId) => `/api/flashcards/${cardId}/review`,
        TOGGLE_STAR: (cardId) => `/api/flashcards/${cardId}/star`,
        DELETE_FLASHCARD_SET: (id) => `/api/flashcards/${id}`,
    },

    QUIZZES: {
    GET_QUIZZES_FOR_DOC: (documentId) => `/api/quizzes/document/${documentId}`,    
    GET_QUIZ_BY_ID: (id) => `/api/quizzes/${id}`,  // <-- add /quiz/
    SUBMIT_QUIZ: (id) => `/api/quizzes/${id}/submit`,   // this is fine
    GET_QUIZ_RESULTS: (id) => `/api/quizzes/${id}/results`, // fine
    DELETE_QUIZ: (id) => `/api/quizzes/${id}`, // fine
},

    PROGRESS: {
        GET_DASHBOARD: "/api/progress/dashboard",
    },
};