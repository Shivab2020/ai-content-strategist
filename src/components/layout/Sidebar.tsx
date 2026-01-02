import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  PenTool,
  FileText,
  Search,
  BarChart3,
  Image,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Blog Studio', href: '/studio', icon: PenTool, accent: true },
  { name: 'Bulk Generator', href: '/bulk', icon: Zap },
  { name: 'My Blogs', href: '/blogs', icon: FileText },
  { name: 'Keyword Lab', href: '/keywords', icon: Search },
  { name: 'SEO Analyzer', href: '/seo', icon: BarChart3 },
  { name: 'Image Generator', href: '/images', icon: Image },
  { name: 'Social Content', href: '/social', icon: Share2 },
  { name: 'Domains', href: '/domains', icon: Globe },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "relative flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-sidebar-foreground">ContentAI</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  item.accent && !isActive && "text-primary",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", item.accent && "text-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
            <p className="text-xs font-medium text-sidebar-foreground">Pro Tip</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the AI Blog Studio for step-by-step guided content creation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
