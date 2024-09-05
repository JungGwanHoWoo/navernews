const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;  // 서버 포트 번호 설정

const client_id = '1Fk0H5T_fK33HSz85F5y';
const client_secret = 'bdd2oJeH3V';

// '/news' 엔드포인트로 뉴스 API 호출
app.get('/news', async (req, res) => {
    const query = req.query.query || '농산물';  // 기본 검색어 설정 또는 쿼리 파라미터로 받음
    const display = req.query.display || 30;  // 기본 값 또는 쿼리 파라미터로 받음
    const sort = req.query.sort || 'date';  // 기본 값 또는 쿼리 파라미터로 받음

    const url = 'https://openapi.naver.com/v1/search/news.json';

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

        // 결과에서 description을 제거하고 pubDate와 link를 포함한 새로운 객체 배열로 변환
        const formattedItems = response.data.items.map(item => ({
            title: item.title,
            pubDate: item.pubDate,  // pubDate를 추가
            link: item.link         // link를 추가
        }));

        res.json(formattedItems);  // 수정된 결과를 JSON 형태로 응답
    } catch (error) {
        console.error('Error retrieving news:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error retrieving news' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
