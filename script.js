let allArticles = [];

async function fetchNews() 
{
        const apiKey = 'cd6262fd680d4dc59244db1cf7c2445b';
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        allArticles = data.articles.slice(0, 15);
        

        if (allArticles.length > 0) {
            const firstArticle = allArticles[0];
            document.getElementById('main_news_image').style.backgroundImage = `url(${firstArticle.urlToImage || 'news image'})`;
            document.getElementById('main_news_title').textContent = firstArticle.title || 'news title';
            document.getElementById('main_news_desc').textContent = firstArticle.description || 'news description';
        }

        displayNews(allArticles.slice(1)); 
}



function displayNews(articles) 
{
    const container = document.getElementById('news_container');
    container.innerHTML = '';

    if (articles.length === 0) {
        container.innerHTML = "<p>no news found</p>";
        return;
    }

    articles.forEach(article => {
        const newsDiv = document.createElement('div');
        newsDiv.classList.add('news-card');

        newsDiv.innerHTML = `
            <img src="${article.urlToImage || 'news image'}" alt="News Image">
            <h3>${article.title || 'news title'}</h3>
        `;

        newsDiv.addEventListener('click', () => {
            document.getElementById('overlay_image').src = article.urlToImage || 'news image';
            document.getElementById('overlay_title').textContent = article.title || 'news title';
            document.getElementById('overlay_author').textContent = article.author || 'news author';
            document.getElementById('overlay_src').textContent = article.source?.name || 'news source';
            document.getElementById('overlay_date').textContent = article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'news date';
            document.getElementById('overlay_desc').textContent = article.description || 'news desc';
            document.getElementById('overlay_link').href = article.url || 'news link';
            document.getElementById('news_overlay').style.display = 'flex';
        });

        container.appendChild(newsDiv);
    });
}


document.getElementById('news_overlay').addEventListener('click', (e) => {
    if (e.target.id === 'news_overlay') {
        document.getElementById('news_overlay').style.display = 'none';
    }
});







function arrangeByHeading(list, direction = 'asc') {
    return [...list].sort((x, y) => {
        const first = x.title?.toLowerCase() || '';
        const second = y.title?.toLowerCase() || '';
        return direction === 'asc' ? first.localeCompare(second) : second.localeCompare(first);
    });
}

function arrangeByDate(list, mode = 'newest') {
    return [...list].sort((x, y) => {
        const first = new Date(x.publishedAt);
        const second = new Date(y.publishedAt);
        return mode === 'newest' ? second - first : first - second;
    });
}

function arrangeBySource(list, direction = 'asc') {
    return [...list].sort((x, y) => {
        const first = x.source?.name?.toLowerCase() || '';
        const second = y.source?.name?.toLowerCase() || '';
        return direction === 'asc' ? first.localeCompare(second) : second.localeCompare(first);
    });
}





document.getElementById('sort_news').addEventListener('change', function () 
{
    let sortedList = [...allArticles].slice(1);
    switch (this.value) {
        case 'title_asc':
            sortedList = arrangeByHeading(sortedList, 'asc');
            break;
        case 'title_desc':
            sortedList = arrangeByHeading(sortedList, 'desc');
            break;
        case 'date_newest':
            sortedList = arrangeByDate(sortedList, 'newest');
            break;
        case 'date_oldest':
            sortedList = arrangeByDate(sortedList, 'oldest');
            break;
        case 'source_asc':
            sortedList = arrangeBySource(sortedList, 'asc');
            break;
        case 'source_desc':
            sortedList = arrangeBySource(sortedList, 'desc');
            break;
    }
    displayNews(sortedList);
});





document.getElementById('search_input').addEventListener('input', function () 
{
    const query = this.value.toLowerCase();
    const filteredArticles = allArticles.slice(1).filter(article =>
        article.title && article.title.toLowerCase().includes(query)
    );
    displayNews(filteredArticles);
});

fetchNews();



















