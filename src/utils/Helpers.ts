import {Href, router} from "expo-router";

function resetAndNavigate(newPath: Href<string | object>) {
    if (router.canGoBack()) {
        router.dismissAll();
    }
    router.replace(newPath);
}

export default resetAndNavigate;
