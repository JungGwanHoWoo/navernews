const axios = require('axios');

const client_id = '1Fk0H5T_fK33HSz85F5y';
const client_secret = 'bdd2oJeH3V';

async function getNews() {
    const url = 'https://openapi.naver.com/v1/search/news.json';
    const query = '농산물';  // 검색할 키워드
    const display = 30;  // 가져올 뉴스 기사 수
    const sort = 'date';  // 날짜순 정렬

    const headers = {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
    };

    const params = {
        query: query,
        display: display,
        sort: sort,
    };

    try {
        const response = await axios.get(url, {
            headers: headers,
            params: params,
        });
        console.log(response.data.items);
    } catch (error) {
        console.error('Error retrieving news:', error.response ? error.response.data : error.message);
    }
}

getNews();
