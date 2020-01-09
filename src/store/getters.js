export const grabGenre = (state) => (type) => {
    return type.length > 0 ? state.genres.filter(currentGenre => currentGenre.toLowerCase().indexOf(type) === 0) : state.genres;
}