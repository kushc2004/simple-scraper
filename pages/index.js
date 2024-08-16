// import { useState } from 'react';

// export default function Home() {
//   const [data, setData] = useState(null);

//   const fetchData = async () => {
//     const res = await fetch('/api/scrape');
//     const result = await res.json();
//     setData(result);
//   };

//   return (
//     <div>
//       <h1>Welcome to My Next.js API Scraper</h1>
//       <button onClick={fetchData}>Fetch Data</button>
//       {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/scrape');
      const data = await response.json();
      setArticles(data);
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <h1>Scraped Articles</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <strong>{article.title}</strong><br />
            {article.date}<br />
            {article.firstPara}
          </li>
        ))}
      </ul>
    </div>
  );
}
