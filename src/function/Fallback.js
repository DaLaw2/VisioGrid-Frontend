import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

export const Fallback= ({ error, resetErrorBoundary} ) => {
    const location = useLocation();
    const errorLocation = useRef(location.pathname);
    useEffect(() => {
        if (location.pathname !== errorLocation.current) {
            resetErrorBoundary();
        }
    },[location.pathname])
    return(<h1>Something went wrong</h1>)
}
