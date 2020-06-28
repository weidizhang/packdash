/*
 * Action Types
 */

// For when a user adds or removes a saved package bookmark
export const SAVED_PACKAGE_ADD = "SAVED_PACKAGE_ADD";
export const SAVED_PACKAGE_REMOVE = "SAVED_PACKAGE_REMOVE";

// For when a search performed by search bar successfully yields information
export const SET_PACKAGE_DETAILS = "SET_PACKAGE_DETAILS";

// For when a search performed by search bar needs to update search progress
export const SET_PACKAGE_DETAILS_RENDER_STATE = "SET_PACKAGE_DETAILS_RENDER_STATE";

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

export const setPackageDetails =
    (detailsObject) => ({
        type: SET_PACKAGE_DETAILS,
        details: detailsObject
    });

export const setPackageDetailsRenderState =
    (renderState) => ({
        type: SET_PACKAGE_DETAILS_RENDER_STATE,
        renderState: renderState
    });
