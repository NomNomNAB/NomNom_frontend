import { useEffect, useMemo, useState } from "react";
import useAuth from "./useAuth";

export function useFavourite(recipeId: string | number) {
    const { user } = useAuth();
    const [isFav, setIsFav] = useState(false);

    const key = useMemo(() => {
        if (!user) return null;
        return `favourites_${user.uid ?? user.email}`;
    }, [user]);

    const getFavs = (): string[] => {
        if (!key) return [];
        try {
            const raw = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<string | number>;
            const normalized = Array.from(new Set(raw.map((v) => String(v))));

            localStorage.setItem(key, JSON.stringify(normalized));
            return normalized;
        } catch {
            return [];
        }
    }

    const setFavs = (list: string[]) => {
        if (!key) return;
        const checkUnique = Array.from(new Set(list.map(String)));
        localStorage.setItem(key, JSON.stringify(checkUnique));
        window.dispatchEvent(new Event('favouritesUpdated'));

    }

    const recipeKey = String(recipeId);

    useEffect(() => {
        if (!key) {
            setIsFav(false)
            return;
        }
        const favs = getFavs();
        setIsFav(favs.includes(recipeKey))
    }, [key, recipeKey]);

    const toggleFav = () => {
        if (!key) return false;

        const favs = getFavs();

        if (favs.includes(recipeKey)) {
            setFavs(favs.filter((id) => id !== recipeKey));
            setIsFav(false);

        } else {
            setFavs([...favs, recipeKey]);
            setIsFav(true);
        }
        return true;
    }
    return { isFav, toggleFav, canUse: Boolean(key) };
};

export function useFavouriteList() {
    const { user } = useAuth();
    const [favId, setFavId] = useState<string[]>([]);
    const [count, setCount] = useState(0);

    const key = useMemo(() => {
        if (!user) return null;
        return `favourites_${user.uid ?? user.email}`;
    }, [user]);

    const getFavs = (): string[] => {
        if (!key) return [];
        try {
            const raw = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<string | number>;
            const normalized = Array.from(new Set(raw.map((v) => String(v))));
            localStorage.setItem(key, JSON.stringify(normalized));
            return normalized;
        } catch {
            return [];
        }
    };

    const updateFavouriteList = () => {
        if (!key) {
            setFavId([]);
            setCount(0);
            return;
        }
        const favs = getFavs();
        setFavId(favs);
        setCount(favs.length);
    };

    useEffect(() => {
        updateFavouriteList();
    }, [key]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                updateFavouriteList();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events for same-tab updates
        const handleCustomEvent = () => {
            updateFavouriteList();
        };

        window.addEventListener('favouritesUpdated', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favouritesUpdated', handleCustomEvent);
        };
    }, [key]);

    return {
        favId,
        count,
        canUse: Boolean(key),
        refresh: updateFavouriteList
    };
}