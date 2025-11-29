import axios from 'axios';

const API_KEY = process.env.SEARCH_ENGINE_KEY;
const cx = process.env.SEARCH_ENGINE_CX;
const API_BASE_URL = 'https://www.googleapis.com/customsearch/v1';

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_URL = "https://google.serper.dev/search";


// Fetch article links using Programable google search engine
// const getArticleLinks = async (mainTopic, subtopic) => {
//   const query = `${subtopic.title} ${mainTopic}`;
//   const sites = subtopic.recommendedArticleSites;

//   const searchPromises = sites.map(async (site) => {
//     const url = `${API_BASE_URL}?key=${API_KEY}&cx=${cx}&q=${encodeURIComponent(query)}&siteSearch=${site}&num=5`;
    
//     try {
//       const response = await axios.get(url);
//       return response.data.items?.map(item => item.link) || [];
//     } catch (error) {
//       console.error(`Error fetching from ${site}:`, error.message);
//       return [];
//     }
//   });

//   const results = await Promise.allSettled(searchPromises);

//   const allLinks = results
//     .filter(res => res.status === 'fulfilled')
//     .flatMap(res => res.value);

//   return allLinks;
// };

/**
 Fetching articles using SERPER*/ 
export const getArticleLinks = async (mainTopic, subtopic) => {
  const query = `${subtopic.title}`;
  const sites = subtopic.recommendedArticleSites || [];

  const siteFilter = sites.length
    ? sites.map(site => `site:${site}`).join(" OR ")
    : "";

  const fullQuery = siteFilter ? `${query} ${siteFilter}` : query;

  try {
    const { data } = await axios.post(
      SERPER_URL,
      { q: fullQuery, num: 10 },
      {
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );
    const results = data.organic || [];

    const siteCount = {};
    const filteredLinks = [];

    for (const r of results) {
      try {
        //check the domain name
        const domain = new URL(r.link).hostname.replace("www.", "");


        siteCount[domain] = (siteCount[domain] || 0) + 1;
        if (siteCount[domain] <= 3) {
          filteredLinks.push(r.link);
        }
      } catch {
        continue;
      }
    }

    return filteredLinks;
  } catch (error) {
    console.error("Serper API error:", error.message);
    return [];
  }
};

/* Fetching video using programable google search engine */
// const getVideoLinks = async (mainTopic, subtopic) => {
//   const query = `${subtopic.title}  ${mainTopic} tutorial`;
//   const url = `${API_BASE_URL}?key=${API_KEY}&cx=${cx}&q=${encodeURIComponent(query)}&siteSearch=youtube.com&num=5`;

//   try {
//     const response = await axios.get(url);
//     return response.data.items?.map(item => item.link) || [];
//   } catch (error) {
//     console.error('Error fetching videos:', error.message);
//     return [];
//   }
// };

/* Fetching video using serper api */
const getVideoLinks = async (mainTopic, subtopic) => {
  const query = `${subtopic.title} tutorial site:youtube.com`;
  const { data } = await axios.post(
    SERPER_URL,
    { q: query, num: 10 },
    {
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 8000,
    }
  );
  const results = data.organic || [];
  return results.map(result => result.link);
}


export const getArticles = async (roadmapText) => {
  const mainTopic = roadmapText.title;
  const promises = [];

  for (const chapter of roadmapText.chapters) {
    for (const subtopic of chapter.subtopics) {
      await new Promise(resolve => setTimeout(resolve, 500));
      promises.push(
        getArticleLinks(mainTopic, subtopic).then(articleLinks => ({
          chapterId: chapter.id,
          subtopicId: subtopic.id,
          articles: articleLinks,
        }))
      );
    }
  }

  return Promise.all(promises);
};


export const getVideos = async (roadmapText) => {
  const mainTopic = roadmapText.title;
  const promises = [];

  for (const chapter of roadmapText.chapters) {
    for (const subtopic of chapter.subtopics) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Adding delay to avoid rate limiting
      promises.push(
        getVideoLinks(mainTopic, subtopic).then(videoLinks => ({
          chapterId: chapter.id,
          subtopicId: subtopic.id,
          videos: videoLinks,
        }))
      );
    }
  }

  return Promise.all(promises);
};
