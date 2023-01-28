import { defineConfig } from "vite";
export default defineConfig({
    base: "./",
    build: {
        target: ["edge90", "chrome90", "firefox90", "safari15"],
    },
});
