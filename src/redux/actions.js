import { packageAPI } from "../util/PackageAPI";

/*
 * Action Types
 */

// For when a search is triggered, either by search bar or saved card info
export const DO_TRACKING_SEARCH = "DO_TRACKING_SEARCH";

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
    HIDDEN: "HIDDEN",
    LOADING: "LOADING",
    NORMAL: "NORMAL"
};

/*
 * Action Creators
 */

/*
 * Belonging to search actions / root reducer
 */

export const doTrackingSearch =
    (tracking, carrier) => (
        // Return a function that takes dispatch as a parameter as we are using thunk middleware
        (dispatch) =>
            packageAPI.getTrackingData(tracking, carrier)
                .then( (response) => response.json() )
                .then(
                    (data) => {
                        // Tell the package details card that the search failed
                        if (!data || "error" in data)
                        {
                            dispatch(setPackageDetailsRenderState(PackageDetailsRenderStates.ERROR));
                            return;
                        }

                        // Otherwise, tell the package details card the information we fetched
                        dispatch(setPackageDetails({
                            carrier: carrier,
                            tracking: tracking,
                            ...data
                        }));
                        dispatch(setPackageDetailsRenderState(PackageDetailsRenderStates.NORMAL));
                    }
                )
                // Bad response from server, i.e. not json format, etc.
                .catch( () => dispatch(setPackageDetailsRenderState(PackageDetailsRenderStates.ERROR)) )
    );

/*
 * Belonging to savedCard reducer
 */

export const savedPackageAdd =
    (tracking, carrier, name) => ({
        type: SAVED_PACKAGE_ADD,
        tracking: tracking,
        carrier: carrier,
        name: name
    });

export const savedPackageRemove =
    (tracking) => ({
        type: SAVED_PACKAGE_REMOVE,
        tracking: tracking
    });

/*
 * Belonging to detailsCard reducer
 */

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
