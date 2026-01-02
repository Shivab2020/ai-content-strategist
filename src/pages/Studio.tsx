import { useState } from 'react';
import { useDomains } from '@/hooks/useDomains';
import { useBlogs } from '@/hooks/useBlogs';
import { AppLayout } from '@/components/layout/AppLayout';
import { StepIndicator } from '@/components/studio/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Lightbulb,
  Search,
  FileText,
  ListOrdered,
  PenTool,
  BarChart3,
  Image,
  Save
} from 'lucide-react';
import { KeywordSuggestion, TitleVariant, OutlineSection, SEOScores, BlogType } from '@/types';

const steps = [
  { id: 1, name: 'Topic', description: 'Choose your topic' },
  { id: 2, name: 'Keywords', description: 'AI keyword research' },
  { id: 3, name: 'Type', description: 'Pillar or cluster' },
  { id: 4, name: 'Title', description: 'Generate SEO titles' },
  { id: 5, name: 'Outline', description: 'Structure your content' },
  { id: 6, name: 'Content', description: 'Generate full article' },
  { id: 7, name: 'Review', description: 'SEO scoring' },
  { id: 8, name: 'Save', description: 'Save or publish' },
];

export default function StudioPage() {
  const { selectedDomain } = useDomains();
  const { createBlog } = useBlogs(selectedDomain?.id);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step data
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [blogType, setBlogType] = useState<BlogType>('cluster');
  const [titles, setTitles] = useState<TitleVariant[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [outline, setOutline] = useState<OutlineSection[]>([]);
  const [content, setContent] = useState('');
  const [seoScores, setSeoScores] = useState<SEOScores | null>(null);

  const callAI = async (type: string, data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('ai-content', {
        body: { type, ...data, domain: selectedDomain }
      });

      if (error) throw error;
      return response;
    } catch (err) {
      console.error('AI Error:', err);
      toast.error('AI generation failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic first');
      return;
    }

    const result = await callAI('keywords', { topic });
    if (result?.keywords) {
      setKeywords(result.keywords);
      setCurrentStep(2);
    }
  };

  const handleGenerateTitles = async () => {
    if (!selectedKeyword) {
      toast.error('Please select a keyword first');
      return;
    }

    const result = await callAI('titles', { keyword: selectedKeyword, blogType });
    if (result?.titles) {
      setTitles(result.titles);
      setCurrentStep(4);
    }
  };

  const handleGenerateOutline = async () => {
    if (!selectedTitle) {
      toast.error('Please select a title first');
      return;
    }

    const result = await callAI('outline', { title: selectedTitle, keyword: selectedKeyword });
    if (result?.outline) {
      setOutline(result.outline);
      setCurrentStep(5);
    }
  };

  const handleGenerateContent = async () => {
    if (outline.length === 0) {
      toast.error('Please generate an outline first');
      return;
    }

    const result = await callAI('content', { 
      title: selectedTitle, 
      outline, 
      keyword: selectedKeyword 
    });
    if (result?.content) {
      setContent(result.content);
      setSeoScores(result.seoScores);
      setCurrentStep(6);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedDomain) {
      toast.error('Please select a domain first');
      return;
    }

    const wordCount = content.split(/\s+/).length;
    const blog = await createBlog({
      title: selectedTitle,
      primary_keyword: selectedKeyword,
      blog_type: blogType,
      outline,
      content,
      word_count: wordCount,
      reading_time: Math.ceil(wordCount / 200),
      seo_score: seoScores?.overall || 0,
      readability_score: seoScores?.readability || 0,
      keyword_score: seoScores?.keyword_density || 0,
      brand_voice_score: 0,
      status: 'draft',
      slug: null,
      meta_description: null,
      secondary_keywords: null,
      parent_blog_id: null,
      scheduled_at: null,
      published_at: null,
      sanity_document_id: null,
      hero_image_url: null
    });

    if (blog) {
      toast.success('Blog saved as draft!');
      // Reset form
      setCurrentStep(1);
      setTopic('');
      setKeywords([]);
      setSelectedKeyword('');
      setTitles([]);
      setSelectedTitle('');
      setOutline([]);
      setContent('');
      setSeoScores(null);
    }
  };

  if (!selectedDomain) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">No Domain Selected</h2>
          <p className="text-muted-foreground">Please select or create a domain to start generating content.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">AI Blog Studio</h1>
          <p className="text-muted-foreground mt-1">
            Step-by-step guided content creation for {selectedDomain.name}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep}
          onStepClick={(step) => step < currentStep && setCurrentStep(step)}
        />

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Topic */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">What topic do you want to write about?</h2>
                    <p className="text-sm text-muted-foreground">Enter a topic and we'll research keywords for you</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., AI automation for small businesses"
                    className="text-lg py-6"
                  />
                </div>

                <Button 
                  onClick={handleGenerateKeywords} 
                  disabled={loading || !topic.trim()}
                  className="w-full gradient-bg"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Researching Keywords...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Research Keywords
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: Keywords */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Select your primary keyword</h2>
                    <p className="text-sm text-muted-foreground">Choose the best keyword based on intent and difficulty</p>
                  </div>
                </div>

                <RadioGroup value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <div className="space-y-3">
                    {keywords.map((kw, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedKeyword === kw.keyword 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <RadioGroupItem value={kw.keyword} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{kw.keyword}</span>
                            <Badge variant="outline" className="text-xs">{kw.source}</Badge>
                            <Badge 
                              variant={kw.difficulty === 'low' ? 'default' : kw.difficulty === 'medium' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {kw.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{kw.reasoning}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)} 
                    disabled={!selectedKeyword}
                    className="flex-1 gradient-bg"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Blog Type */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Choose content type</h2>
                    <p className="text-sm text-muted-foreground">Is this a pillar article or a cluster post?</p>
                  </div>
                </div>

                <RadioGroup value={blogType} onValueChange={(v) => setBlogType(v as BlogType)}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className={`p-6 rounded-lg border cursor-pointer transition-colors ${
                      blogType === 'pillar' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}>
                      <RadioGroupItem value="pillar" className="sr-only" />
                      <h3 className="font-semibold text-lg mb-2">Pillar Article</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive, long-form content (2000-4000 words) that covers a topic broadly. 
                        Serves as the main hub for related cluster content.
                      </p>
                    </label>

                    <label className={`p-6 rounded-lg border cursor-pointer transition-colors ${
                      blogType === 'cluster' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}>
                      <RadioGroupItem value="cluster" className="sr-only" />
                      <h3 className="font-semibold text-lg mb-2">Cluster Post</h3>
                      <p className="text-sm text-muted-foreground">
                        Focused, specific content (1000-2000 words) that dives deep into a subtopic.
                        Links back to related pillar content.
                      </p>
                    </label>
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleGenerateTitles} 
                    disabled={loading}
                    className="flex-1 gradient-bg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Titles...
                      </>
                    ) : (
                      <>
                        Generate Titles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Title Selection */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PenTool className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Select your title</h2>
                    <p className="text-sm text-muted-foreground">Choose from SEO-optimized title variants</p>
                  </div>
                </div>

                <RadioGroup value={selectedTitle} onValueChange={setSelectedTitle}>
                  <div className="space-y-3">
                    {titles.map((t, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedTitle === t.title 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <RadioGroupItem value={t.title} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium">{t.title}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs uppercase">{t.type}</Badge>
                              <ScoreBadge score={t.score} size="sm" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{t.reasoning}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleGenerateOutline} 
                    disabled={loading || !selectedTitle}
                    className="flex-1 gradient-bg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Outline...
                      </>
                    ) : (
                      <>
                        Generate Outline
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Outline */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ListOrdered className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Review your outline</h2>
                    <p className="text-sm text-muted-foreground">This will be used to generate your content</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {outline.map((section, idx) => (
                    <div key={idx} className="p-4 rounded-lg border bg-muted/30">
                      <h3 className={`font-semibold ${
                        section.level === 'h2' ? 'text-lg' : section.level === 'h3' ? 'text-base' : 'text-sm'
                      }`}>
                        {section.heading}
                      </h3>
                      {section.points.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {section.points.map((point, pIdx) => (
                            <li key={pIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(4)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={loading}
                    className="flex-1 gradient-bg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Writing Content...
                      </>
                    ) : (
                      <>
                        Generate Full Content
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6: Content & Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Review your content</h2>
                    <p className="text-sm text-muted-foreground">SEO analysis and final review</p>
                  </div>
                </div>

                {/* SEO Scores */}
                {seoScores && (
                  <div className="grid gap-4 md:grid-cols-5 p-4 rounded-lg bg-muted/50">
                    <ScoreBadge score={seoScores.overall} label="Overall" size="lg" />
                    <ScoreBadge score={seoScores.readability} label="Readability" size="lg" />
                    <ScoreBadge score={seoScores.keyword_density} label="Keywords" size="lg" />
                    <ScoreBadge score={seoScores.structure} label="Structure" size="lg" />
                    <ScoreBadge score={seoScores.meta_quality} label="Meta" size="lg" />
                  </div>
                )}

                {/* Content Preview */}
                <div className="space-y-2">
                  <Label>Generated Content</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {content.split(/\s+/).length} words • ~{Math.ceil(content.split(/\s+/).length / 200)} min read
                  </p>
                </div>

                {/* Suggestions */}
                {seoScores?.suggestions && seoScores.suggestions.length > 0 && (
                  <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
                    <h4 className="font-medium text-warning mb-2">Improvement Suggestions</h4>
                    <ul className="space-y-1">
                      {seoScores.suggestions.map((s, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-warning">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(5)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleSaveDraft} 
                    disabled={loading}
                    className="flex-1 gradient-bg"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
