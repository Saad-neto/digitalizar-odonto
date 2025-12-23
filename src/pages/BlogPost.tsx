import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/supabase';
import { PostContent } from '@/components/blog/PostContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Facebook,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useEffect } from 'react';

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-posts', post?.id],
    queryFn: () => getRelatedPosts(post!.id),
    enabled: !!post?.id,
  });

  // Scroll to top when post loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = window.location.href;
    const title = post?.title || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O post que você procura não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {post.featured_image && (
        <div className="w-full h-[400px] bg-gray-200">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {post.category && (
                <Link to={`/blog?categoria=${post.category.slug}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    {post.category.name}
                  </Badge>
                </Link>
              )}
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Eye className="w-4 h-4" />
                {post.view_count} visualizações
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <div>
                <p className="font-medium">{post.author_name}</p>
                <p className="text-sm text-muted-foreground">Autor</p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-8">
              <PostContent content={post.content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium mb-3">Tags:</h3>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tagWrapper: any) => {
                    const tag = tagWrapper.tag;
                    return tag ? (
                      <Link key={tag.id} to={`/blog?tag=${tag.slug}`}>
                        <Badge
                          variant="outline"
                          className="hover:bg-muted cursor-pointer"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-medium mb-3">Compartilhar:</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" onClick={copyLink}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Copiar link
                </Button>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Posts relacionados</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related: any) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition">
                      {related.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={related.featured_image}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2 group-hover:text-primary transition line-clamp-2">
                          {related.title}
                        </h3>
                        {related.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
