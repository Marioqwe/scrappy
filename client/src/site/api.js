import axios from 'axios';

const BASE_URL = 'https://api.perunews.xyz/v1';

export function fetchArticles(
    {
        sources,
        section,
        date,
        page,
        pageSize,
    },
    onSuccess,
    onError,
) {
    const params = `source=${sources.join(',')}&section=${section}&pageSize=${pageSize}&page=${page}&date=${date}`;
    axios.get(`${BASE_URL}/articles/?${params}`)
        .then(res => onSuccess(res))
        .catch(err => onError(err));
}
