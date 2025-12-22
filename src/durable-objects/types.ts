export interface CloudflareEnv {
	WEBSITE_DO: DurableObjectNamespace;
}

export interface ChatMessage {
	type: "message" | "join" | "quit" | "welcome" | "user_count";
	username?: string;
	message?: string;
	timestamp?: number;
	userCount?: number;
}
