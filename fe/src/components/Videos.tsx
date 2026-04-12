import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { ENDPOINTS, YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from '../config/api';

interface YouTubeVideo {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        publishedAt: string;
        thumbnails: {
            high: { url: string };
        };
    };
}

const Videos = () => {
    const { t, i18n } = useTranslation();
    const [latestVideos, setLatestVideos] = useState<YouTubeVideo[]>([]);
    const [upcomingVideos, setUpcomingVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);

            if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
                setError(t('videos.errorApi'));
                setLoading(false);
                return;
            }

            try {
                // Fetch both Latest Videos and Upcoming Premieres in parallel using centralized endpoints
                const commonParams = { 
                    key: YOUTUBE_API_KEY, 
                    channelId: YOUTUBE_CHANNEL_ID, 
                    part: 'snippet,id', 
                    order: 'date', 
                    type: 'video' 
                };

                const [latestRes, upcomingRes] = await Promise.all([
                    axios.get(ENDPOINTS.YOUTUBE_SEARCH, { params: { ...commonParams, maxResults: 8 } }),
                    axios.get(ENDPOINTS.YOUTUBE_SEARCH, { params: { ...commonParams, maxResults: 4, eventType: 'upcoming' } })
                ]);

                // Filter out invalid items just to be safe
                setLatestVideos(latestRes.data.items?.filter((item: any) => item.id.videoId) || []);
                setUpcomingVideos(upcomingRes.data.items?.filter((item: any) => item.id.videoId) || []);
            } catch (err: any) {
                const msg = err.response?.data?.error?.message || err.message || t('videos.errorLoad');
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [t]);

    // Format the date to something more readable
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const locale = i18n.language.startsWith('id') ? 'id-ID' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, options);
    };

    return (
        <section id="videos" className="py-16 sm:py-24 px-4 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 sm:mb-20" data-aos="fade-up">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-foreground inline-block bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent italic pe-2">{t('videos.title')}</h2>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">{t('videos.subtitle')}</p>
                    <div className="h-1.5 w-16 sm:w-24 bg-red-600 mx-auto rounded-full mt-6"></div>
                </div>

                <div>
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-6 rounded-2xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                            <AlertCircle className="w-10 h-10 mb-2" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {!loading && !error && upcomingVideos.length > 0 && (
                        <div className="mb-20">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-red-500 tracking-wider" data-aos="fade-right">{t('videos.upcoming')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                {upcomingVideos.map((video, index) => (
                                    <a
                                        key={`upcoming-${index}`}
                                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block outline-none"
                                    >
                                        <Card className="group bg-card border-border overflow-hidden hover:border-red-500/50 transition-all duration-300 card-glow" data-aos="fade-up" data-aos-delay={index * 100}>
                                            <div className="relative aspect-video">
                                                <img
                                                    src={video.snippet.thumbnails.high.url}
                                                    alt={video.snippet.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                    <PlayCircle className="w-16 h-16 text-white/70 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                                </div>
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="destructive" className="font-bold flex items-center gap-1.5 px-3 py-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{t('videos.premiering')}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <h4 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-red-500 transition-colors text-card-foreground" dangerouslySetInnerHTML={{ __html: video.snippet.title }}></h4>
                                                <Badge variant="secondary" className="bg-white/10 text-gray-300 border-none font-medium">
                                                    {formatDate(video.snippet.publishedAt)}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && !error && latestVideos.length === 0 && upcomingVideos.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 font-bold uppercase tracking-widest">{t('videos.empty')}</div>
                    )}

                    {!loading && !error && latestVideos.length > 0 && (
                        <div>
                            <h3 className="text-3xl font-bold mb-8 text-red-500 tracking-wider" data-aos="fade-right">{t('videos.latest')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                {latestVideos.map((video, index) => (
                                    <a
                                        key={`latest-${index}`}
                                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block outline-none"
                                    >
                                        <Card className="group bg-card border-border overflow-hidden hover:border-red-500/50 transition-all duration-300 card-glow" data-aos="fade-up" data-aos-delay={index * 100}>
                                            <div className="relative aspect-video">
                                                <img
                                                    src={video.snippet.thumbnails.high.url}
                                                    alt={video.snippet.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                    <PlayCircle className="w-16 h-16 text-white/70 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <h4 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-red-500 transition-colors text-card-foreground" dangerouslySetInnerHTML={{ __html: video.snippet.title }}></h4>
                                                <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-gray-300 border-none font-medium">
                                                    {formatDate(video.snippet.publishedAt)}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Videos;
