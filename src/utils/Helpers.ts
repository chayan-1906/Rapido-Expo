import {Href, Router, router} from "expo-router";

export function resetAndNavigate(path: string) {
    if (router.canGoBack()) {
        router.dismissAll();
    }
    router.replace(path as Href);
}

export function navigate(router: Router, path: string) {
    router.navigate(path as Href);
}
