// src/services/MessageService.ts
type MessageType = "success" | "error" | "info" | "warning" | "";

interface Message {
    type: MessageType;
    text: string;
}

type Listener<T> = (value: T) => void;

class MessageServiceClass {
    private status: Message = { type: "", text: "" };
    private isLoading = false;

    private statusListeners: Listener<Message>[] = [];
    private loadingListeners: Listener<boolean>[] = [];

    // ✅ Set global message (used by interceptors or anywhere)
    setStatus(message: Message) {
        this.status = message;
        this.statusListeners.forEach((listener) => listener(this.status));
    }

    // ✅ Subscribe to status changes (used by a Toast component)
    onStatusChange(listener: Listener<Message>) {
        this.statusListeners.push(listener);
        return () => {
            this.statusListeners = this.statusListeners.filter((l) => l !== listener);
        };
    }

    // ✅ Set global loading (true/false)
    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
        this.loadingListeners.forEach((listener) => listener(this.isLoading));
    }

    // ✅ Subscribe to loading changes (used by Spinner)
    onLoadingChange(listener: Listener<boolean>) {
        this.loadingListeners.push(listener);
        return () => {
            this.loadingListeners = this.loadingListeners.filter(
                (l) => l !== listener
            );
        };
    }

    // ✅ Clear status
    clearStatus() {
        this.status = { type: "", text: "" };
        this.statusListeners.forEach((listener) => listener(this.status));
    }
}

export const MessageService = new MessageServiceClass();
