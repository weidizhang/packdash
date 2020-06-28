/*
 * Action Types
 */

// For when a user adds or removes a saved package bookmark
export const SAVED_PACKAGE_ADD = "SAVED_PACKAGE_ADD";
export const SAVED_PACKAGE_REMOVE = "SAVED_PACKAGE_REMOVE";

// ...
export const SET_PACKAGE_DETAILS_RENDER_STATE = "SET_PACKAGE_DETAILS_RENDER_STATE";

// For when a search on a tracking number is initiated, i.e. by clicking
// a saved bookmark or using the search bar
export const TRACKING_SEARCH_START = "TRACKING_SEARCH_START";
export const TRACKING_SEARCH_STOP = "TRACKING_SEARCH_STOP";

/*
 * Other Constants
 */

export const PackageDetailsRenderStates = {
    EXPANDED: "EXPANDED",
    ERROR: "ERROR",
    LOADING: "LOADING",
    NORMAL: "NORMAL"
};

/*
 * Action Creators
 */

export const savedPackageAdd =
    (tracking) => ({
        type: SAVED_PACKAGE_ADD,
        tracking: tracking
    });

export const savedPackageRemove =
    (tracking) => ({
        type: SAVED_PACKAGE_REMOVE,
        tracking: tracking
    });

export const setPackageDetailsRenderState =
    (renderState) => ({ renderState: renderState });

export const trackingSearchStart =
    (tracking, carrier) => ({
        type: TRACKING_SEARCH_START,
        tracking: tracking,
        carrier: carrier
    });

export const trackingSearchStop =
    () => ({ type: TRACKING_SEARCH_STOP });
