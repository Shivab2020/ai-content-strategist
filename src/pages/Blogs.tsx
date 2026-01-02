import { useDomains } from '@/hooks/useDomains';
import { useBlogs } from '@/hooks/useBlogs';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FileText,
  PenTool,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Send,
  Calendar
} from 'lucide-react';
import { BlogStatus } from '@/types';

export default function BlogsPage() {
  const { selectedDomain } = useDomains();
  const { blogs, loading, deleteBlog, updateBlog } = useBlogs(selectedDomain?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case 'published': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  if (!selectedDomain) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">No Domain Selected</h2>
          <p className="text-muted-foreground">Please select or create a domain to view blogs.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">My Blogs</h1>
            <p className="text-muted-foreground mt-1">
              Manage your content for {selectedDomain.name}
            </p>
          </div>
          <Link to="/studio">
            <Button className="gradient-bg">
              <PenTool className="mr-2 h-4 w-4" />
              Create New Blog
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BlogStatus | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-64 bg-muted rounded mb-2" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first blog with the AI Blog Studio'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link to="/studio">
                  <Button className="gradient-bg">
                    <PenTool className="mr-2 h-4 w-4" />
                    Create Your First Blog
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg truncate">{blog.title}</h3>
                        <Badge variant={getStatusColor(blog.status)}>
                          {blog.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {blog.blog_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{blog.word_count} words</span>
                        <span>•</span>
                        <span>{blog.reading_time} min read</span>
                        {blog.primary_keyword && (
                          <>
                            <span>•</span>
                            <span className="text-primary">{blog.primary_keyword}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <ScoreBadge score={blog.seo_score} label="SEO" size="sm" />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {blog.status === 'draft' && (
                            <>
                              <DropdownMenuItem onClick={() => updateBlog(blog.id, { status: 'scheduled' })}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateBlog(blog.id, { status: 'published' })}>
                                <Send className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{blog.title}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBlog(blog.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
