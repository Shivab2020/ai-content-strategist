import { useDomains } from '@/hooks/useDomains';
import { useBlogs } from '@/hooks/useBlogs';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/stat-card';
import { ScoreBadge } from '@/components/ui/score-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  FileText,
  PenTool,
  BarChart3,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { selectedDomain, domains } = useDomains();
  const { blogs, getStats } = useBlogs(selectedDomain?.id);
  const stats = getStats();

  const recentBlogs = blogs.slice(0, 5);

  if (domains.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="h-20 w-20 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-glow animate-float">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">Welcome to ContentAI</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Get started by creating your first domain. A domain represents a brand or website you want to create content for.
          </p>
          <Link to="/domains">
            <Button size="lg" className="gradient-bg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Domain
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your content performance for {selectedDomain?.name}
            </p>
          </div>
          <Link to="/studio">
            <Button className="gradient-bg">
              <PenTool className="mr-2 h-4 w-4" />
              Create New Blog
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Blogs"
            value={stats.total}
            icon={<FileText className="h-6 w-6" />}
          />
          <StatCard
            title="Published"
            value={stats.published}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Avg SEO Score"
            value={stats.avgSeoScore}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <StatCard
            title="Total Words"
            value={stats.totalWords.toLocaleString()}
            icon={<Clock className="h-6 w-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Blogs */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Blogs</CardTitle>
                <CardDescription>Your latest content pieces</CardDescription>
              </div>
              <Link to="/blogs">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentBlogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No blogs yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{blog.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                            {blog.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {blog.word_count} words
                          </span>
                        </div>
                      </div>
                      <ScoreBadge score={blog.seo_score} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Shortcuts to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/studio" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <PenTool className="mr-3 h-4 w-4 text-primary" />
                  AI Blog Studio
                </Button>
              </Link>
              <Link to="/bulk" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Sparkles className="mr-3 h-4 w-4 text-primary" />
                  Bulk Generator
                </Button>
              </Link>
              <Link to="/keywords" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-3 h-4 w-4 text-primary" />
                  Keyword Research
                </Button>
              </Link>
              <Link to="/seo" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-3 h-4 w-4 text-primary" />
                  SEO Analyzer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Content Health */}
        <Card>
          <CardHeader>
            <CardTitle>Content Health Overview</CardTitle>
            <CardDescription>Performance metrics across all your blogs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <ScoreBadge score={stats.avgSeoScore} label="SEO Score" size="lg" />
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-display">{stats.drafts}</div>
                <p className="text-sm text-muted-foreground mt-1">Drafts</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-display">{stats.scheduled}</div>
                <p className="text-sm text-muted-foreground mt-1">Scheduled</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-display">{stats.published}</div>
                <p className="text-sm text-muted-foreground mt-1">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
