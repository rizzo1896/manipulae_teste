const initialState = {
  favorites: [],
  trackLinks: [],
};

const List = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAV":
      return {
        ...state,
        favorites: [...state.favorites, action.newId],
        trackLinks: [...state.trackLinks, action.add_tracks],
      };
    case "DELETE_FAV":
      let val = state.favorites.indexOf(action.remove);
      if (val > -1) {
        state.favorites.splice(val, 1);
      }
      let ele = state.trackLinks.indexOf(action.remove_tracks);
      if (ele > -1) {
        state.trackLinks.splice(ele, 1);
      }
      return {
        ...state,
        favorites: [...state.favorites],
        trackLinks: [...state.trackLinks],
      };
    default:
  }

  return state;
};

export default List;
