import React, { useState, useEffect } from 'react';

interface Article {
    title: string;
    link: string;
}

const RSS_URL = 'https://www.nu.nl/rss/Algemeen';
// Use a CORS proxy to prevent cross-origin issues when fetching the feed from the browser.
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;


const RssFeed: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(PROXY_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
                }
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'text/xml');
                
                const parseError = xml.querySelector('parsererror');
                if (parseError) {
                  throw new Error('Failed to parse RSS feed.');
                }

                const items = Array.from(xml.querySelectorAll('item')).slice(0, 10);
                const feedArticles: Article[] = items.map(item => ({
                    title: item.querySelector('title')?.textContent || 'No title',
                    link: item.querySelector('link')?.textContent || '#',
                }));
                setArticles(feedArticles);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred.');
                console.error("RSS Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed(); // Initial fetch
        const intervalId = setInterval(fetchFeed, 60000); // Refresh every 60 seconds

        return () => {
            clearInterval(intervalId); // Cleanup interval on unmount
        };
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p className="text-gray-400 text-center">Loading news...</p>;
        }
        if (error) {
            return <p className="text-red-400 text-center">Error: Could not load news feed.</p>;
        }
        if (articles.length === 0) {
            return <p className="text-gray-400 text-center">No articles found.</p>;
        }
        return (
            <ul className="space-y-3 overflow-y-auto pr-2">
                {articles.map((article, index) => (
                    <li key={index} className="truncate">
                        <a 
                            href={article.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                            title={article.title}
                        >
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="w-full h-full flex flex-col font-mono bg-black bg-opacity-20 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 pb-2 border-b border-gray-700/50 flex-shrink-0 text-center sm:text-left">
                Latest News
            </h2>
            <div className="flex-grow overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default RssFeed;
