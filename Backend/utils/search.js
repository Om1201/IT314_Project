import axios from 'axios';

const API_KEY = process.env.SEARCH_ENGINE_KEY;
const cx = process.env.SEARCH_ENGINE_CX;
const API_BASE_URL = 'https://www.googleapis.com/customsearch/v1';


const getArticleLinks = async (mainTopic, subtopic) => {
  const query = subtopic.title;
  const sites = subtopic.recommendedArticleSites;

  const searchPromises = sites.map(async (site) => {
    const url = `${API_BASE_URL}?key=${API_KEY}&cx=${cx}&q=${encodeURIComponent(query)}&siteSearch=${site}&num=5`;
    
    try {
      const response = await axios.get(url);
      return response.data.items?.map(item => item.link) || [];
    } catch (error) {
      console.error(`Error fetching from ${site}:`, error.message);
      return [];
    }
  });

  const results = await Promise.allSettled(searchPromises);

  const allLinks = results
    .filter(res => res.status === 'fulfilled')
    .flatMap(res => res.value);

  return allLinks;
};

const getVideoLinks = async (mainTopic, subtopic) => {
  const query = subtopic.title + " tutorial";
  const url = `${API_BASE_URL}?key=${API_KEY}&cx=${cx}&q=${encodeURIComponent(query)}&siteSearch=youtube.com&num=5`;

  try {
    const response = await axios.get(url);
    return response.data.items?.map(item => item.link) || [];
  } catch (error) {
    console.error('Error fetching videos:', error.message);
    return [];
  }
};


export const getArticles = async (roadmapText) => {
  const mainTopic = roadmapText.title;
  const promises = [];

  for (const chapter of roadmapText.chapters) {
    for (const subtopic of chapter.subtopics) {
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
