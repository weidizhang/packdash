import { combineReducers } from "redux";
import {
    SET_PACKAGE_DETAILS_RENDER_STATE,
    PackageDetailsRenderStates
} from "./actions";

/*
 * Reducers for the package details card
 */

// A default state with no tracking information, no render information, and no
// saved package information
const detailsInitialState = {
    details: {
        // Information that will be given to us
        carrier: null,
        tracking: null,

        // Information that will be fetched from the backend API
        status: null,
        lastUpdate: null,
        previousDetails: null
    },
    detailsRenderState: PackageDetailsRenderStates.NORMAL,
};

export function detailsCard(state = detailsInitialState, action)
{
    switch (action.type)
    {
        case SET_PACKAGE_DETAIL_RENDER_STATE:
            return {
                ...state,
                detailsRenderState: action.renderState
            }
    }
};

/*
 * Reducers for the saved packages card
 */

export function savedCard(state = [], action)
{

};

/*
 * Combine the reducers and export it
 */

export const packdashApp = combineReducers({
    detailsCard,
    savedCard
});
