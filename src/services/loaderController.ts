let setLoaderFn: (v: boolean) => void;

export const loaderController = {
    register(fn: any) {
        setLoaderFn = fn;
    },
    show() {
        setLoaderFn?.(true);
    },
    hide() {
        setLoaderFn?.(false);
    }
};
