import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sparkles, 
  PenTool, 
  Search, 
  BarChart3, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Globe,
  Image,
  Share2
} from 'lucide-react';

const features = [
  {
    icon: PenTool,
    title: 'AI Blog Studio',
    description: 'Step-by-step guided content creation with AI assistance at every stage.'
  },
  {
    icon: Search,
    title: 'Keyword Research',
    description: 'AI-powered keyword discovery using Google Suggest and trend analysis.'
  },
  {
    icon: BarChart3,
    title: 'SEO Scoring',
    description: 'Real-time SEO analysis with actionable improvement suggestions.'
  },
  {
    icon: Zap,
    title: 'Bulk Generation',
    description: 'Generate multiple SEO-optimized blogs automatically.'
  },
  {
    icon: Globe,
    title: 'Multi-Domain',
    description: 'Manage content for multiple brands with unique voice settings.'
  },
  {
    icon: Image,
    title: 'AI Images',
    description: 'Generate stunning blog images and social media graphics.'
  }
];

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen gradient-hero-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl">ContentAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            ) : user ? (
              <Link to="/dashboard">
                <Button className="gradient-bg">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="gradient-bg">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Content Intelligence Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in-up">
            Create SEO-Optimized{' '}
            <span className="gradient-text">Blog Content</span>{' '}
            at Scale
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            From keyword research to publishing — AI guides every step of your content strategy. 
            Generate, score, and publish high-quality blogs that rank.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth">
              <Button size="lg" className="gradient-bg text-lg px-8 py-6 shadow-glow">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Free tier available
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything You Need for Content Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete content operations platform that combines AI intelligence with SEO best practices.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-card border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl gradient-bg">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who use ContentAI to produce high-ranking blog content.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>ContentAI © 2024</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
