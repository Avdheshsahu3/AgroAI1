package com.agroai.dto;

import java.util.ArrayList;
import java.util.List;

public class RecommendationChatResponse {
    private String reply;
    private List<String> suggestions = new ArrayList<>();
    private long timestamp;

    public RecommendationChatResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public RecommendationChatResponse(String reply, List<String> suggestions) {
        this.reply = reply;
        this.suggestions = suggestions != null ? suggestions : new ArrayList<>();
        this.timestamp = System.currentTimeMillis();
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
