import { combineReducers } from "redux";
import {
    SAVED_PACKAGE_ADD,
    SAVED_PACKAGE_REMOVE,

    SET_PACKAGE_DETAILS,
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
    detailsRenderState: PackageDetailsRenderStates.HIDDEN,
};

export function detailsCard(state = detailsInitialState, action)
{
    switch (action.type)
    {
        case SET_PACKAGE_DETAILS:
            return {
                ...state,
                details: action.details
            };

        case SET_PACKAGE_DETAILS_RENDER_STATE:
            return {
                ...state,
                detailsRenderState: action.renderState
            };

        default:
            return state;
    }
};

/*
 * Reducers for the saved packages card
 */

// Default state = no saved cards
// Each entry in the object is in the format { tracking: { carrier: '', name: '' } }

export function savedCard(state = {}, action)
{
    switch (action.type)
    {
        case SAVED_PACKAGE_ADD:
            return {
                ...state,
                [action.tracking]: {
                    carrier: action.carrier,
                    name: action.name
                }
            };

        case SAVED_PACKAGE_REMOVE:
            return state;

        default:
            return state;
    }
};

/*
 * Combine the reducers and export it
 */

const rootReducer = combineReducers({
    detailsCard,
    savedCard
});
export default rootReducer;
