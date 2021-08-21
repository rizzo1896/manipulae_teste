const initialState = {
  favorites: [],
};

const List = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAV":
      return { ...state, favorites: [...state.favorites, action.newId] };
    case "DELETE_FAV":
      let index = state.favorites.indexOf(action.remove);
      if (index > -1) {
        state.favorites.splice(index, 1);
      }
      return {
        ...state,
        favorites: [...state.favorites],
      };
    default:
  }

  return state;
};

export default List;
