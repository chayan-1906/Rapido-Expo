import {Href, router} from "expo-router";

function resetAndNavigate(newPath: string) {
    if (router.canGoBack()) {
        router.dismissAll();
    }
    router.replace(newPath as Href);
}

export default resetAndNavigate;
