const axios = require('axios');
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;  // 서버 포트 번호 설정

const client_id = '1Fk0H5T_fK33HSz85F5y';
const client_secret = 'bdd2oJeH3V';

// 저장된 데이터를 담아둘 변수
let savedNewsData = [];

// '/news' 엔드포인트로 네이버 뉴스 API 호출 및 데이터 저장
app.get('/fetch-news', async (req, res) => {
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

        // 결과에서 description을 제거하고 pubDate와 link를 포함한 새로운 객체 배열로 변환하여 저장
        savedNewsData = response.data.items.map(item => ({
            title: item.title,
            pubDate: item.pubDate,  // pubDate를 추가
            link: item.link         // link를 추가
        }));

        res.json({ message: 'News data fetched and stored successfully!' });
    } catch (error) {
        console.error('Error retrieving news:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error retrieving news' });
    }
});

// SSL 검사를 우회하고 저장된 뉴스 데이터를 제공하는 엔드포인트
app.get('/news', (req, res) => {
    if (savedNewsData.length > 0) {
        res.json(savedNewsData);  // 저장된 뉴스 데이터를 JSON 형태로 응답
    } else {
        res.status(404).json({ error: 'No news data available. Please fetch news first.' });
    }
});

// HTTPS 서버 설정
const httpsOptions = {
    key: fs.readFileSync('/path/to/your/private-key.pem'),
    cert: fs.readFileSync('/path/to/your/certificate.pem'),
    rejectUnauthorized: false  // SSL 검사 우회
};

https.createServer(httpsOptions, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// HTTP 서버 실행 (SSL 우회 용도)
app.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});
