import { useState } from 'react';
import { useDomains } from '@/hooks/useDomains';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, TrendingUp, Sparkles, Copy, Check } from 'lucide-react';
import { KeywordSuggestion } from '@/types';

export default function KeywordsPage() {
  const { selectedDomain } = useDomains();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleResearch = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content', {
        body: { type: 'keywords', topic, domain: selectedDomain }
      });

      if (error) throw error;
      setKeywords(data.keywords || []);
      toast.success(`Found ${data.keywords?.length || 0} keyword suggestions`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to research keywords');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard');
  };

  if (!selectedDomain) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">No Domain Selected</h2>
          <p className="text-muted-foreground">Please select a domain to research keywords.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Keyword Lab</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered keyword research for {selectedDomain.name}
          </p>
        </div>

        {/* Research Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Discover Keywords
            </CardTitle>
            <CardDescription>
              Enter a topic to discover high-value keywords using AI and Google Suggest data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="topic" className="sr-only">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., email marketing automation"
                  className="text-lg py-6"
                  onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                />
              </div>
              <Button
                onClick={handleResearch}
                disabled={loading || !topic.trim()}
                className="gradient-bg px-8"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Research
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {keywords.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Found {keywords.length} Keywords
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {keywords.map((kw, idx) => (
                <Card key={idx} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{kw.keyword}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(kw.keyword, idx)}
                          >
                            {copiedIndex === idx ? (
                              <Check className="h-3 w-3 text-success" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {kw.source}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {kw.intent}
                          </Badge>
                          <Badge
                            variant={
                              kw.difficulty === 'low' ? 'default' :
                              kw.difficulty === 'medium' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {kw.difficulty} difficulty
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{kw.reasoning}</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-primary shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {keywords.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Research</h3>
              <p className="text-muted-foreground">
                Enter a topic above to discover AI-powered keyword suggestions
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
